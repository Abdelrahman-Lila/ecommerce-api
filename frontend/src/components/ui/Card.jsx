import { classNames } from "../../lib/classNames.js";

export function Card({ className, ...props }) {
  return (
    <div
      className={classNames(
        "rounded-3xl border border-[var(--border)] bg-white/85 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }) {
  return <div className={classNames("space-y-1", className)} {...props} />;
}

export function CardTitle({ className, ...props }) {
  return (
    <h2
      className={classNames("text-xl font-semibold tracking-tight", className)}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }) {
  return (
    <p
      className={classNames("text-sm text-[var(--muted)]", className)}
      {...props}
    />
  );
}

export function CardBody({ className, ...props }) {
  return <div className={classNames("mt-4", className)} {...props} />;
}

export function CardFooter({ className, ...props }) {
  return (
    <div
      className={classNames("mt-6 flex items-center gap-3", className)}
      {...props}
    />
  );
}
