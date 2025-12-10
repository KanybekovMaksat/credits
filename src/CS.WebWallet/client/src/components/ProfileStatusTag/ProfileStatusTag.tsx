import React from "react";
import "./styles.scss";
import ProfilePendingIcon from "@components/Icons/ProfilePendingIcon";
import ProfileConfirmedIcon from "@components/Icons/ProfileConfirmedIcon";
import ProfileCancelIcon from "@components/Icons/ProfileCancelIcon";
import { useTranslation } from "react-i18next";
import { KycStatuses } from "@enums/kyc";

export interface ProfileStatusProps {
  status?: number;
}
const profileStatusText = (status: number) => {
  switch (status) {
    case KycStatuses.Created.id:
      return "created";
    case KycStatuses.OnReview.id:
      return "pending";
    case KycStatuses.Approved.id:
      return "confirmed";
    case KycStatuses.Rejected.id:
      return "rejected";
    case KycStatuses.Final.id:
      return "final rejection";
    default:
      return "N/A";
  }
};

export const profileStatusColor = (status: number) => {
  switch (status) {
    case KycStatuses.Created.id:
      return "created";
    case KycStatuses.OnReview.id:
      return "on-review";
    case KycStatuses.Approved.id:
      return "approved";
    case KycStatuses.Rejected.id:
      return "rejected";
    case KycStatuses.Final.id:
      return "rejected";
    default:
      return "created";
  }
};

const ProfileStatusTag: React.FC<ProfileStatusProps> = ({ status = 0 }) => {
  const { t } = useTranslation();

  return (
    <div className="profile-status">
      {status === KycStatuses.OnReview.id ? <ProfilePendingIcon /> : ""}
      {status === KycStatuses.Approved.id ? <ProfileConfirmedIcon /> : ""}
      {status === KycStatuses.Rejected.id ? <ProfileCancelIcon /> : ""}
      {status === KycStatuses.Final.id ? <ProfileCancelIcon /> : ""}
      <div className={`status ${profileStatusColor(status)}`}>
        <span>{t(profileStatusText(status))}</span>
      </div>
    </div>
  );
};

export default ProfileStatusTag;
