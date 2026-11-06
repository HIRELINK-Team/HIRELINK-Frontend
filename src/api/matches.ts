import apiClient from './client';
import type {
  EmployerMatchDetailResponse,
  EmployerMatchListQuery,
  EmployerMatchListResponse,
} from '../types/match';

async function getEmployerMatches(
  query: EmployerMatchListQuery = {},
): Promise<EmployerMatchListResponse> {
  const { data } = await apiClient.get<EmployerMatchListResponse>(
    '/matches/me',
    { params: query },
  );
  return data;
}

async function getEmployerMatchDetail(
  matchId: number,
): Promise<EmployerMatchDetailResponse> {
  const { data } = await apiClient.get<EmployerMatchDetailResponse>(
    `/matches/${matchId}`,
  );
  return data;
}

export { getEmployerMatchDetail, getEmployerMatches };
