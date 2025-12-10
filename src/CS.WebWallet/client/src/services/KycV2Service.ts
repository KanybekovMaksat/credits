import { ServiceBase } from "@services/ServiceBase";
import { ResponseWithData, ResponseWithoutData } from "@models/PagedRequest";
import urlToFile from "../helpers/urlToFile";

export interface KycStage {
  id: number;
  providerId: number;
  stage: number;
  status: number;
  kycToken: string;
  note: string;
  required: boolean;
}

export interface KycStatus {
  note: string;
  stages: KycStage[];
}

export interface PersonalInformation {
  phone: string;
  mail: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  dateOfBirth?: string | undefined;
  gender: number;
  address: {
    countryId: string;
    region: string;
    state: string;
    city: string;
    street: string;
    building: string;
    buildingNumber: string;
    flat: string;
    postCode: string;
  };
}
export interface UpdatePersonalProps {
  stageId: number;
  firstName: string;
  lastName: string;
  countryId: string;
  city: string;
  postalCode: string;
  street: string;
  state: string;
  building: string;
  flat: string;
  dateOfBirth: string;
  nationality: string;
  placeOfBirth: string;
}

export interface UploadDocument {
  stageId: any;
  front?: any;
  frontBase64?: any;
  back?: any;
  documentType: any;
}

export interface UploadAvatar {
  file: File;
}

export interface SetPhoneRequest {
  stageId: number;
  countryId: string;
  phone: string;
}

class KycV2Service extends ServiceBase {
  protected static BASE_URL = "v2/kyc";

  public static async uploadDocument(
    props: UploadDocument
  ): Promise<ResponseWithoutData> {
    const formData = new FormData();
    formData.append("stageId", props.stageId);
    if (props.front) {
      formData.append("front", props.front);
    }
    if (props.frontBase64) {
      const file = await urlToFile(
        props.frontBase64,
        "selfie.jpg",
        "image/jpeg"
      );
      formData.append("front", file);
    }
    if (props.back) {
      formData.append("back", props.back);
    }
    formData.append("documentType", props.documentType);
    return this.post("/documents", formData, {
      "Content-Type": null,
    });
  }

  public static async updateAvatar(
    props: UploadAvatar
  ): Promise<ResponseWithoutData> {
    const formData = new FormData();
    formData.append("avatar", props.file);
    return this.post("/avatar", formData, {
      "Content-Type": null,
    });
  }

  public static updatePersonalInformation(
    props: UpdatePersonalProps
  ): Promise<ResponseWithData<PersonalInformation>> {
    return this.post("/personal", props);
  }
  public static personalInformation(): Promise<
    ResponseWithData<PersonalInformation>
  > {
    return this.get("/personal");
  }

  public static status(): Promise<ResponseWithData<KycStatus>> {
    return this.get("/status");
  }

  public static changePhone(props: {
    countryId: string;
    newValue: string;
    code: string;
    step: number;
  }): Promise<ResponseWithoutData> {
    return this.post("/change/phone", { ...props });
  }

  public static setEmail(props: {
    stageId: number;
    email: string;
  }): Promise<ResponseWithoutData> {
    return this.post("/email", props);
  }

  public static setPhone(props: SetPhoneRequest): Promise<ResponseWithoutData> {
    return this.post("/phone", props);
  }

  public static confirmContact(props: {
    stageId: number;
    code: string;
  }): Promise<ResponseWithoutData> {
    return this.post("/confirm", props);
  }

  public static changeEmailStepOne(props: {
    newValue: string;
  }): Promise<ResponseWithoutData> {
    return this.post("/change/mail", { ...props, step: 1 });
  }
  public static changeEmailStepTwo(props: {
    code: string;
  }): Promise<ResponseWithoutData> {
    return this.post("/change/mail", { ...props, step: 2 });
  }

  public static changeEmailStepThree(props: {
    code: string;
  }): Promise<ResponseWithoutData> {
    return this.post("/change/mail", { ...props, step: 3 });
  }
}

export default KycV2Service;
