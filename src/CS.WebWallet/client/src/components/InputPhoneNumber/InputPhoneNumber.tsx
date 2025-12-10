import React from "react";
import "./styles.scss";
import { useFormContext, Controller } from "react-hook-form";

interface InputPhoneNumberProps {
  disabled?: boolean;
}

const InputPhoneNumber: React.FC<InputPhoneNumberProps> = ({ disabled }) => {
  const { watch, control } = useFormContext();

  const country = watch("country");

  return (
    <div className="input-phone">
      <div className="country-code">
        {country && (
          <img src={`flags/${country.id.toLowerCase()}.svg`} alt="country" />
        )}
        <input disabled value={country ? `+ ${country.phoneCodes[0]}` : ""} />
      </div>
      <div className="phone-number">
        <Controller
          name="phone"
          control={control}
          defaultValue=""
          rules={{ maxLength: 20, minLength: 8 }}
          render={({ field: { onChange, value } }) => (
            <input
              disabled={disabled}
              type="number"
              className="input_number"
              value={value}
              onKeyPress={(event: any) => {
                if (!/[0-9]/.test(event.key)) {
                  event.preventDefault();
                }
              }}
              onChange={(event: any) => {
                if (value.length >= 20 && event.nativeEvent.data) {
                  return;
                } else {
                  return onChange(event);
                }
              }}
            />
          )}
        />
      </div>
    </div>
  );
};

export default InputPhoneNumber;
