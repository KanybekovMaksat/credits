import { ResponseWithData, ResponseWithoutData } from "@models/PagedRequest";
import { ServiceBase } from "./ServiceBase";

export interface Me {
  clientId: number;
}

export interface Auth {
  phone?: string;
  countryId?: string;
  email?: string;
  appKey: string;
  token?: string;
  referral?: string;
  referralParams?: any;
  termsAccepted: boolean;
}

export interface Totp {
  code: string;
}

interface AuthResult {
  access: string;
  refresh: string;
  isNeed2FA: boolean;
  hash: string;
}

class IdentityService extends ServiceBase {
  protected static BASE_URL = "identity";

  public static login(props: Auth): Promise<ResponseWithData<AuthResult>> {
    return this.post("/login", props);
  }

  public static totp(props: Totp): Promise<ResponseWithData<AuthResult>> {
    return this.post("/confirm-code", { code: props.code });
  }

  public static logout(): Promise<ResponseWithoutData> {
    return this.post("/logout");
  }

  public static me(): Promise<ResponseWithData<Me>> {
    return this.get("/me");
  }

  public static ping(): Promise<ResponseWithoutData> {
    return this.get("/ping");
  }
}

export default IdentityService;
