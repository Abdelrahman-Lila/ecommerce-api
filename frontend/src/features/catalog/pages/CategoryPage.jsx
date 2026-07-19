import { useMemo } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import PageShell from "../../../components/layout/PageShell.jsx";
import LoadingState from "../../../components/ui/LoadingState.jsx";
import ErrorState from "../../../components/ui/ErrorState.jsx";
import EmptyState from "../../../components/ui/EmptyState.jsx";
import Button from "../../../components/ui/Button.jsx";
import Badge from "../../../components/ui/Badge.jsx";
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
  useCategory,
  useCategorySubcategories,
  useProducts,
} from "../hooks/useCatalogQueries.js";
import { Link } from "react-router";

export default function CategoryPage() {
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(
    () =>
      getCatalogFiltersFromSearchParams(searchParams, {
        category: categoryId,
      }),
    [categoryId, searchParams],
  );

  const queryParams = useMemo(
    () => buildProductQueryParams(filters),
    [filters],
  );
  const categoryQuery = useCategory(categoryId);
  const subcategoriesQuery = useCategorySubcategories(categoryId, {
    limit: 100,
    sort: "name",
  });
  const productsQuery = useProducts(queryParams);

  const handleApplyFilters = (values) => {
    setSearchParams(
      buildSearchParamsFromFilters({
        ...values,
        category: categoryId,
        page: 1,
      }),
      { replace: true },
    );
  };

  const handleClearFilters = () => {
    setSearchParams({ category: categoryId }, { replace: true });
  };

  const handlePageChange = (page) => {
    setSearchParams(
      buildSearchParamsFromFilters({
        ...filters,
        category: categoryId,
        page,
      }),
      { replace: true },
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (
    categoryQuery.isLoading ||
    subcategoriesQuery.isLoading ||
    productsQuery.isLoading
  ) {
    return (
      <PageShell className="py-8 sm:py-10">
        <LoadingState label="Loading category" />
      </PageShell>
    );
  }

  if (
    categoryQuery.isError ||
    subcategoriesQuery.isError ||
    productsQuery.isError
  ) {
    return (
      <PageShell className="py-8 sm:py-10">
        <ErrorState
          error={
            categoryQuery.error ||
            subcategoriesQuery.error ||
            productsQuery.error
          }
          onRetry={() => window.location.reload()}
        />
      </PageShell>
    );
  }

  const category = categoryQuery.data;
  const subcategories = subcategoriesQuery.data?.items ?? [];
  const products = productsQuery.data?.items ?? [];
  const meta = productsQuery.data?.meta;
  return (
    <PageShell className="space-y-8 py-8 sm:py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <CollectionHeader
          eyebrow="Category"
          title={category?.name || "Category browsing"}
          description="Explore products inside this category and narrow by subcategory."
          meta={meta}
        />
        <Button as={Link} to="/products" variant="secondary">
          Back to products
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <CatalogFiltersPanel
          title="Filter category products"
          subtitle="Search and refine results in this category."
          defaultValues={filters}
          onSubmit={handleApplyFilters}
          onClear={handleClearFilters}
          showCategory={false}
          showBrand={true}
          showSubcategory={true}
          subcategoryOptions={subcategories}
        />

        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            <Badge variant="neutral">All</Badge>
            {subcategories.map((subcategory) => {
              const subcategoryId = subcategory?._id || subcategory?.id;
              const active = filters.subcategory === subcategoryId;

              return (
                <Button
                  key={subcategoryId}
                  as={Link}
                  to={`/categories/${categoryId}?subcategory=${subcategoryId}`}
                  variant={active ? "primary" : "secondary"}
                  size="sm"
                >
                  {subcategory?.name}
                </Button>
              );
            })}
          </div>

          {products.length ? (
            <>
              <ProductGrid products={products} />
              <CatalogPagination meta={meta} onPageChange={handlePageChange} />
            </>
          ) : (
            <EmptyState
              title="No products in this category"
              description="Try a different subcategory, remove filters, or return to the full product list."
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
