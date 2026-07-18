import { useQuery } from "@tanstack/react-query";
import {
  getBrand,
  getBrands,
  getCategory,
  getCategorySubcategories,
  getCategories,
  getProduct,
  getProducts,
  getSubcategory,
  getSubcategories,
} from "../api/catalog.api.js";

export const catalogKeys = {
  all: ["catalog"],
  categories: (params) => [...catalogKeys.all, "categories", params ?? {}],
  category: (categoryId) => [...catalogKeys.all, "category", categoryId],
  subcategories: (params) => [
    ...catalogKeys.all,
    "subcategories",
    params ?? {},
  ],
  categorySubcategories: (categoryId, params) => [
    ...catalogKeys.all,
    "category-subcategories",
    categoryId,
    params ?? {},
  ],
  subcategory: (subcategoryId) => [
    ...catalogKeys.all,
    "subcategory",
    subcategoryId,
  ],
  brands: (params) => [...catalogKeys.all, "brands", params ?? {}],
  brand: (brandId) => [...catalogKeys.all, "brand", brandId],
  products: (params) => [...catalogKeys.all, "products", params],
  product: (productId) => [...catalogKeys.all, "product", productId],
};

export const useCategories = (params) =>
  useQuery({
    queryKey: catalogKeys.categories(params),
    queryFn: () => getCategories(params),
  });

export const useCategory = (categoryId) =>
  useQuery({
    queryKey: catalogKeys.category(categoryId),
    queryFn: () => getCategory(categoryId),
    enabled: Boolean(categoryId),
  });

export const useSubcategories = (params) =>
  useQuery({
    queryKey: catalogKeys.subcategories(params),
    queryFn: () => getSubcategories(params),
  });

export const useCategorySubcategories = (categoryId, params) =>
  useQuery({
    queryKey: catalogKeys.categorySubcategories(categoryId, params),
    queryFn: () => getCategorySubcategories(categoryId, params),
    enabled: Boolean(categoryId),
  });

export const useSubcategory = (subcategoryId) =>
  useQuery({
    queryKey: catalogKeys.subcategory(subcategoryId),
    queryFn: () => getSubcategory(subcategoryId),
    enabled: Boolean(subcategoryId),
  });

export const useBrands = (params) =>
  useQuery({
    queryKey: catalogKeys.brands(params),
    queryFn: () => getBrands(params),
  });

export const useBrand = (brandId) =>
  useQuery({
    queryKey: catalogKeys.brand(brandId),
    queryFn: () => getBrand(brandId),
    enabled: Boolean(brandId),
  });

export const useProducts = (params) =>
  useQuery({
    queryKey: catalogKeys.products(params),
    queryFn: () => getProducts(params),
  });

export const useProduct = (productId) =>
  useQuery({
    queryKey: catalogKeys.product(productId),
    queryFn: () => getProduct(productId),
    enabled: Boolean(productId),
  });
