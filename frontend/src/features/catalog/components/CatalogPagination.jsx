import Button from "../../../components/ui/Button.jsx";

const buildPageRange = (currentPage, pageCount) => {
  if (!pageCount || pageCount <= 1) {
    return [];
  }

  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(pageCount, currentPage + 2);
  const pages = [];

  for (let pageNumber = startPage; pageNumber <= endPage; pageNumber += 1) {
    pages.push(pageNumber);
  }

  return pages;
};

export default function CatalogPagination({ meta, onPageChange }) {
  if (!meta || meta.pageCount <= 1) {
    return null;
  }

  const pages = buildPageRange(meta.currentPage, meta.pageCount);

  return (
    <nav className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-[var(--border)] bg-white/75 p-4 shadow-sm">
      <p className="text-sm text-[var(--muted)]">
        Page {meta.currentPage} of {meta.pageCount}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(Math.max(1, meta.currentPage - 1))}
          disabled={meta.currentPage <= 1}
        >
          Previous
        </Button>

        {pages[0] > 1 ? (
          <>
            <Button variant="ghost" size="sm" onClick={() => onPageChange(1)}>
              1
            </Button>
            {pages[0] > 2 ? (
              <span className="px-1 text-[var(--muted)]">…</span>
            ) : null}
          </>
        ) : null}

        {pages.map((pageNumber) => (
          <Button
            key={pageNumber}
            variant={pageNumber === meta.currentPage ? "primary" : "ghost"}
            size="sm"
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </Button>
        ))}

        {pages[pages.length - 1] < meta.pageCount ? (
          <>
            {pages[pages.length - 1] < meta.pageCount - 1 ? (
              <span className="px-1 text-[var(--muted)]">…</span>
            ) : null}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPageChange(meta.pageCount)}
            >
              {meta.pageCount}
            </Button>
          </>
        ) : null}

        <Button
          variant="secondary"
          size="sm"
          onClick={() =>
            onPageChange(Math.min(meta.pageCount, meta.currentPage + 1))
          }
          disabled={meta.currentPage >= meta.pageCount}
        >
          Next
        </Button>
      </div>
    </nav>
  );
}
