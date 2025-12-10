import { PageContextRequest, ResponseWithData } from "@models/PagedRequest";
import { ChatsBase } from "./ChatsBase";

export interface FileReference {
  fileUrl: string;
  contentType: string;
  fileName: string;
  fileReference: string;
}
export interface Message {
  id: string;
  conversationId: string;
  message: string;
  created: string;
  customer: {
    creatorId: number;
    creatorType: number;
  };
  fileReferences: FileReference[];
}

export interface UploadFile {
  file: File;
}

class ChatService extends ChatsBase {
  protected static BASE_URL = "api/ChatMessage";

  public static messages(
    props: PageContextRequest<never>
  ): Promise<ResponseWithData<Message[]>> {
    return this.post("/page", props);
  }

  public static uploadFile(props: UploadFile): Promise<ResponseWithData<any>> {
    const data = new FormData();
    data.append("file", props.file);
    return this.put("/file", data, {
      "Content-Type": null,
      Accept: "text/plain",
    });
  }
}

export default ChatService;
