import { ServiceBase } from "@services/ServiceBase";
import { ResponseWithData, ResponseWithoutData } from "@models/PagedRequest";

export interface AddCardRequest {
  number: string;
  holderName: string;
  expireMonth: string;
  expireYear: string;
  securityCode: string;
}

export interface Card {
  isVerified: boolean;
  id: string;
  url: string;
  maskedPan: string;
  holder: string;
  status: number;
}

export interface IssuedCardBalance {
  amount: string;
  symbol: string;
  fiatBalance: {
    symbol: string;
    amount: string;
  };
}
export interface IssuedCard {
  id: string;
  internalAccountId: string;
  currency: string;
  pan: string;
  holder: string;
  expiryMonth: string;
  expiryYear: string;
  type: number;
  status: number;
  pin?: string;
  balance: IssuedCardBalance;
  url: string;
}
export interface IssuedCardActivationResponse {
  requestKey: string;
  requiresConfirmation: boolean;
  url: string;
}
class CardsService extends ServiceBase {
  protected static BASE_URL = "Cards";

  public static list(): Promise<ResponseWithData<Card[]>> {
    return this.get("/list");
  }

  public static verify(props: {
    cardId: string;
    securityCode: string;
    successUrl: string;
    failureUrl: string;
  }): Promise<ResponseWithData<{ url?: string }>> {
    return this.post(`/verify`, props);
  }

  public static removeCard(id: string | null): Promise<ResponseWithoutData> {
    return this.delete(`/${id}`);
  }

  public static addCard(
    props: AddCardRequest
  ): Promise<ResponseWithData<Card>> {
    return this.post("", props);
  }

  public static issuedCards(): Promise<ResponseWithData<IssuedCard[]>> {
    return this.get("/issued/list");
  }

  public static requsites(
    cardId: string
  ): Promise<ResponseWithData<IssuedCard>> {
    return this.post(`/issued/requisites`, { cardId });
  }

  public static activateIssued(
    cardId: string
  ): Promise<ResponseWithData<IssuedCardActivationResponse>> {
    return this.post(`/issued/activate`, { cardId });
  }

  public static checkPassword(cardId: string): Promise<ResponseWithData<any>> {
    return this.post(`/issued/password`, { cardId });
  }

  public static setPassword(
    cardId: string,
    password: string
  ): Promise<ResponseWithData<any>> {
    return this.post(`/issued/password`, { cardId, password });
  }

  public static confirmActivation(
    key: string,
    code: string
  ): Promise<ResponseWithData<IssuedCardActivationResponse>> {
    return this.post(`/issued/activate/confirm`, { key, code });
  }
}

export default CardsService;
