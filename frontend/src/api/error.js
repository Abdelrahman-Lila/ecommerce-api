export const normalizeApiError = (error) => {
  const payload = error?.response?.data ?? error?.data ?? null;

  return {
    name: "ApiError",
    status: error?.response?.status ?? error?.status ?? 0,
    message:
      payload?.message ?? payload?.error ?? error?.message ?? "Request failed",
    data: payload,
    originalError: error,
  };
};

export const getErrorMessage = (error) => normalizeApiError(error).message;
