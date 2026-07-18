export const DEFAULT_PAGE_SIZE = 12;

const toCleanString = (value) => (value ? String(value).trim() : "");

const toCleanNumberString = (value) => {
  const cleanedValue = toCleanString(value);

  if (!cleanedValue) {
    return "";
  }

  return Number.isFinite(Number(cleanedValue)) ? cleanedValue : "";
};

export const getCatalogFiltersFromSearchParams = (
  searchParams,
  overrides = {},
) => ({
  keyword: toCleanString(searchParams.get("keyword")),
  sort: toCleanString(searchParams.get("sort")) || "-createdAt",
  page: toCleanNumberString(searchParams.get("page")) || "1",
  limit:
    toCleanNumberString(searchParams.get("limit")) || String(DEFAULT_PAGE_SIZE),
  category: toCleanString(searchParams.get("category")),
  subcategory: toCleanString(searchParams.get("subcategory")),
  brand: toCleanString(searchParams.get("brand")),
  minPrice: toCleanNumberString(searchParams.get("minPrice")),
  maxPrice: toCleanNumberString(searchParams.get("maxPrice")),
  inStock: searchParams.get("inStock") === "true",
  ...overrides,
});

export const buildProductQueryParams = (filters) => {
  const queryParams = {};

  if (filters.keyword) queryParams.keyword = filters.keyword;
  if (filters.sort) queryParams.sort = filters.sort;
  if (filters.page) queryParams.page = filters.page;
  if (filters.limit) queryParams.limit = filters.limit;
  if (filters.category) queryParams.category = filters.category;
  if (filters.subcategory) queryParams.subcategories = filters.subcategory;
  if (filters.brand) queryParams.brand = filters.brand;
  if (filters.minPrice) queryParams["price[gte]"] = filters.minPrice;
  if (filters.maxPrice) queryParams["price[lte]"] = filters.maxPrice;
  if (filters.inStock) queryParams["quantity[gt]"] = 0;

  return queryParams;
};

export const buildSearchParamsFromFilters = (filters) => {
  const searchParams = {};

  Object.entries(filters).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    if (typeof value === "boolean") {
      if (value) {
        searchParams[key] = "true";
      }
      return;
    }

    searchParams[key] = String(value);
  });

  return searchParams;
};

export const readLabel = (entity) => {
  if (!entity) return "";
  if (typeof entity === "string") return entity;
  return entity.name || entity.title || entity.slug || "";
};

export const getEntityId = (entity) => {
  if (!entity) return "";
  if (typeof entity === "string") return entity;
  return entity._id || entity.id || "";
};
