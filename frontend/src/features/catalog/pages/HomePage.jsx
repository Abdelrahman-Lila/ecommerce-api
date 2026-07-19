import { Link, useNavigate } from "react-router";
import {
  useCategories,
  useBrands,
  useProducts,
} from "../hooks/useCatalogQueries.js";
import LoadingState from "../../../components/ui/LoadingState.jsx";
import ErrorState from "../../../components/ui/ErrorState.jsx";
import EmptyState from "../../../components/ui/EmptyState.jsx";
import PageShell from "../../../components/layout/PageShell.jsx";
import CatalogHero from "../components/CatalogHero.jsx";
import CollectionHeader from "../components/CollectionHeader.jsx";
import EntityGrid from "../components/EntityGrid.jsx";
import ProductGrid from "../components/ProductGrid.jsx";
import Button from "../../../components/ui/Button.jsx";

export default function HomePage() {
  const navigate = useNavigate();
  const categoriesQuery = useCategories({ limit: 8, sort: "-createdAt" });
  const brandsQuery = useBrands({ limit: 8, sort: "-createdAt" });
  const productsQuery = useProducts({ limit: 8, sort: "-createdAt" });

  if (
    categoriesQuery.isLoading ||
    brandsQuery.isLoading ||
    productsQuery.isLoading
  ) {
    return (
      <PageShell className="py-8 sm:py-12">
        <LoadingState label="Loading storefront" />
      </PageShell>
    );
  }

  if (categoriesQuery.isError || brandsQuery.isError || productsQuery.isError) {
    return (
      <PageShell className="py-8 sm:py-12">
        <ErrorState
          error={
            categoriesQuery.error || brandsQuery.error || productsQuery.error
          }
          onRetry={() => window.location.reload()}
        />
      </PageShell>
    );
  }

  const categories = categoriesQuery.data?.items ?? [];
  const brands = brandsQuery.data?.items ?? [];
  const products = productsQuery.data?.items ?? [];

  return (
    <PageShell className="space-y-12 py-8 sm:py-12">
      <CatalogHero />

      <section className="space-y-6">
        <CollectionHeader
          eyebrow="Categories"
          title="Browse by category"
          description="Use the category pages to narrow product discovery and drill into subcategory filters."
        />
        {categories.length ? (
          <EntityGrid
            entities={categories}
            type="Category"
            getTo={(entity) => `/categories/${entity?._id || entity?.id}`}
            showImage={false}
          />
        ) : (
          <EmptyState
            title="No categories yet"
            description="The public category collection is empty right now."
            actionLabel="Go to products"
            onAction={() => navigate("/products")}
          />
        )}
      </section>

      <section className="space-y-6">
        <CollectionHeader
          eyebrow="Brands"
          title="Browse by brand"
          description="Jump straight into branded product collections."
        />
        {brands.length ? (
          <EntityGrid
            entities={brands}
            type="Brand"
            getTo={(entity) => `/brands/${entity?._id || entity?.id}`}
          />
        ) : (
          <EmptyState
            title="No brands yet"
            description="Brand data will appear here once the API returns entries."
            actionLabel="Go to products"
            onAction={() => navigate("/products")}
          />
        )}
      </section>

      <section className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <CollectionHeader
            eyebrow="Latest products"
            title="Fresh product picks"
            description="A small sample from the product catalog using the backend collection response."
            meta={productsQuery.data?.meta}
          />
          <Button as={Link} to="/products" variant="secondary">
            View all products
          </Button>
        </div>
        {products.length ? (
          <ProductGrid products={products} />
        ) : (
          <EmptyState
            title="No products found"
            description="Try the product listing with search and filters."
            actionLabel="Browse products"
            onAction={() => navigate("/products")}
          />
        )}
      </section>
    </PageShell>
  );
}
