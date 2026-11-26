import { apiClient } from '../client';
import type { WorkingConditions } from '../../types/studentWorkingConditions';

export async function getWorkingConditions(): Promise<WorkingConditions> {
  const { data } = await apiClient.get<WorkingConditions>(
    '/students/me/working-conditions',
  );
  const estimate = data?.estimate;
  const limits = [
    estimate?.termWeekdays,
    estimate?.weekendsAndHolidays,
    estimate?.vacations,
  ];
  if (
    !estimate ||
    !limits.every(
      (limit) =>
        limit &&
        ['WEEKDAY_LIMIT', 'SHARED_WEEKLY_LIMIT', 'NO_TIME_CAP'].includes(
          limit.type,
        ),
    )
  ) {
    throw new Error('Invalid working conditions response');
  }
  return data;
}
