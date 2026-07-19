import { Link } from "react-router";
import Badge from "../ui/Badge.jsx";
import Button from "../ui/Button.jsx";
import { classNames } from "../../lib/classNames.js";
import { useAuthSession } from "../../features/auth/hooks/useAuthSession.js";
import { useCart } from "../../features/cart/hooks/useCart.js";
import { useLogout } from "../../features/auth/hooks/useAuthMutations.js";

export default function SiteHeader({ links = [], className }) {
  const session = useAuthSession();
  const { itemCount } = useCart();
  const logout = useLogout();

  return (
    <header
      className={classNames(
        "border-b border-[var(--border)] bg-white/65 backdrop-blur",
        className,
      )}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="flex items-center gap-3 font-semibold tracking-tight"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--primary)] text-sm text-white shadow-sm">
            ML
          </span>
          <span className="text-base">MarketLane</span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {links.map((link) => (
            <Button
              key={link.to}
              as={Link}
              to={link.to}
              variant="ghost"
              size="sm"
            >
              {link.label}
            </Button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button as={Link} to="/cart" variant="secondary" size="sm">
            Cart {itemCount ? `(${itemCount})` : ""}
          </Button>
          {session.isAuthenticated ? (
            <Button as={Link} to="/orders" variant="ghost" size="sm">
              Orders
            </Button>
          ) : null}
          <Badge variant={session.isAuthenticated ? "success" : "neutral"}>
            {session.isAuthenticated
              ? session.isAdmin
                ? "Admin"
                : "Signed in"
              : "Guest"}
          </Badge>
          {!session.isAuthenticated ? (
            <Button as={Link} to="/login" size="sm">
              Sign in
            </Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={logout}>
              Sign out
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
