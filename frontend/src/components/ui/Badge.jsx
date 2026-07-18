import { classNames } from "../../lib/classNames.js";

const badgeVariants = {
  neutral: "bg-slate-100 text-slate-700",
  primary: "bg-teal-100 text-teal-800",
  success: "bg-emerald-100 text-emerald-800",
  warning: "bg-amber-100 text-amber-800",
  danger: "bg-red-100 text-red-800",
};

export default function Badge({ variant = "neutral", className, ...props }) {
  return (
    <span
      className={classNames(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]",
        badgeVariants[variant],
        className,
      )}
      {...props}
    />
  );
}
