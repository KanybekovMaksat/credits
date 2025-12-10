import { ResponseWithData } from "@models/PagedRequest";
import { ServiceBase } from "./ServiceBase";

export interface RateResponse {
  allowed?: boolean;
  amountFrom?: string;
  amountTo?: string;
  fee?: string;
  rate: string;
  pair?: string;
  documentId?: string;
}
export interface RateRequest {
  addressTo?: string;
  addressFrom?: string;
  amountFrom?: string;
  amountTo?: string;
  documentId?: string;
}

export interface ExchangeRequest {
  documentId?: string | null;
  confirmed: boolean;
}

class ExchangeService extends ServiceBase {
  protected static BASE_URL = "Exchange";

  public static makeExchange(
    props: ExchangeRequest
  ): Promise<ResponseWithData<any>> {
    return this.post("/make", props);
  }

  public static rate(
    props: RateRequest
  ): Promise<ResponseWithData<RateResponse>> {
    return this.post("/rate", props);
  }

  public static getSimpleRate(
    from: number,
    to: number
  ): Promise<ResponseWithData<string>> {
    return this.get(`/rate?from=${from}&to=${to}`);
  }
}

export default ExchangeService;
