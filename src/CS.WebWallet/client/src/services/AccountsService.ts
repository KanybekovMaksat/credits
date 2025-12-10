import { PageContextRequest, ResponseWithData } from "@models/PagedRequest";
import { ServiceBase } from "./ServiceBase";

export interface AccountAlert {
  level: number;
  currencyId: number;
  currencyCode: string;
  message: "string";
}

export interface ExchangesTo {
  id: string;
  isBase: boolean;
  baseIncrement: number;
  baseMinSize: string;
  rate: string;
}

export interface OperationDetails {
  operationType: number;
  requirement: number;
  from?: string;
  to?: string;
  rate: number;
}

export interface AllowedOperations {
  transfer: OperationDetails[];
  topUp: OperationDetails[];
  exchange: OperationDetails[];
}
export interface AccountRow {
  accountId: string;
  fraction: number;
  amount: string;
  currencyAmount: string;
  icon: string;
  ticker: string;
  text: string;
  title: string;
  name: string;
  currencyId: number;
  type: number;
  currencyName: string;
  currencySymbol: string;
  externalKey: string;
  isCrypto: boolean;
  operations: AllowedOperations;
  alerts: AccountAlert[];
}

export interface AccountsFilter {
  ids?: string[];
}

class AccountsService extends ServiceBase {
  protected static BASE_URL = "Accounts";

  public static accounts(
    props: PageContextRequest<AccountsFilter>
  ): Promise<ResponseWithData<AccountRow[]>> {
    return this.post("/page", props);
  }
}

export default AccountsService;
