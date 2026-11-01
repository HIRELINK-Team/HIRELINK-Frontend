import type { ApplicantDocumentMock } from "../types/application";

/** Frontend mock UI에서 사용하는 만료 임박 안내 기준입니다. */
export const EXPIRY_WARNING_DAYS = 30;

const DAY_IN_MS = 24 * 60 * 60 * 1000;

export interface ExpiryWarningDocument {
  document: ApplicantDocumentMock;
  remainingDays: number;
}

function parseDocumentDate(dateValue: string) {
  const dateParts = dateValue.split(".").map(Number);

  if (
    dateParts.length !== 3 ||
    dateParts.some((datePart) => Number.isNaN(datePart))
  ) {
    return null;
  }

  const [year, month, day] = dateParts;
  return new Date(year, month - 1, day);
}

export function getDocumentExpiryRemainingDays(
  expiresAt: string,
  now = new Date(),
) {
  const expiresAtDate = parseDocumentDate(expiresAt);
  if (!expiresAtDate) return null;

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.floor((expiresAtDate.getTime() - today.getTime()) / DAY_IN_MS);
}

export function getExpiryWarningDocuments(
  documents: ApplicantDocumentMock[],
  now = new Date(),
): ExpiryWarningDocument[] {
  return documents.flatMap((document) => {
    if (document.isRegistered === false) return [];

    const remainingDays = getDocumentExpiryRemainingDays(
      document.expiresAt,
      now,
    );

    if (
      remainingDays === null ||
      remainingDays <= 0 ||
      remainingDays > EXPIRY_WARNING_DAYS
    ) {
      return [];
    }

    return [{ document, remainingDays }];
  });
}

export function isDocumentExpiryWarning(document: ApplicantDocumentMock) {
  return getExpiryWarningDocuments([document]).length > 0;
}
