import Badge from "../../../components/ui/Badge.jsx";

export default function CollectionHeader({
  eyebrow,
  title,
  description,
  meta,
}) {
  return (
    <div className="space-y-3">
      {eyebrow ? <Badge variant="primary">{eyebrow}</Badge> : null}
      <h1 className="text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">
        {title}
      </h1>
      <p className="max-w-3xl text-base text-[var(--muted)]">{description}</p>
      {meta ? (
        <p className="text-sm text-[var(--muted)]">
          Showing {meta.totalCount} documents on page {meta.currentPage} of{" "}
          {meta.pageCount}
        </p>
      ) : null}
    </div>
  );
}
