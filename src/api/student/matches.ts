import { apiClient } from '../client';

import type {
  StudentEmploymentMatchesResponse,
  StudentEmploymentMatchResponse,
} from '../../types/studentMatch';

export async function getMyEmploymentMatches(): Promise<StudentEmploymentMatchesResponse> {
  const { data } =
    await apiClient.get<StudentEmploymentMatchesResponse>('/api/matches/me');

  return data;
}

export async function getEmploymentMatch(
  matchId: string | number,
): Promise<StudentEmploymentMatchResponse> {
  // Only a party to the employment match may view its detail and contact data.
  const { data } = await apiClient.get<StudentEmploymentMatchResponse>(
    `/api/matches/${encodeURIComponent(String(matchId))}`,
  );

  return data;
}
