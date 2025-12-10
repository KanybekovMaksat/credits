import React, { useEffect, useState, useRef, RefObject } from "react";
import "./styles.scss";
import { useStore } from "effector-react";
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from "@microsoft/signalr";
import moment from "moment";
import {
  $chatStore,
  $messageReceived,
  $messageRemoved,
  $messageUpdated,
  getMessagesFx,
} from "./store/chat";
import ChatService, {
  FileReference,
  Message,
} from "@services/chats/ChatService";
import { CHAT_URL } from "@services/chats/ChatsBase";
import { Col, Row } from "@components/Layouts/RowLayout";
import sendIcon from "/icons/sendMessage.svg";
import fileDownload from "/icons/fileDownload.svg";
import CrossIcon from "@components/Icons/CrossIcon";
import { useTranslation } from "react-i18next";

interface chatProps {
  isVisible: boolean;
  chatRef: RefObject<HTMLDivElement>;
}

const Chat: React.FC<chatProps> = (props: chatProps) => {
  const { isVisible, chatRef } = props;
  const { t } = useTranslation();

  const $chat = useStore($chatStore);
  const [connection, setConnection] = useState<HubConnection>();
  const [sendMessage, setSendMessage] = useState<string>();
  const [uploadFile, setUploadFile] = useState<File>();
  const [typing, setIsTyping] = useState<boolean>(false);

  const endRef = useRef<HTMLInputElement>(null);

  const scrollToEnd = () => {
    if (isVisible && endRef.current) {
      endRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    scrollToEnd();
  }, [isVisible, $chat.messages]);

  useEffect(() => {
    getMessagesFx();
  }, []);

  useEffect(() => {
    if (!connection) {
      const newConnection = new HubConnectionBuilder()
        .withUrl(`${CHAT_URL}/chathub`)
        .configureLogging(LogLevel.None)
        .withAutomaticReconnect()
        .build();

      setConnection(newConnection);
    }
  }, [connection]);

  const fileUpload = (e: any) => {
    if (e.target && e.target.files.length > 0) {
      setUploadFile(e.target.files[0]);
    }
  };

  const resetTyping = () => {
    setIsTyping(false);
  };

  useEffect(() => {
    if (connection && connection.state === HubConnectionState.Disconnected) {
      connection
        .start()
        .then(() => {
          connection.on("SendMessage", (newMessage) => {
            $messageReceived(newMessage);
          });
          connection.on("MessageDeleted", (args: string) => {
            $messageRemoved(args);
          });
          connection.on("MessageUpdated", (updatedMessage) => {
            $messageUpdated(updatedMessage);
          });
          connection.on("Typing", () => {
            setIsTyping(true);
            resetTyping();
          });
        })
        .catch((e) => console.log("Connection failed: ", e));
    }
  }, [connection, resetTyping]);

  const sendMessageClick = async () => {
    const uploadResult = {
      fileReference: null,
      fileUrl: null,
    };
    if (uploadFile) {
      const res = await ChatService.uploadFile({ file: uploadFile });
      if (res.success) {
        uploadResult.fileReference = res.data.fileReference;
        uploadResult.fileUrl = res.data.fileUrl;
      } else {
        alert("Cannot upload file");
        return false;
      }
    }

    if (connection) {
      try {
        await connection.send("Send", {
          message: sendMessage,
          fileReferences: uploadResult.fileReference
            ? [uploadResult.fileReference]
            : [],
        });
        setUploadFile(undefined);
      } catch (e) {
        console.log(e);
      }
    } else {
      alert("No connection to server yet.");
    }
    setSendMessage("");

    return true;
  };

  const formatDate = (value: string) => {
    return moment(value).format("DD.MM HH:mm");
  };

  const renderFiles = (files: FileReference[]) => {
    if (!files.length) {
      return <></>;
    }
    return files.map((value) => (
      <a
        href={value.fileReference}
        download={value.fileName}
        key={value.fileReference}
        target="_blank"
        rel="noopener noreferrer"
      >
        {!!value.contentType && value.contentType.startsWith("image") ? (
          <img src={value.fileReference} alt="image" width={120} />
        ) : (
          <span>{value.fileName}</span>
        )}
      </a>
    ));
  };

  return (
    <>
      {isVisible && (
        <div className="chat" ref={chatRef}>
          <Row className="chat-header">{t("chat_title")}</Row>
          <div className="chat-container">
            {$chat.messages.map((message: Message) => {
              const fromCustomer = message.customer.creatorType === 1;
              const isSystem = message.customer.creatorType === 3;

              return (
                <Row
                  key={message.created}
                  className={`message ${
                    fromCustomer ? "outgoing" : "incoming"
                  }`}
                >
                  <Col className="img-area">
                    <Col className="ellipse-img-chat">
                      {fromCustomer ? <span>C</span> : <div>S</div>}
                    </Col>
                  </Col>
                  <Col className="message-container">
                    <Col className="text-content">
                      <pre style={{wordSpacing: "pre-wrap"}}>
                        {isSystem ? (
                          <i>{message.message}</i>
                        ) : (
                          <>{message.message}</>
                        )}
                      </pre>
                      <span className="message-files">
                        {renderFiles(message.fileReferences)}
                      </span>
                    </Col>
                    <span className="time">{formatDate(message.created)}</span>
                  </Col>
                </Row>
              );
            })}
            {typing && <span>{t("operator_typing")}</span>}
            <div ref={endRef} />
          </div>
          {uploadFile && (
            <div className="file-attachment">
              <div className="title">{uploadFile?.name}</div>
              <div className="cross" onClick={() => setUploadFile(undefined)}>
                <CrossIcon color="#7e7e7e" />
              </div>
            </div>
          )}
          <Row className="input-container">
            <input
              type="text"
              className="message-input"
              placeholder="Type a message"
              value={sendMessage}
              onChange={(event) => setSendMessage(event.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessageClick()}
            />

            <div className="file-choose-container">
              <input
                type="file"
                onChange={(value) => fileUpload(value)}
                id="actual-btn"
                hidden
                name="file"
              />
              <label className="upload-file-button" htmlFor="actual-btn">
                <img src={fileDownload} alt="fileDownload" />
              </label>
            </div>

            <button
              className="send-button"
              type="submit"
              onClick={() => sendMessageClick()}
            >
              <img src={sendIcon} alt="sendIcon" className="sendIcon" />
            </button>
          </Row>
        </div>
      )}
    </>
  );
};

export default Chat;
