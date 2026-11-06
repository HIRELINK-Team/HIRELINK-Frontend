import apiClient from './client';
import type {
  UpdateTermAgreementsRequest,
  UpdateTermAgreementsResponse,
} from '../types/termAgreement';

async function updateTermAgreements(
  request: UpdateTermAgreementsRequest,
): Promise<UpdateTermAgreementsResponse> {
  const { data } = await apiClient.put<UpdateTermAgreementsResponse>(
    '/users/me/term-agreements',
    request,
  );
  return data;
}

export { updateTermAgreements };
