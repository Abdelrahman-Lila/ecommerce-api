import { Outlet } from "react-router";
import Button from "../../components/ui/Button.jsx";
import PageShell from "../../components/layout/PageShell.jsx";
import { Link } from "react-router";

export default function AuthLayout() {
  return (
    <PageShell className="flex min-h-screen items-center justify-center py-10">
      <div className="w-full max-w-xl rounded-[2rem] border border-[var(--border)] bg-white/80 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-[var(--muted)]">
              Authentication
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--text)]">
              Secure access shell
            </h1>
          </div>
          <Button as={Link} to="/" variant="ghost" size="sm">
            Back home
          </Button>
        </div>
        <Outlet />
      </div>
    </PageShell>
  );
}
