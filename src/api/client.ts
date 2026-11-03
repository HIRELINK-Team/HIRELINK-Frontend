import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

export const apiClient = axios.create({
  baseURL: apiBaseUrl || undefined,
});
