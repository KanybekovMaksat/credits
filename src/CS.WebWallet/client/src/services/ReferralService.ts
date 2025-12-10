import { ServiceBase } from "@services/ServiceBase";
import { ResponseWithData } from "@models/PagedRequest";

export interface HistoryParam {
  key: string;
  value: string;
}
export interface ReferralHistory {
  id: string;
  referredClientId: number;
  referredClientName: string;
  referralToken: string;
  referralStatus: number;
  created: string;
  params: HistoryParam[];
}

export interface ReferralResponse {
  token: string;
  referralUrl: string;
}
class ReferralService extends ServiceBase {
  protected static BASE_URL = "referrals";

  public static token(): Promise<ResponseWithData<ReferralResponse>> {
    return this.get("/token");
  }

  public static history(
    props: any
  ): Promise<ResponseWithData<ReferralHistory[]>> {
    return this.post("/history", {
      pageIndex: 1,
      pageSize: 100,
      ...props,
    });
  }
}

export default ReferralService;
