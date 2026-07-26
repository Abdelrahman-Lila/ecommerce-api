import { Link } from "react-router";

export default function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-[var(--border)] bg-white/70">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1fr_auto] lg:px-8">
        <div className="max-w-sm space-y-2">
          <Link to="/" className="text-lg font-semibold tracking-tight text-[var(--text)]">
            MarketLane
          </Link>
          <p className="text-sm leading-6 text-[var(--muted)]">
            Thoughtful finds for your everyday.
          </p>
        </div>

        <nav className="flex flex-wrap items-start gap-x-6 gap-y-3 text-sm font-medium text-[var(--muted)]">
          <Link to="/" className="transition hover:text-[var(--text)]">
            Home
          </Link>
          <Link to="/products" className="transition hover:text-[var(--text)]">
            Shop products
          </Link>
          <Link to="/cart" className="transition hover:text-[var(--text)]">
            Cart
          </Link>
        </nav>
      </div>
      <div className="border-t border-[var(--border)]">
        <div className="mx-auto w-full max-w-7xl px-4 py-4 text-sm text-[var(--muted)] sm:px-6 lg:px-8">
          © {new Date().getFullYear()} MarketLane. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
