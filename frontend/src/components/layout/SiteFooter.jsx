export default function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border)] bg-white/55">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-[var(--muted)] sm:px-6 lg:px-8">
        <p>Frontend shell for the ecommerce API.</p>
        <p>
          Catalog, auth, cart, orders, and admin areas are scaffolded for the
          next phase.
        </p>
      </div>
    </footer>
  );
}
