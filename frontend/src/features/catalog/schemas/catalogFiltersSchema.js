import { z } from "zod";
import { DEFAULT_PAGE_SIZE } from "../lib/catalogFilters.js";

export const catalogFiltersSchema = z.object({
  keyword: z.string().optional().default(""),
  sort: z.string().optional().default("-createdAt"),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .optional()
    .default(DEFAULT_PAGE_SIZE),
  category: z.string().optional().default(""),
  subcategory: z.string().optional().default(""),
  brand: z.string().optional().default(""),
  minPrice: z.string().optional().default(""),
  maxPrice: z.string().optional().default(""),
  inStock: z.boolean().optional().default(false),
});

export const catalogFiltersDefaultValues = {
  keyword: "",
  sort: "-createdAt",
  page: 1,
  limit: DEFAULT_PAGE_SIZE,
  category: "",
  subcategory: "",
  brand: "",
  minPrice: "",
  maxPrice: "",
  inStock: false,
};
