import React, { FC, useCallback } from "react";
import { Control, Controller } from "react-hook-form";
import "./input-wrapper.scss";

interface InputWrapperProps {
  control: Control;
  name: string;
  rules?: any;
  value?: any;
  label?: string;
  customError?: string;
  children: React.ReactElement;
}

const InputWrapper: FC<InputWrapperProps> = ({
  control,
  name,
  rules,
  value,
  label,
  customError,
  ...props
}) => {
  const errorMessage = useCallback((type: string) => {
    switch (type) {
      case "required":
        return "Field is required";
      case "min":
        return "Too short";
      case "max":
        return "Too long";
      case "minLength":
        return "The entered text is less than the minimum length";
      case "maxLength":
        return "The text entered exceeds the maximum length";
      default:
        return null;
    }
  }, []);

  if (!props.children) {
    return null;
  }

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => {
        return (
          <div className="input_wrapper">
            <div className="label">{label}</div>
            <div className="input_children" {...props}>
              {React.cloneElement(props.children as React.ReactElement, {
                ...field,
                className: error || customError ? "cs_input error" : "cs_input",
                ref: null,
                value: value,
                checked: value ? value : field.value,
              })}
            </div>
            <div className="field_validation_error">
              {(error?.type && errorMessage(error?.type)) ||
                (customError && customError)}
            </div>
          </div>
        );
      }}
    />
  );
};

export default InputWrapper;
