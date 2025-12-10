import React, { useEffect } from "react";
import { useStore } from "effector-react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import InputWrapper from "@components/InputWrapper/InputWrapper";
import SelectCountry from "@compv2/SelectCountry/SelectCountry";
import { $countries } from "@store/countries";
import BlueFilledButton from "@compv2/Buttons/BlueFilledButton";
import ProfileStatusComment from "@components/ProfileStatusComment";
import {
  $personalPage,
  uploadPersonalInformationFx,
} from "./kyc-personal.store";
import "./styles.scss";

const KycPersonal: React.FC = (): JSX.Element => {
  const { countries } = useStore($countries);
  const { note, isDisabled, data, isPending } = useStore($personalPage);
  const methods = useForm();
  const { handleSubmit, reset, control } = methods;
  const { t } = useTranslation();

  const onSubmit = async (data: any) => {
    uploadPersonalInformationFx({
      countryId: data.country.id ?? data.countryId,
      ...data,
    });
  };

  useEffect(() => {
    if (data && countries) {
      const countryId = data.address?.countryId ?? "GB";
      const country = countries.find((f) => f.id === countryId);
      reset({
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth,
        ...data.address,
        country: country,
        countryId: countryId,
      });
    }
  }, [data, countries, reset]);

  return (
    <section className="personal-information">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="page-title">{t("personal_information")}</div>
          <ProfileStatusComment comment={note} />
          <div className="top-line" />
          <InputWrapper
            control={control}
            name="firstName"
            rules={{ required: true }}
            label={t("First name")}
          >
            <input
              type="text"
              disabled={isDisabled}
              placeholder={t("First name")}
            />
          </InputWrapper>
          <InputWrapper
            control={control}
            name="lastName"
            rules={{ required: true }}
            label={t("Last name")}
          >
            <input
              type="text"
              disabled={isDisabled}
              placeholder={t("Last name")}
            />
          </InputWrapper>
          <InputWrapper
            control={control}
            name="dateOfBirth"
            label={t("Date of birth")}
            rules={{ required: true }}
          >
            <input
              type="date"
              // max={maxBirthDate}
              disabled={isDisabled}
              placeholder={t("Date of birth")}
            />
          </InputWrapper>

          <div className="input_wrapper">
            <div className="label">{t("residence_country")}</div>
            <div className="input_children">
              <SelectCountry
                disabled={isDisabled}
                blocked={countries.filter((f) => f.isBlocked).map((v) => v.id)}
              />
            </div>
          </div>
          <InputWrapper
            control={control}
            name="city"
            rules={{ required: true }}
            label={t("City")}
          >
            <input type="text" disabled={isDisabled} placeholder={t("City")} />
          </InputWrapper>
          <InputWrapper
            control={control}
            name="street"
            rules={{ required: true }}
            label={t("personal_information_street")}
          >
            <input
              type="text"
              disabled={isDisabled}
              placeholder={t("personal_information_street")}
            />
          </InputWrapper>
          <InputWrapper
            control={control}
            name="building"
            rules={{ required: false }}
            label={t("personal_information_building")}
          >
            <input
              type="text"
              disabled={isDisabled}
              placeholder={t("personal_information_building")}
            />
          </InputWrapper>
          <InputWrapper
            control={control}
            name="flat"
            rules={{ required: false }}
            label={t("personal_information_flat")}
          >
            <input
              type="text"
              disabled={isDisabled}
              placeholder={t("personal_information_flat")}
            />
          </InputWrapper>
          <InputWrapper
            control={control}
            name="postalCode"
            rules={{ required: true }}
            label={t("personal_information_postal")}
          >
            <input
              type="text"
              disabled={isDisabled}
              placeholder={t("personal_information_postal")}
            />
          </InputWrapper>

          {isDisabled == false && (
            <div className="button-wrapper">
              <BlueFilledButton
                type="submit"
                text={t("Continue")}
                isLoading={isPending}
              />
            </div>
          )}
        </form>
      </FormProvider>
    </section>
  );
};

export default KycPersonal;
