import { useNavigate } from "react-router";
import PageShell from "../../../components/layout/PageShell.jsx";
import LoadingState from "../../../components/ui/LoadingState.jsx";
import ErrorState from "../../../components/ui/ErrorState.jsx";
import EmptyState from "../../../components/ui/EmptyState.jsx";
import CollectionHeader from "../components/CollectionHeader.jsx";
import EntityGrid from "../components/EntityGrid.jsx";
import { useBrands } from "../hooks/useCatalogQueries.js";

export default function BrandsPage() {
  const navigate = useNavigate();
  const brandsQuery = useBrands({ limit: 100, sort: "name" });

  if (brandsQuery.isLoading) {
    return (
      <PageShell className="py-8 sm:py-10">
        <LoadingState label="Loading brands" />
      </PageShell>
    );
  }

  if (brandsQuery.isError) {
    return (
      <PageShell className="py-8 sm:py-10">
        <ErrorState
          error={brandsQuery.error}
          onRetry={() => window.location.reload()}
        />
      </PageShell>
    );
  }

  const brands = brandsQuery.data?.items ?? [];

  return (
    <PageShell className="space-y-6 py-8 sm:py-10">
      <CollectionHeader
        eyebrow="Brands"
        title="Explore all brands"
        description="Find the brands you know and discover new favourites."
        meta={brandsQuery.data?.meta}
      />

      {brands.length ? (
        <EntityGrid
          entities={brands}
          type="Brand"
          getTo={(brand) => `/brands/${brand?._id || brand?.id}`}
        />
      ) : (
        <EmptyState
          title="No brands yet"
          description="Check back soon for brands to explore."
          actionLabel="Browse products"
          onAction={() => navigate("/products")}
        />
      )}
    </PageShell>
  );
}
