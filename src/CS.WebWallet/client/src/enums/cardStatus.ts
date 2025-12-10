export const CardStatus = {
  NotVerified: { id: 1, title: "Not Verified" },
  Verified: { id: 2, title: "Verified" },
  Expired: { id: 3, title: "Expired" },
  Blocked: { id: 4, title: "Blocked" },
  Moderation: { id: 5, title: "Moderation" },
};

export const IssuedCardStatusEnum = {
  Created: { id: 0, title: "Created", i18n: "card_issued_created" }, // grey
  Inactive: { id: 1, title: "Inactive", i18n: "card_issued_inactive" }, // yellow
  Active: { id: 2, title: "Active", i18n: "card_issued_active" }, // green
  Blocked: { id: 3, title: "Blocked", i18n: "card_issued_blocked" }, // red
  Suspended: { id: 4, title: "Suspended", i18n: "card_issued_suspended" }, // red
  Cancelled: { id: 5, title: "Cancelled", i18n: "card_issued_cancelled" }, // red
  Expired: { id: 6, title: "Expired", i18n: "card_issued_expired" }, //red
  Ejected: { id: 7, title: "Ejected", i18n: "card_issued_ejected" }, // red
};
