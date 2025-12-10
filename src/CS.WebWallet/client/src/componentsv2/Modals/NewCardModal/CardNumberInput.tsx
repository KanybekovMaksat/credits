import React, { useEffect, useRef } from "react";
import { IMask } from "react-imask";
import { useTranslation } from "react-i18next";

export interface InputProps {
  onChange: (value: string) => void;
  placeholder?: string;
  value?: string;
}

const CardNumberInput: React.FC<InputProps> = (props: InputProps) => {
  const myRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (myRef.current !== null) {
      IMask(myRef.current, {
        mask: [
          {
            mask: "0000 000000 00000",
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            regex: "^3[47]\\d{0,13}",
            cardtype: "american express",
          },
          {
            mask: "0000 0000 0000 0000",
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            regex: "^(?:6011|65\\d{0,2}|64[4-9]\\d?)\\d{0,12}",
            cardtype: "discover",
          },
          {
            mask: "0000 000000 0000",
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            regex: "^3(?:0([0-5]|9)|[689]\\d?)\\d{0,11}",
            cardtype: "diners",
          },
          {
            mask: "0000 0000 0000 0000",
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            regex: "^(5[1-5]\\d{0,2}|22[2-9]\\d{0,1}|2[3-7]\\d{0,2})\\d{0,12}",
            cardtype: "mastercard",
          },
          // {
          //     mask: '0000-0000-0000-0000',
          //     regex: '^(5019|4175|4571)\\d{0,12}',
          //     cardtype: 'dankort'
          // },
          // {
          //     mask: '0000-0000-0000-0000',
          //     regex: '^63[7-9]\\d{0,13}',
          //     cardtype: 'instapayment'
          // },
          {
            mask: "0000 000000 00000",
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            regex: "^(?:2131|1800)\\d{0,11}",
            cardtype: "jcb15",
          },
          {
            mask: "0000 0000 0000 0000",
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            regex: "^(?:35\\d{0,2})\\d{0,12}",
            cardtype: "jcb",
          },
          {
            mask: "0000 0000 0000 0000",
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            regex: "^(?:5[0678]\\d{0,2}|6304|67\\d{0,2})\\d{0,12}",
            cardtype: "maestro",
          },
          // {
          //     mask: '0000-0000-0000-0000',
          //     regex: '^220[0-4]\\d{0,12}',
          //     cardtype: 'mir'
          // },
          {
            mask: "0000 0000 0000 0000",
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            regex: "^4\\d{0,15}",
            cardtype: "visa",
          },
          {
            mask: "0000 0000 0000 0000",
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            regex: "^62\\d{0,14}",
            cardtype: "unionpay",
          },
          {
            mask: "0000 0000 0000 0000",
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            cardtype: "Unknown",
          },
        ],
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        dispatch: function (appended, dynamicMasked) {
          const number = (dynamicMasked.value + appended).replace(/\D/g, "");

          for (let i = 0; i < dynamicMasked.compiledMasks.length; i++) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const re = new RegExp(dynamicMasked.compiledMasks[i]["regex"]);
            if (number.match(re) != null) {
              return dynamicMasked.compiledMasks[i];
            }
          }
        },
      });
    }
  }, [myRef]);
  return (
    <input
      placeholder={t("Your card number")}
      ref={myRef}
      onChange={(e) => props.onChange(e.target.value)}
    />
  );
};

export default CardNumberInput;
