import { apiClient } from '../client';

export async function deleteStudentCareer(
  careerId: string | number,
): Promise<void> {
  await apiClient.delete(
    `/api/students/me/careers/${encodeURIComponent(String(careerId))}`,
  );
}
