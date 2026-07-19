import { Link, useParams } from "react-router";
import PageShell from "../../../components/layout/PageShell.jsx";
import LoadingState from "../../../components/ui/LoadingState.jsx";
import ErrorState from "../../../components/ui/ErrorState.jsx";
import EmptyState from "../../../components/ui/EmptyState.jsx";
import Button from "../../../components/ui/Button.jsx";
import ProductDetailHero from "../components/ProductDetailHero.jsx";
import RelatedProductsSection from "../components/RelatedProductsSection.jsx";
import { useProducts } from "../hooks/useCatalogQueries.js";
import {
  useBrand,
  useCategory,
  useProduct,
} from "../hooks/useCatalogQueries.js";
import { getEntityId } from "../lib/catalogFilters.js";

export default function ProductDetailPage() {
  const { productId } = useParams();
  const productQuery = useProduct(productId);

  const product = productQuery.data;
  const categoryId = getEntityId(product?.category);
  const brandId = getEntityId(product?.brand);

  const categoryQuery = useCategory(categoryId);
  const brandQuery = useBrand(brandId);
  const relatedParams = product
    ? {
        limit: 8,
        sort: "-createdAt",
        ...(categoryId ? { category: categoryId } : {}),
        ...(brandId ? { brand: brandId } : {}),
      }
    : null;
  const relatedProductsQuery = useProducts(relatedParams, {
    enabled: Boolean(relatedParams),
  });

  if (
    productQuery.isLoading ||
    categoryQuery.isLoading ||
    brandQuery.isLoading ||
    relatedProductsQuery.isLoading
  ) {
    return (
      <PageShell className="py-8 sm:py-10">
        <LoadingState label="Loading product" />
      </PageShell>
    );
  }

  if (
    productQuery.isError ||
    categoryQuery.isError ||
    brandQuery.isError ||
    relatedProductsQuery.isError
  ) {
    return (
      <PageShell className="py-8 sm:py-10">
        <ErrorState
          error={
            productQuery.error ||
            categoryQuery.error ||
            brandQuery.error ||
            relatedProductsQuery.error
          }
          onRetry={() => window.location.reload()}
        />
      </PageShell>
    );
  }

  if (!product) {
    return (
      <PageShell className="py-8 sm:py-10">
        <EmptyState
          title="Product not found"
          description="The requested product is not available in the public catalog."
          actionLabel="Back to products"
          onAction={() => window.location.assign("/products")}
        />
      </PageShell>
    );
  }

  return (
    <PageShell className="space-y-8 py-8 sm:py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-[var(--muted)]">
            Product details
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">
            {product.title}
          </h1>
        </div>
        <Button as={Link} to="/products" variant="secondary">
          Back to products
        </Button>
      </div>

      <ProductDetailHero
        product={product}
        category={categoryQuery.data}
        brand={brandQuery.data}
      />

      <RelatedProductsSection
        eyebrow="Related products"
        title="More like this"
        description="We pulled matching products from the same category or brand using the catalog API."
        query={relatedProductsQuery}
        currentProductId={product?._id || product?.id}
      />
    </PageShell>
  );
}
