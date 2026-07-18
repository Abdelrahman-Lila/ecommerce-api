import { Outlet } from "react-router";
import { adminNavItems } from "../routeConfig.js";
import Button from "../../components/ui/Button.jsx";
import Badge from "../../components/ui/Badge.jsx";
import { Link } from "react-router";

export default function AdminLayout() {
  return (
    <div className="min-h-screen lg:flex">
      <aside className="border-b border-[var(--border)] bg-white/80 lg:sticky lg:top-0 lg:h-screen lg:w-80 lg:border-b-0 lg:border-r">
        <div className="flex h-full flex-col gap-6 p-6">
          <div className="space-y-2">
            <Badge variant="warning">Management</Badge>
            <h2 className="text-2xl font-semibold tracking-tight text-[var(--text)]">
              Admin console
            </h2>
            <p className="text-sm text-[var(--muted)]">
              Scaffolded for product, catalog, order, and user management.
            </p>
          </div>

          <nav className="grid gap-2">
            {adminNavItems.map((item) => (
              <Button
                key={item.to}
                as={Link}
                to={item.to}
                variant="ghost"
                className="justify-start rounded-2xl px-4 py-3"
              >
                {item.label}
              </Button>
            ))}
          </nav>
        </div>
      </aside>

      <main className="flex-1">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
