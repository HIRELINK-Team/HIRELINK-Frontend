import { apiClient } from '../client';

function offerPath(offerId: string | number) {
  return `/api/offers/${encodeURIComponent(String(offerId))}`;
}

export async function acceptStudentEmploymentOffer<TResponse = unknown>(
  offerId: string | number,
): Promise<TResponse> {
  // Only a pending offer inside its 24-hour response window may be accepted.
  const { data } = await apiClient.patch<TResponse>(
    `${offerPath(offerId)}/accept`,
  );

  return data;
}

export async function rejectStudentEmploymentOffer<TResponse = unknown>(
  offerId: string | number,
): Promise<TResponse> {
  // Only a pending offer inside its 24-hour response window may be rejected.
  const { data } = await apiClient.patch<TResponse>(
    `${offerPath(offerId)}/reject`,
  );

  return data;
}
