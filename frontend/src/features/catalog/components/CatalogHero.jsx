import Button from "../../../components/ui/Button.jsx";
import { Link } from "react-router";

export default function CatalogHero() {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[linear-gradient(135deg,rgba(15,118,110,0.14),rgba(255,255,255,0.96)_48%,rgba(251,146,60,0.14))] p-8 shadow-[0_30px_80px_rgba(15,23,42,0.12)] sm:p-10">
      <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
            New favourites, just in
          </p>
          <div className="space-y-4">
            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-[var(--text)] sm:text-5xl">
              Find something you’ll love.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">
              Discover everyday essentials, standout finds, and products picked
              to make your next purchase feel easy.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button as={Link} to="/products">
              Shop all products
            </Button>
            <Button as="a" href="#categories" variant="secondary">
              Explore categories
            </Button>
          </div>
        </div>

        <div className="relative grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl bg-[var(--text)] p-6 text-white shadow-lg sm:col-span-2">
            <p className="text-sm font-medium text-white/70">Made for your everyday</p>
            <p className="mt-3 max-w-sm text-2xl font-semibold leading-tight">
              Fresh picks for every list, every look, and every moment.
            </p>
          </div>
          <Link
            to="/products"
            className="group rounded-3xl border border-white/70 bg-white/75 p-5 shadow-sm transition hover:-translate-y-0.5 hover:bg-white"
          >
            <p className="text-sm text-[var(--muted)]">Discover</p>
            <p className="mt-2 text-lg font-semibold text-[var(--text)]">
              New arrivals
            </p>
            <p className="mt-3 text-sm font-medium text-[var(--primary)]">
              Shop now →
            </p>
          </Link>
          <a
            href="#brands"
            className="group rounded-3xl border border-white/70 bg-white/75 p-5 shadow-sm transition hover:-translate-y-0.5 hover:bg-white"
          >
            <p className="text-sm text-[var(--muted)]">Explore</p>
            <p className="mt-2 text-lg font-semibold text-[var(--text)]">
              Brands you know
            </p>
            <p className="mt-3 text-sm font-medium text-[var(--primary)]">
              View brands →
            </p>
          </a>
        </div>
      </div>
    </section>
  );
}
