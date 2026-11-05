import { apiClient } from '../client';

import type {
  AcceptStudentEmploymentOfferResponse,
  RejectStudentEmploymentOfferResponse,
} from '../../types/studentApplication';

function offerPath(offerId: string | number) {
  return `/offers/${encodeURIComponent(String(offerId))}`;
}

export async function acceptStudentEmploymentOffer(
  offerId: string | number,
): Promise<AcceptStudentEmploymentOfferResponse> {
  // Only a pending offer inside its 24-hour response window may be accepted.
  const { data } = await apiClient.patch<AcceptStudentEmploymentOfferResponse>(
    `${offerPath(offerId)}/accept`,
  );

  return data;
}

export async function rejectStudentEmploymentOffer(
  offerId: string | number,
): Promise<RejectStudentEmploymentOfferResponse> {
  // Only a pending offer inside its 24-hour response window may be rejected.
  const { data } = await apiClient.patch<RejectStudentEmploymentOfferResponse>(
    `${offerPath(offerId)}/reject`,
  );

  return data;
}
