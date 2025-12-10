import { ServiceBase } from "@services/ServiceBase";
import { ResponseWithData } from "@models/PagedRequest";

export interface ShowcaseKyc {
  id: number;
  providerId: number;
  stage: number;
  kycUrl: string;
  kycToken: string;
}

export interface ShowcaseItem {
  id: number;
  order: number;
  icon: string;
  needToAcceptEULA: boolean;
  eula: string;
  eulaLink: string;
  requested: boolean;
  message: string;
  showcaseType: number;
  title: string;
  text: string;
  requiredKycStages: ShowcaseKyc[];
}

export interface ShowcaseRequestResponse {
  requestId: number;
  status: number;
  kycToken: string;
}

class ShowcasesService extends ServiceBase {
  protected static BASE_URL = "Showcases";

  public static list(
    locale: string
  ): Promise<ResponseWithData<ShowcaseItem[]>> {
    return this.get(`/list?iso6391=${locale}`);
  }

  public static makeRequest(
    id: number,
    accepted?: boolean
  ): Promise<ResponseWithData<ShowcaseRequestResponse>> {
    return this.post("/requests", {
      showcaseItemId: id,
      eulaAccepted: accepted,
    });
  }
}

export default ShowcasesService;
