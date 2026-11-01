import type { EmployerNotificationMock } from "../types/employerNotification";

export const EMPLOYER_NOTIFICATION_MOCKS: EmployerNotificationMock[] = [
  {
    id: "notification-001",
    category: "NEW_APPLICANT",
    message: "안나님이 바리스타 직무에 지원했어요.",
    occurredAt: "2026.10.3 오후 11:22:22",
    isRead: false,
  },
  {
    id: "notification-002",
    category: "NEW_APPLICANT",
    message: "조이님이 서버 직무에 지원했어요.",
    occurredAt: "2026.10.3 오후 11:22:22",
    isRead: false,
  },
  {
    id: "notification-003",
    category: "OFFER_ACCEPTED",
    message: "안나님이 채용 제안을 수락했어요.",
    occurredAt: "2026.10.3 오후 11:22:22",
    isRead: true,
  },
  {
    id: "notification-004",
    category: "VISA",
    message: "케이님의 유학생 비자 만료가 일주일 남았어요.",
    occurredAt: "2026.10.3 오후 11:22:22",
    isRead: true,
  },
];
