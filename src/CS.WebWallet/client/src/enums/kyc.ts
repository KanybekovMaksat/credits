export const KycStages = {
  Unknown: { id: 0, page: "/kyc/personal-information" },
  Phone: { id: 1, page: "/settings" },
  Email: { id: 2, page: "/settings" },
  Personal: { id: 3, page: "/kyc/personal-information" },
  Documents: { id: 4, page: "/kyc/document" },
  Selfie: { id: 5, page: "/kyc/selfie" },
  PoA: { id: 6, page: "/kyc/poa" },
};

export const KycStatuses = {
  Created: { id: 0 },
  OnReview: { id: 1 },
  Approved: { id: 2 },
  Rejected: { id: 3 },
  Final: { id: 5 },
};

export const KycStatusInProgress: number[] = [
  KycStatuses.Approved.id,
  KycStatuses.OnReview.id,
];
