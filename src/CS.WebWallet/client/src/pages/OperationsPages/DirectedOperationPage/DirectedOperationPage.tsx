import React from "react";
import OperationPage from "@pages/OperationPage";
import { Direction } from "@pages/OperationPage/types";

export interface DirectedOperationPageProps {
  direction: Direction;
}

const DirectedOperationPage: React.FC<DirectedOperationPageProps> = ({
  direction,
}) => {
  return <OperationPage direction={direction} />;
};

export default DirectedOperationPage;
