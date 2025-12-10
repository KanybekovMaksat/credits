import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Divider from "@components/Divider";
import ShowcasesService, { ShowcaseItem } from "@services/ShowcasesService";
import ResponseModal from "@components/ResponseModal";
import { ResponseModalProps } from "@components/ResponseModal/ResponseModal";
import ShowcaseGridItem from "./ShowcaseGridItem";
import { customTokenReceived } from "@store/kyc/sumsub";
import { KycStages } from "@enums/kyc";
import { KycPageByValue } from "@enums/common";
import { loadShowcaseFx } from "@store/showcase";
import "./showcase-grid.scss";

interface ShowcaseGridProps {
  showcaseItems: ShowcaseItem[];
}

const ShowcaseGrid: React.FC<ShowcaseGridProps> = ({ showcaseItems }) => {
  const navigate = useNavigate();
  const [responseModal, setResponseModal] = useState<ResponseModalProps>({
    visible: false,
  });

  if (showcaseItems.length === 0) {
    return <></>;
  }

  const activateProduct = async (id: number, accepted: boolean) => {
    const activate = showcaseItems.find((f) => f.id === id);

    if (activate && activate.requiredKycStages.length > 0) {
      const kycStage = activate.requiredKycStages[0];
      if (kycStage.kycToken !== undefined && kycStage.kycToken !== null) {
        await loadShowcaseFx();
        customTokenReceived(kycStage.kycToken);
        navigate("/kyc/sumsub");
        return;
      }
      await loadShowcaseFx();
      navigate(KycPageByValue(KycStages, kycStage.stage));

      return;
    }
    try {
      const res = await ShowcasesService.makeRequest(id, accepted);
      if (res.data.kycToken !== null) {
        customTokenReceived(res.data.kycToken);
        await loadShowcaseFx();
        navigate("/kyc/sumsub");
      } else {
        await loadShowcaseFx();
        navigate(0);
      }
    } catch (e: any) {
      await loadShowcaseFx();
      setResponseModal({ visible: true, text: e });
    }
  };
  return (
    <>
      <div className="showcase_grid">
        <ul>
          {showcaseItems.map((el, index) => {
            return (
              <li key={el.id}>
                <ShowcaseGridItem
                  showcaseItem={el}
                  activateProduct={activateProduct}
                />
                {index !== showcaseItems.length - 1 && (
                  <Divider className="cs_divider" />
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <ResponseModal
        text={responseModal.text}
        visible={responseModal.visible}
        onCancel={() => setResponseModal({ visible: false })}
        onConfirm={() => setResponseModal({ visible: false })}
      />
    </>
  );
};

export default ShowcaseGrid;
