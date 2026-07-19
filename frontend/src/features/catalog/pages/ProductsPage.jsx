import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router";
import PageShell from "../../../components/layout/PageShell.jsx";
import LoadingState from "../../../components/ui/LoadingState.jsx";
import ErrorState from "../../../components/ui/ErrorState.jsx";
import EmptyState from "../../../components/ui/EmptyState.jsx";
import CollectionHeader from "../components/CollectionHeader.jsx";
import CatalogFiltersPanel from "../components/CatalogFiltersPanel.jsx";
import CatalogPagination from "../components/CatalogPagination.jsx";
import ProductGrid from "../components/ProductGrid.jsx";
import {
  buildProductQueryParams,
  buildSearchParamsFromFilters,
  getCatalogFiltersFromSearchParams,
} from "../lib/catalogFilters.js";
import {
  useBrands,
  useCategories,
  useProducts,
  useSubcategories,
} from "../hooks/useCatalogQueries.js";

export default function ProductsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(
    () => getCatalogFiltersFromSearchParams(searchParams),
    [searchParams],
  );
  const queryParams = useMemo(
    () => buildProductQueryParams(filters),
    [filters],
  );

  const categoriesQuery = useCategories({ limit: 100, sort: "name" });
  const brandsQuery = useBrands({ limit: 100, sort: "name" });
  const subcategoriesQuery = useSubcategories({ limit: 100, sort: "name" });
  const productsQuery = useProducts(queryParams);

  const handleApplyFilters = (values) => {
    const nextFilters = {
      ...values,
      page: 1,
    };

    setSearchParams(buildSearchParamsFromFilters(nextFilters), {
      replace: true,
    });
  };

  const handleClearFilters = () => {
    setSearchParams({}, { replace: true });
  };

  const handlePageChange = (page) => {
    const nextFilters = {
      ...filters,
      page,
    };

    setSearchParams(buildSearchParamsFromFilters(nextFilters), {
      replace: true,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (
    categoriesQuery.isLoading ||
    brandsQuery.isLoading ||
    subcategoriesQuery.isLoading ||
    productsQuery.isLoading
  ) {
    return (
      <PageShell className="py-8 sm:py-10">
        <LoadingState label="Loading product catalog" />
      </PageShell>
    );
  }

  if (
    categoriesQuery.isError ||
    brandsQuery.isError ||
    subcategoriesQuery.isError ||
    productsQuery.isError
  ) {
    return (
      <PageShell className="py-8 sm:py-10">
        <ErrorState
          error={
            categoriesQuery.error ||
            brandsQuery.error ||
            subcategoriesQuery.error ||
            productsQuery.error
          }
          onRetry={() => window.location.reload()}
        />
      </PageShell>
    );
  }

  const categories = categoriesQuery.data?.items ?? [];
  const brands = brandsQuery.data?.items ?? [];
  const subcategories = subcategoriesQuery.data?.items ?? [];
  const products = productsQuery.data?.items ?? [];
  const meta = productsQuery.data?.meta;

  const categoriesById = Object.fromEntries(
    categories.map((category) => [category?._id || category?.id, category]),
  );
  const brandsById = Object.fromEntries(
    brands.map((brand) => [brand?._id || brand?.id, brand]),
  );

  return (
    <PageShell className="space-y-8 py-8 sm:py-10">
      <CollectionHeader
        eyebrow="Products"
        title="Browse the full catalog"
        description="Search, sort, paginate, and narrow products using the backend query features."
        meta={meta}
      />

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <CatalogFiltersPanel
          title="Filter products"
          subtitle="Search, sort, and narrow the listing."
          defaultValues={filters}
          onSubmit={handleApplyFilters}
          onClear={handleClearFilters}
          showCategory
          showBrand
          showSubcategory
          categoryOptions={categories}
          subcategoryOptions={subcategories}
          brandOptions={brands}
        />

        <div className="space-y-6">
          {products.length ? (
            <>
              <ProductGrid
                products={products}
                categoriesById={categoriesById}
                brandsById={brandsById}
              />
              <CatalogPagination meta={meta} onPageChange={handlePageChange} />
            </>
          ) : (
            <EmptyState
              title="No products match those filters"
              description="Try removing one filter or clearing the search to see more results."
              actionLabel="Clear filters"
              onAction={handleClearFilters}
              secondaryActionLabel="Back home"
              onSecondaryAction={() => navigate("/")}
            />
          )}
        </div>
      </div>
    </PageShell>
  );
}
