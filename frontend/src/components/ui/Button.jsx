import { classNames } from "../../lib/classNames.js";

const variantClasses = {
  primary:
    "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm hover:brightness-110",
  secondary: "bg-[var(--secondary)] text-[var(--text)] hover:bg-slate-300",
  ghost: "bg-transparent text-[var(--text)] hover:bg-slate-100",
  danger: "bg-[var(--danger)] text-white hover:brightness-110",
};

const sizeClasses = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-2.5 text-sm",
  lg: "px-5 py-3 text-base",
};

export default function Button({
  as: Component = "button",
  variant = "primary",
  size = "md",
  className,
  type = "button",
  ...props
}) {
  return (
    <Component
      type={Component === "button" ? type : undefined}
      className={classNames(
        "inline-flex items-center justify-center gap-2 rounded-full font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-60",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  );
}
