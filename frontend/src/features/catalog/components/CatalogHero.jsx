import Button from "../../../components/ui/Button.jsx";
import { Link } from "react-router";

export default function CatalogHero() {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[linear-gradient(135deg,rgba(15,118,110,0.12),rgba(255,255,255,0.92)_42%,rgba(59,130,246,0.08))] p-8 shadow-[0_30px_80px_rgba(15,23,42,0.12)] sm:p-10">
      <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
            Public storefront
          </p>
          <div className="space-y-4">
            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-[var(--text)] sm:text-5xl">
              Browse the catalog with search, filters, sorting, and pagination.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">
              Explore products, narrow by category or brand, and use the backend
              query features directly from the UI without inventing any
              endpoints.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button as={Link} to="/products">
              Browse products
            </Button>
            <Button as={Link} to="/products?sort=price" variant="secondary">
              Sort by price
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-white/70 bg-white/75 p-5 shadow-sm">
            <p className="text-sm text-[var(--muted)]">Search</p>
            <p className="mt-2 text-lg font-semibold text-[var(--text)]">
              Keyword product lookup
            </p>
          </div>
          <div className="rounded-3xl border border-white/70 bg-white/75 p-5 shadow-sm">
            <p className="text-sm text-[var(--muted)]">Filters</p>
            <p className="mt-2 text-lg font-semibold text-[var(--text)]">
              Category, brand, and price
            </p>
          </div>
          <div className="rounded-3xl border border-white/70 bg-white/75 p-5 shadow-sm">
            <p className="text-sm text-[var(--muted)]">Pagination</p>
            <p className="mt-2 text-lg font-semibold text-[var(--text)]">
              Page through collections
            </p>
          </div>
          <div className="rounded-3xl border border-white/70 bg-white/75 p-5 shadow-sm">
            <p className="text-sm text-[var(--muted)]">Public data</p>
            <p className="mt-2 text-lg font-semibold text-[var(--text)]">
              Categories, brands, products
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
