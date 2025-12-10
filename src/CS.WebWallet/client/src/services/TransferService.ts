import { ResponseWithData } from "@models/PagedRequest";
import { ServiceBase } from "./ServiceBase";

export interface RequisitesResponse {
  iban: string;
  bankAddress: string;
  bankName: string;
  bic: string;
  recipient: string;
  paymentPurpose: string;
  info: string;
}

export interface TransferRespondent {
  firstName?: string;
  lastName?: string;
  countryId?: string;
  externalId?: string;
  cardId?: string;
  beneficiaryAddress?: string;
  beneficiaryIban?: string;
  beneficiarySwift?: string;
  beneficiaryBankName?: string;
  beneficiaryBankAddress?: string;
  purpose?: string;
  purposeAdditional?: string;
  intermediaryBankName?: string;
  intermediaryBankAddress?: string;
}

export interface TransferCheckRequest {
  documentId?: string;
  amountFrom?: string | number;
  amountTo?: string | number;
  accountFromId?: string;
  accountToId?: string;
  respondent?: TransferRespondent;
  usesBonus?: boolean;
}

export interface TransferSubmitRequest {
  documentId?: string | null;
  confirmed: boolean;
  otp?: string | null; // OTP to confirm operation
  securityCode?: string | null; // something like CVV or card password
}

export interface TransferCurrency {
  id: number;
  size: string;
  ticker: string;
}

export interface TransferRate {
  base: string;
  quoted: string;
  rate: number;
}

export interface TransferCheckResponse {
  allowed: boolean;
  documentId: string;
  amountFrom: TransferCurrency;
  amountTo: TransferCurrency;
  fee: TransferCurrency;
  rate: TransferRate;
}

export interface SubmitOtp {
  validated: boolean;
  otp?: string;
  resendAfter: number;
  validFor: number;
}

export interface TransferSubmitResponse {
  requiresConfirmation: boolean;
  documentId: string;
  status: number;
  confirmUrl: string;
  fee: string;
  amount: string;
  otp?: SubmitOtp;
}

export interface BankCheckProps {
  accountFromId: string;
  beneficiaryIban: string;
  beneficiarySwift: string;
  firstName: string;
  lastName: string;
  amount: number;
  beneficiaryCountryId: string;
  purpose: string;
  documentId?: string;
}

class TransferService extends ServiceBase {
  protected static BASE_URL = "transfers";

  public static getRequisites(
    accountId: string
  ): Promise<ResponseWithData<RequisitesResponse>> {
    return this.get("/requisites", { accountId });
  }

  public static check(
    props: TransferCheckRequest
  ): Promise<ResponseWithData<TransferCheckResponse>> {
    return this.post("/check", props);
  }

  public static submit(
    props: TransferSubmitRequest
  ): Promise<ResponseWithData<TransferSubmitResponse>> {
    return this.post("/submit", props);
  }

  public static resendOtp(props: {
    documentId: string;
  }): Promise<ResponseWithData<SubmitOtp>> {
    return this.post("/otp/resend", props);
  }
}

export default TransferService;
