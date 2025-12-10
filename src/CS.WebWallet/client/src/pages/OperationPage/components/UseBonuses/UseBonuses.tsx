import React from "react";
import { useTranslation } from "react-i18next";
import { useStore } from "effector-react";
import Checkbox from "@compv2/Inputs/Checkbox";
import { $data, setUsesBonus } from "@pages/OperationPage/OperationPage.store";
import { $accounts } from "@store/accounts";
import { toNum } from "@helpers/amountHelper";

const UseBonuses: React.FC = () => {
  const { t } = useTranslation();
  const { usesBonus, fromOption, check } = useStore($data);
  const { all } = useStore($accounts);

  const source = all?.find((e) => e.accountId === fromOption?.accountId);
  const bonus = all?.find((e) => e.accountId === fromOption?.accountId);
  if (
    !source ||
    !bonus ||
    bonus.currencyId !== source.currencyId ||
    toNum(bonus.amount) === 0
  )
    return <></>;

  return (
    <div className="operation-info">
      <Checkbox
        value={usesBonus}
        onChange={(e) => setUsesBonus(e)}
        disabled={!!check}
      >
        {t("operation.bonus.checkmark")}
      </Checkbox>
    </div>
  );
};

export default UseBonuses;
