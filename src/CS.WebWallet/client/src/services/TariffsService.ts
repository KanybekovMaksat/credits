import { ServiceBase } from "@services/ServiceBase";
import { ResponseWithData, ResponseWithoutData } from "@models/PagedRequest";
import { KycStage } from "./KycV2Service";

export interface TariffResponse {
  id: string;
  name: string;
  description: string;
  title: string;
  summary: string;
  paymentPeriod: number;
  feeAmount: string;
  icon: string;
  eula: string;
  eulaLink: string;
  link: string;
  message: string;
  isCurrent: boolean;
  canBeRequested: boolean;
  requiredKycStages: KycStage[];
}

class TariffsService extends ServiceBase {
  protected static BASE_URL = "tariffs";

  public static list(): Promise<ResponseWithData<TariffResponse[]>> {
    return this.get("/");
  }

  public static activate(tariffId: string): Promise<ResponseWithoutData> {
    return this.post(`/${tariffId}`);
  }
}

export default TariffsService;
