import { apiClient } from '../client';

type MatchListParams = {
  jobPostingId?: string | number;
};

export async function getMyEmploymentMatches<TResponse = unknown>(
  params: MatchListParams = {},
): Promise<TResponse> {
  const { data } = await apiClient.get<TResponse>('/api/matches/me', {
    params,
  });

  return data;
}

export async function getEmploymentMatch<TResponse = unknown>(
  matchId: string | number,
): Promise<TResponse> {
  // Only a party to the employment match may view its detail and contact data.
  const { data } = await apiClient.get<TResponse>(
    `/api/matches/${encodeURIComponent(String(matchId))}`,
  );

  return data;
}
