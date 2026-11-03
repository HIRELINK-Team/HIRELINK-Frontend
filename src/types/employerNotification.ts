export type EmployerNotificationCategory =
  "NEW_APPLICANT" | "OFFER_ACCEPTED" | "VISA";

/** Backend 알림 명세가 확정되기 전 화면 검증에 사용하는 Frontend mock 모델입니다. */
export interface EmployerNotificationMock {
  id: string;
  category: EmployerNotificationCategory;
  message: string;
  occurredAt: string;
  isRead: boolean;
}
