import { ServiceBase } from "@services/ServiceBase";
import { ResponseWithData } from "@models/PagedRequest";

export interface Language {
  name: string;
  nativeName: string;
  iso6391: string;
  fileName: string;
  fileReference: string;
  version: string;
}
class TranslationService extends ServiceBase {
  protected static BASE_URL = "Translations";

  public static getTranslations(): Promise<ResponseWithData<Language[]>> {
    return this.get("/versions");
  }
}
export default TranslationService;
