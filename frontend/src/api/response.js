const getCollectionMeta = (payload) => ({
  currentPage: payload?.["current page"] ?? 1,
  pageCount: payload?.["Number of Pages"] ?? 1,
  totalCount:
    payload?.totalCount ??
    payload?.["Number of documents"] ??
    payload?.["Number of orders"] ??
    payload?.["Number of users"] ??
    (Array.isArray(payload?.data) ? payload.data.length : 0),
});

export const unwrapResponseData = (payload) => payload?.data ?? null;

export const normalizeCollectionResponse = (payload, fallbackKey = "items") => {
  const items = Array.isArray(payload?.data)
    ? payload.data
    : Array.isArray(payload?.[fallbackKey])
      ? payload[fallbackKey]
      : [];

  return {
    items,
    meta: getCollectionMeta(payload),
    message: payload?.message ?? null,
    status: payload?.status ?? null,
  };
};
