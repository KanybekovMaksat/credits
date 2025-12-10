import { PageContextRequest, ResponseWithData } from "@models/PagedRequest";
import { ServiceBase } from "./ServiceBase";

export enum HistoryTypes {
  Unknown,
  Transfer,
  Withdraw,
  TopUp,
  Exchange,
  BuyCrypto,
  BankTransfer,
  BankTransferCommission,
  CardSpend,
  Deposit,
}

export enum HistoryStatuses {
  Unknown,
  Pending,
  Success,
  Failed,
}

export interface HistoryRow {
  id: string;
  type: number;
  status: number;
  date: string;
  iconUrl?: string;
  income: boolean;

  fee?: {
    amount?: string;
    ticker?: string;
    name?: string;
    symbol?: string;
  };
  sum?: {
    amount?: string;
    name?: string;
    ticker?: string;
    symbol?: string;
  };

  transfer?: {
    wallet?: string;
    account?: string;
    explorerUrl?: string;
    externalId?: string;
  };

  withdraw?: {
    card?: string;
    recipient?: string;
  };

  topUp?: {
    card?: string;
  };

  exchange?: {
    rate?: {
      amount?: string;
      from?: string;
      to?: string;
    };
    payed?: {
      amount?: string;
      ticker?: string;
      name?: string;
      symbol?: string;
    };
  };
  buyCrypto?: {
    card?: string;
    wallet?: string;
    explorerUrl?: string;
    externalId?: string;
    payed: {
      amount?: string;
      ticker?: string;
      name?: string;
      symbol?: string;
    };
    rate: {
      amount?: string;
      from?: string;
      to?: string;
    };
  };
  bankTransfer?: {
    type: number;
    iban: string;
    name: string;
    purpose: string;
  };
}

export interface HistoryFilter {
  operationType?: number;
  accountId?: string;
}

export interface TransactionDetailsFilter {
  transactionId: string;
}

class HistoryService extends ServiceBase {
  protected static BASE_URL = "History";

  public static getHistory(
    props: PageContextRequest<HistoryFilter>
  ): Promise<ResponseWithData<HistoryRow[]>> {
    return this.post("", props);
  }

  public static getTransactionDetails(
    props: TransactionDetailsFilter
  ): Promise<ResponseWithData<HistoryRow>> {
    return this.get(`/${props.transactionId}`);
  }
}

export default HistoryService;
