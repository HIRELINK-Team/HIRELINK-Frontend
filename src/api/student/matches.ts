import { apiClient } from '../client';

import type {
  StudentEmploymentMatchesResponse,
  StudentEmploymentMatchResponse,
} from '../../types/studentMatch';

type MatchListParams = {
  jobPostingId?: string | number;
};

export async function getMyEmploymentMatches(
  params: MatchListParams = {},
): Promise<StudentEmploymentMatchesResponse> {
  const { data } = await apiClient.get<StudentEmploymentMatchesResponse>(
    '/api/matches/me',
    { params },
  );

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
