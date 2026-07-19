import { Link } from "react-router";
import Badge from "../../../components/ui/Badge.jsx";
import Button from "../../../components/ui/Button.jsx";

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
        <p className="text-sm text-[var(--muted)]">{description}</p>
      </div>

      {children}

      <div className="flex items-center justify-between gap-4 border-t border-[var(--border)] pt-5">
        <p className="text-sm text-[var(--muted)]">{switchLabel}</p>
        <Button as={Link} to={switchTo} variant="secondary" size="sm">
          Continue
        </Button>
      </div>
    </div>
  );
}
