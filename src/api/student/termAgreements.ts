import { apiClient } from '../client';

import type {
  TermAgreementsRequest,
  TermAgreementsResponse,
} from '../../types/termAgreement';

export async function updateMyTermAgreements(
  requestBody: TermAgreementsRequest,
): Promise<TermAgreementsResponse> {
  const { data } = await apiClient.put<TermAgreementsResponse>(
    '/users/me/term-agreements',
    requestBody,
  );

  return data;
}
