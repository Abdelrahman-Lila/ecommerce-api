import { Link } from "react-router";
import Badge from "../../../components/ui/Badge.jsx";

export default function AuthShell({
  title,
  description,
  switchLabel,
  switchTo,
  children,
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Badge variant="primary">Authentication</Badge>
        <h2 className="text-2xl font-semibold tracking-tight text-[var(--text)]">
          {title}
        </h2>
        {description ? (
          <p className="text-sm text-[var(--muted)]">{description}</p>
        ) : null}
      </div>

      {children}

      <div className="flex items-center justify-between gap-4 border-t border-[var(--border)] pt-5">
        <Link
          to={switchTo}
          className="text-sm text-[var(--muted)] hover:text-[var(--primary)] hover:underline"
        >
          {switchLabel}
        </Link>
      </div>
    </div>
  );
}
