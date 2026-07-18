import Button from "./Button.jsx";

export default function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
}) {
  return (
    <div className="rounded-3xl border border-dashed border-[var(--border)] bg-white/75 p-8 text-center shadow-sm">
      <div className="mx-auto flex max-w-lg flex-col items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-xl text-[var(--primary)]">
          •
        </div>
        <h3 className="text-xl font-semibold text-[var(--text)]">{title}</h3>
        <p className="text-sm text-[var(--muted)]">{description}</p>
        {actionLabel || secondaryActionLabel ? (
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            {actionLabel ? (
              <Button onClick={onAction}>{actionLabel}</Button>
            ) : null}
            {secondaryActionLabel ? (
              <Button variant="secondary" onClick={onSecondaryAction}>
                {secondaryActionLabel}
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
