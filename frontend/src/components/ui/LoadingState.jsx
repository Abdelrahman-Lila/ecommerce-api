export default function LoadingState({ label = "Loading" }) {
  return (
    <div
      className="flex min-h-[240px] items-center justify-center rounded-3xl border border-dashed border-[var(--border)] bg-white/70 p-8 text-[var(--muted)]"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex items-center gap-3">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--primary)] border-t-transparent" />
        <span>{label}...</span>
      </div>
    </div>
  );
}
