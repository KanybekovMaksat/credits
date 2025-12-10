import { ServiceBase } from "@services/ServiceBase";
import { ResponseWithData } from "@models/PagedRequest";

export interface TagsFilter {
  tag: string;
  currencyId?: number;
  businessOperationId?: number;
}
export interface DisplayableMessagesProps {
  iso6391: string;
  tags?: TagsFilter[];
}

export interface DisplayableMessageRow {
  tag: string;
  title: string;
  text: string;
  currencyId: number;
  businessOperationId: number;
}
class DisplayableMessagesService extends ServiceBase {
  protected static BASE_URL = "DisplayableMessages";

  public static all(
    props: DisplayableMessagesProps
  ): Promise<ResponseWithData<DisplayableMessageRow[]>> {
    return this.post("", props);
  }
}

export default DisplayableMessagesService;
