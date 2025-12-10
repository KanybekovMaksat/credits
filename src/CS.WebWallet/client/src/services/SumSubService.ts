import { ServiceBase } from "@services/ServiceBase";
import { ResponseWithData } from "@models/PagedRequest";

export interface SumSubToken {
  token: string;
}

export class SumSubService extends ServiceBase {
  protected static BASE_URL = "SumSub";

  public static getToken(): Promise<ResponseWithData<SumSubToken>> {
    return this.get(`/get-token`);
  }
}
