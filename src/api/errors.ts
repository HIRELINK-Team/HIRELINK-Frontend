import axios from "axios";
import type { ApiErrorResponse } from "../types/auth";

function getApiErrorResponse(error: unknown) {
  if (!axios.isAxiosError<ApiErrorResponse>(error)) {
    return null;
  }

  const responseData = error.response?.data;
  if (
    !responseData ||
    typeof responseData.code !== "string" ||
    typeof responseData.message !== "string"
  ) {
    return null;
  }

  return responseData;
}

function getApiErrorStatus(error: unknown) {
  return axios.isAxiosError(error) ? error.response?.status : undefined;
}

export { getApiErrorResponse, getApiErrorStatus };
