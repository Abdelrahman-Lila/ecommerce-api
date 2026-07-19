import LoadingState from "../../../components/ui/LoadingState.jsx";
import EmptyState from "../../../components/ui/EmptyState.jsx";
import ProductGrid from "./ProductGrid.jsx";
import CollectionHeader from "./CollectionHeader.jsx";

export default function RelatedProductsSection({
  eyebrow,
  title,
  description,
  query,
  currentProductId,
}) {
  const relatedProducts = (query.data?.items ?? []).filter(
    (product) => (product?._id || product?.id) !== currentProductId,
  );

  if (query.isLoading) {
    return <LoadingState label="Loading related products" />;
  }

  if (!relatedProducts.length) {
    return (
      <EmptyState
        title="No related products found"
        description="Try browsing the category or brand views for more options."
      />
    );
  }

  return (
    <section className="space-y-6">
      <CollectionHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
      />
      <ProductGrid products={relatedProducts} />
    </section>
  );
}
