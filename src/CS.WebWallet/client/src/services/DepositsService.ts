import { ServiceBase } from "./ServiceBase";
import { ResponseWithData, ResponseWithoutData } from "@models/PagedRequest";

export interface CtorParamsRequest {
  allowReplenish?: boolean;
  allowWithdraw?: boolean;
  interestOnDepositAccount?: boolean;
  isDefault?: boolean;
  currencyId?: number;
  amount?: number;
  period?: DepPeriod;
}

export interface CtorRequest {
  showcaseItemId?: number;
  updates?: CtorParamsRequest;
}

export interface Value {
  amount: number;
  formated: string;
  currency: string;
}

export interface FlagResponse {
  value: boolean;
  isLocked: boolean;
}

export interface DepCurrency {
  id: number;
  iconUrl: string;
  code: string;
  name: string;
}

export interface DepPeriod {
  period: number;
  count: number;
}

export interface Deposit {
  id: string;
  annualPercent: string;
  initialAnnualPercent: string;
  fullAmount: string;
  interestAmount: string;
  fromDate: string;
  toDate: string;
  currency: DepCurrency;
  period: DepPeriod;
}

export interface CtorResponse {
  minAmount: Value;
  maxAmount: Value;
  allowReplenish: FlagResponse;
  allowWithdraw: FlagResponse;
  interestOnDepositAccount: FlagResponse;
  deposit: Deposit;
  currencies: DepCurrency[];
  periods: DepPeriod[];
}

export interface CreateDepositRequest {
  eulaAccepted: boolean;
  amount: number;
  showCaseItemId: number;
  depositProgramRowId: string;
  comment: string;
}

export interface DepositsRequest {
  showClosed: boolean;
}

export interface DepositAccount {
  id: string;
  icon: string;
  code: string;
  type: number;
  amount: Value;
}

export interface ClientDeposit {
  id: string;
  status: number;
  nextInterestAmount: Value;
  currency: DepCurrency;
  nextInterestDate: string;
  depositDate: string;
  expireDate: string;
  depositAccount: DepositAccount;
  interestAccount: DepositAccount;
  interestPaid: Value;
}

export interface DepositResponse {
  activeAmount: Value;
  closeAmount: Value;
  deposits: ClientDeposit[];
}

class DepositsService extends ServiceBase {
  protected static BASE_URL = "deposits";

  public static getCtor(
    req: CtorRequest
  ): Promise<ResponseWithData<CtorResponse>> {
    return this.post("/constructor", req);
  }

  public static create(
    req: CreateDepositRequest
  ): Promise<ResponseWithData<CtorResponse>> {
    return this.post("", req);
  }

  public static getDeposits(
    req: DepositsRequest
  ): Promise<ResponseWithData<DepositResponse>> {
    return this.get("", req);
  }

  public static closeDeposit(id: string): Promise<ResponseWithoutData> {
    return this.delete(`/${id}`);
  }
}

export default DepositsService;
