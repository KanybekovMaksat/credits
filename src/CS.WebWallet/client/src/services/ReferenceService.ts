import { ServiceBase } from "@services/ServiceBase";
import { ResponseWithData } from "@models/PagedRequest";

export interface CountryRow {
  id: string;
  name: string;
  nativeName: string;
  isBlocked: boolean;
  phoneCodes: string[];
}

export interface Banner {
  id: string;
  placement: number;
  imageUrl?: string;
  icon: string;
  link: string;
  text: string;
  title: string;
  subTitle: string;
  textColor: string;
  colorOne: string;
  colorTwo: string;
  anchors: string[];
}

export class ReferenceService extends ServiceBase {
  protected static BASE_URL = "references";

  public static countries(): Promise<ResponseWithData<CountryRow[]>> {
    return this.get(`/countries`);
  }

  public static getBanners(): Promise<ResponseWithData<Banner[]>> {
    return this.get(`/banners`);
  }
}
