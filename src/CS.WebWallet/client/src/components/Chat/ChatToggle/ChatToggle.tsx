import React, { useState } from "react";
import "./styles.scss";
import Chat from "../ChatView";
import chatIcon from "/icons/chatIcon.svg";
import useClickOutside from "../../../hooks/useClickOutside";

const ChatToggle: React.FC = () => {
  const [chatActive, setChatActive] = useState<boolean>(false);

  const chatRef = useClickOutside(() => {
    setChatActive(false);
  });

  const onClickToggle = () => {
    setChatActive(true);
  };

  return (
    <>
      <Chat isVisible={chatActive} chatRef={chatRef} />
      <div className="chat-toggle">
        {/* пин для отображения кол-ва непрочитанных сообщений
        <div className="chat-toggle-pin">1</div>
        */}
        {chatActive ? (
          <div className="close-chat" />
        ) : (
          <div className="chatIcon" onClick={onClickToggle}>
            <img src={chatIcon} alt="chat icon" />
          </div>
        )}
      </div>
    </>
  );
};

export default ChatToggle;
