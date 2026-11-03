import type { EmailLoginRequest } from '../../types/auth';

import { apiClient } from '../client';

export async function loginStudent(requestBody: EmailLoginRequest) {
  await apiClient.post('/api/auth/login', requestBody);
}
