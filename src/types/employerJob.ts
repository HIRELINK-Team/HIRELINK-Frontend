/**
 * 사업주 채용공고 화면을 위한 프론트엔드 전용 mock 타입입니다.
 * 백엔드 API 명세가 확정되면 해당 계약에 맞춰 교체합니다.
 */
export type EmployerJobMockStatus = "OPEN" | "CLOSED";

export interface EmployerJobMock {
  id: string;
  title: string;
  wageAndSchedule: string;
  status: EmployerJobMockStatus;
  deadlineLabel?: string;
  applicantCount?: number;
  applicantCapacity?: number;
}

export type PreviousJobMockStatus = EmployerJobMockStatus | "DRAFT";

export interface PreviousJobMock {
  id: string;
  title: string;
  wageAndSchedule: string;
  status: PreviousJobMockStatus;
  registeredAt: string;
}
