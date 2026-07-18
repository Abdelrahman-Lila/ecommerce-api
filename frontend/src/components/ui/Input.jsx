import { classNames } from "../../lib/classNames.js";

export default function Input({
  label,
  helperText,
  error,
  className,
  id,
  ...props
}) {
  const inputId = id ?? props.name;

  return (
    <label
      className="block space-y-2 text-sm font-medium text-[var(--text)]"
      htmlFor={inputId}
    >
      {label ? <span>{label}</span> : null}
      <input
        id={inputId}
        className={classNames(
          "w-full rounded-2xl border border-[var(--border)] bg-white/90 px-4 py-3 text-[var(--text)] shadow-sm transition placeholder:text-slate-400 focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[rgba(15,118,110,0.18)]",
          error && "border-red-400 focus:border-red-500 focus:ring-red-100",
          className,
        )}
        {...props}
      />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {!error && helperText ? (
        <p className="text-sm text-[var(--muted)]">{helperText}</p>
      ) : null}
    </label>
  );
}
