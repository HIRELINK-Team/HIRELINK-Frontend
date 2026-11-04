import type {
  CreateStudentCareerRequest,
  Experience,
  ExperienceDraft,
  StudentCareerResponse,
  UpdateStudentCareerRequest,
} from '../types/experience';

export type StudentCareerUpdateMappingResult =
  | { status: 'ready'; requestBody: UpdateStudentCareerRequest }
  | { status: 'unchanged' }
  | { status: 'invalid' };

function normalizeMonth(value: string) {
  return value.trim().replace('.', '-');
}

function getCurrentMonth() {
  const now = new Date();

  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function isValidMonthRange(startMonth: string, endMonth: string) {
  const monthPattern = /^\d{4}-(0[1-9]|1[0-2])$/;
  const currentMonth = getCurrentMonth();

  return (
    monthPattern.test(startMonth) &&
    monthPattern.test(endMonth) &&
    startMonth <= endMonth &&
    startMonth <= currentMonth &&
    endMonth <= currentMonth
  );
}

export function mapStudentCareerToExperience(
  career: StudentCareerResponse,
): Experience {
  return {
    id: String(career.careerId),
    workplace: career.careerName,
    startMonth: career.startMonth.replace('-', '.'),
    endMonth: career.endMonth.replace('-', '.'),
    duties: career.description ?? '',
  };
}

export function mapExperienceDraftToCreateRequest(
  draft: ExperienceDraft,
): CreateStudentCareerRequest | null {
  const careerName = draft.workplace.trim();
  const startMonth = normalizeMonth(draft.startMonth);
  const endMonth = normalizeMonth(draft.endMonth);
  const description = draft.duties.trim();

  if (!careerName || !isValidMonthRange(startMonth, endMonth)) return null;

  return {
    careerName,
    startMonth,
    endMonth,
    ...(description ? { description } : {}),
  };
}

export function mapExperienceDraftToUpdateRequest(
  draft: ExperienceDraft,
  career: StudentCareerResponse,
): StudentCareerUpdateMappingResult {
  const careerName = draft.workplace.trim();
  const startMonth = normalizeMonth(draft.startMonth);
  const endMonth = normalizeMonth(draft.endMonth);
  const description = draft.duties.trim();

  if (!careerName || !isValidMonthRange(startMonth, endMonth)) {
    return { status: 'invalid' };
  }

  const requestBody: UpdateStudentCareerRequest = {};

  if (careerName !== career.careerName) requestBody.careerName = careerName;
  if (startMonth !== career.startMonth) requestBody.startMonth = startMonth;
  if (endMonth !== career.endMonth) requestBody.endMonth = endMonth;

  if (description !== (career.description ?? '')) {
    requestBody.description = description || null;
  }

  return Object.keys(requestBody).length > 0
    ? { status: 'ready', requestBody }
    : { status: 'unchanged' };
}

export function isExperienceDraftValid(draft: ExperienceDraft) {
  return mapExperienceDraftToCreateRequest(draft) !== null;
}
