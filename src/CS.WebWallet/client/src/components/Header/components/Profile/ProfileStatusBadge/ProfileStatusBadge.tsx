import React from "react";
import ProfileConfirmedIcon from "@components/Icons/ProfileConfirmedIcon";
import ProfileCancelIcon from "@components/Icons/ProfileCancelIcon";
import { $kyc } from "@store/kyc/kyc";
import { useStore } from "effector-react";
import ProfilePendingIcon from "@components/Icons/ProfilePendingIcon";
import { KycStatuses } from "@enums/kyc";

const ProfileStatusBadge: React.FC = () => {
  const { minimalStatus } = useStore($kyc);
  if (minimalStatus === KycStatuses.OnReview.id) {
    return <ProfilePendingIcon />;
  }
  if (minimalStatus === KycStatuses.Approved.id) {
    return <ProfileConfirmedIcon />;
  }
  return <ProfileCancelIcon />;
};

export default ProfileStatusBadge;
