import { Link } from "react-router";
import Badge from "../../../components/ui/Badge.jsx";
import Button from "../../../components/ui/Button.jsx";
import { Card } from "../../../components/ui/Card.jsx";
import ErrorState from "../../../components/ui/ErrorState.jsx";
import LoadingState from "../../../components/ui/LoadingState.jsx";
import {
  useBrands,
  useCategories,
  useProducts,
  useSubcategories,
} from "../../catalog/hooks/useCatalogQueries.js";
import { getAdminOrders } from "../api/admin.api.js";
import { useQuery } from "@tanstack/react-query";

const collections = [
  { key: "products", label: "Products", description: "Catalog items" },
  { key: "categories", label: "Categories", description: "Top-level groups" },
  { key: "subcategories", label: "Subcategories", description: "Catalog refinements" },
  { key: "brands", label: "Brands", description: "Product manufacturers" },
  { key: "orders", label: "Orders", description: "Fulfillment queue" },
];

export default function AdminDashboardPage() {
  const productsQuery = useProducts({ limit: 1 });
  const categoriesQuery = useCategories({ limit: 1 });
  const subcategoriesQuery = useSubcategories({ limit: 1 });
  const brandsQuery = useBrands({ limit: 1 });
  const ordersQuery = useQuery({
    queryKey: ["admin", "orders", "dashboard"],
    queryFn: () => getAdminOrders({ limit: 1 }),
  });
  const queries = [
    productsQuery,
    categoriesQuery,
    subcategoriesQuery,
    brandsQuery,
    ordersQuery,
  ];

  if (queries.some((query) => query.isLoading)) {
    return <LoadingState label="Loading dashboard" />;
  }

  if (queries.some((query) => query.isError)) {
    return (
      <ErrorState
        error={queries.find((query) => query.isError)?.error}
        title="Could not load dashboard"
        onRetry={() => window.location.reload()}
      />
    );
  }

  const counts = {
    products: productsQuery.data?.meta?.pageCount ?? 0,
    categories: categoriesQuery.data?.meta?.pageCount ?? 0,
    subcategories: subcategoriesQuery.data?.meta?.pageCount ?? 0,
    brands: brandsQuery.data?.meta?.pageCount ?? 0,
    orders: ordersQuery.data?.meta?.pageCount ?? 0,
  };

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Badge variant="warning">Administrator</Badge>
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">
          System dashboard
        </h1>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {collections.map((collection) => {
          const content = (
            <Card className="h-full space-y-2 transition hover:-translate-y-0.5 hover:shadow-md">
              <p className="text-sm text-[var(--muted)]">{collection.label}</p>
              <p className="text-3xl font-semibold text-[var(--text)]">
                {counts[collection.key]}
              </p>
              <p className="text-sm text-[var(--muted)]">
                {collection.description}
              </p>
            </Card>
          );

          const managementRoutes = {
            categories: "/admin/categories",
            subcategories: "/admin/subcategories",
            brands: "/admin/brands",
            products: "/admin/products",
            orders: "/admin/orders",
          };
          const route = managementRoutes[collection.key];

          return route ? (
            <Link key={collection.key} to={route}>
              {content}
            </Link>
          ) : (
            <div key={collection.key}>{content}</div>
          );
        })}
      </div>

      <Card className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-[var(--text)]">
            Administration workspace
          </h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Category, subcategory, brand, and product management are ready.
          </p>
        </div>
        <Button as={Link} to="/products" variant="secondary">
          View storefront catalog
        </Button>
      </Card>
    </div>
  );
}
