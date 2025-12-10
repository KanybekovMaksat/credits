import { ServiceBase } from "@services/ServiceBase";

export interface ReportPdfRequest {
  accountId: string;
  from: string;
  to: string;
}
class ReportService extends ServiceBase {
  protected static BASE_URL = "reports";

  public static downloadReport(props: ReportPdfRequest): Promise<any> {
    return this.get(
      `/statement/pdf?accountId=${props.accountId}&from=${props.from}&to=${props.to}`,
      null,
      {
        "Content-Type": null,
      }
    );
  }
}

export default ReportService;
