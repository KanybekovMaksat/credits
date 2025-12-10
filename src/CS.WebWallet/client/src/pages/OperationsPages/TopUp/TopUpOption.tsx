import React from "react";
import "./topup-main.scss";
import { useNavigate } from "react-router-dom";

export interface TopUpOptionProps {
  path: string;
  title: string;
  subtitle: string;
  image: any;
}
const TopUpOption: React.FC<TopUpOptionProps> = (props: TopUpOptionProps) => {
  const { title, subtitle, image, path } = props;
  const navigate = useNavigate();

  const goPath = () => navigate(path);
  return (
    <div className="form-card topup-option" onClick={() => goPath()}>
      <div className="description">
        <span className="option-title">{title}</span>
        <span className="page-subtitle">{subtitle}</span>
      </div>
      <img src={image} height="40px" />
    </div>
  );
};
export default TopUpOption;
