import axios from "axios";

const API_BASE_URL = "/api";

const publicApiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export { API_BASE_URL, publicApiClient };
