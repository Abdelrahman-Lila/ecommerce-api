import { useMemo } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import PageShell from "../../../components/layout/PageShell.jsx";
import LoadingState from "../../../components/ui/LoadingState.jsx";
import ErrorState from "../../../components/ui/ErrorState.jsx";
import EmptyState from "../../../components/ui/EmptyState.jsx";
import Button from "../../../components/ui/Button.jsx";
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
  useBrand,
  useBrands,
  useCategories,
  useProducts,
} from "../hooks/useCatalogQueries.js";
import { Link } from "react-router";

export default function BrandPage() {
  const navigate = useNavigate();
  const { brandId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(
    () =>
      getCatalogFiltersFromSearchParams(searchParams, {
        brand: brandId,
      }),
    [brandId, searchParams],
  );

  const queryParams = useMemo(
    () => buildProductQueryParams(filters),
    [filters],
  );
  const brandQuery = useBrand(brandId);
  const categoriesQuery = useCategories({ limit: 100, sort: "name" });
  const brandsQuery = useBrands({ limit: 100, sort: "name" });
  const productsQuery = useProducts(queryParams);

  const handleApplyFilters = (values) => {
    setSearchParams(
      buildSearchParamsFromFilters({
        ...values,
        brand: brandId,
        page: 1,
      }),
      { replace: true },
    );
  };

  const handleClearFilters = () => {
    setSearchParams({ brand: brandId }, { replace: true });
  };

  const handlePageChange = (page) => {
    setSearchParams(
      buildSearchParamsFromFilters({
        ...filters,
        brand: brandId,
        page,
      }),
      { replace: true },
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (
    brandQuery.isLoading ||
    categoriesQuery.isLoading ||
    brandsQuery.isLoading ||
    productsQuery.isLoading
  ) {
    return (
      <PageShell className="py-8 sm:py-10">
        <LoadingState label="Loading brand" />
      </PageShell>
    );
  }

  if (
    brandQuery.isError ||
    categoriesQuery.isError ||
    brandsQuery.isError ||
    productsQuery.isError
  ) {
    return (
      <PageShell className="py-8 sm:py-10">
        <ErrorState
          error={
            brandQuery.error ||
            categoriesQuery.error ||
            brandsQuery.error ||
            productsQuery.error
          }
          onRetry={() => window.location.reload()}
        />
      </PageShell>
    );
  }

  const brand = brandQuery.data;
  const categories = categoriesQuery.data?.items ?? [];
  const brands = brandsQuery.data?.items ?? [];
  const products = productsQuery.data?.items ?? [];
  const meta = productsQuery.data?.meta;

  const categoriesById = Object.fromEntries(
    categories.map((category) => [category?._id || category?.id, category]),
  );
  const brandsById = Object.fromEntries(
    brands.map((currentBrand) => [
      currentBrand?._id || currentBrand?.id,
      currentBrand,
    ]),
  );

  return (
    <PageShell className="space-y-8 py-8 sm:py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <CollectionHeader
          eyebrow="Brand"
          title={brand?.name || "Brand browsing"}
          description="Explore products from this brand and combine it with search, sorting, and price filters."
          meta={meta}
        />
        <Button as={Link} to="/products" variant="secondary">
          Back to products
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <CatalogFiltersPanel
          title="Filter brand products"
          subtitle="Search and refine results for this brand."
          defaultValues={filters}
          onSubmit={handleApplyFilters}
          onClear={handleClearFilters}
          showCategory={true}
          showBrand={false}
          showSubcategory={false}
          categoryOptions={categories}
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
              title="No products for this brand"
              description="Try removing filters or go back to the full catalog."
              actionLabel="Clear filters"
              onAction={handleClearFilters}
              secondaryActionLabel="View products"
              onSecondaryAction={() => navigate("/products")}
            />
          )}
        </div>
      </div>
    </PageShell>
  );
}
