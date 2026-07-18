import { useMemo, useState } from "react";
import Button from "../../../components/ui/Button.jsx";
import Drawer from "../../../components/ui/Drawer.jsx";
import CatalogFiltersForm from "./CatalogFiltersForm.jsx";

export default function CatalogFiltersPanel({
  title,
  subtitle,
  defaultValues,
  onSubmit,
  onClear,
  showCategory,
  showBrand,
  showSubcategory,
  categoryOptions,
  subcategoryOptions,
  brandOptions,
}) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filterForm = useMemo(
    () => (
      <CatalogFiltersForm
        defaultValues={defaultValues}
        onSubmit={(values) => {
          onSubmit(values);
          setMobileFiltersOpen(false);
        }}
        onClear={() => {
          onClear?.();
          setMobileFiltersOpen(false);
        }}
        showCategory={showCategory}
        showBrand={showBrand}
        showSubcategory={showSubcategory}
        categoryOptions={categoryOptions}
        subcategoryOptions={subcategoryOptions}
        brandOptions={brandOptions}
      />
    ),
    [
      brandOptions,
      categoryOptions,
      defaultValues,
      onClear,
      onSubmit,
      showBrand,
      showCategory,
      showSubcategory,
      subcategoryOptions,
    ],
  );

  return (
    <>
      <div className="rounded-3xl border border-[var(--border)] bg-white/75 p-5 shadow-sm lg:hidden">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-[var(--text)]">
              {title}
            </h2>
            <p className="text-sm text-[var(--muted)]">{subtitle}</p>
          </div>
          <Button
            variant="secondary"
            onClick={() => setMobileFiltersOpen(true)}
          >
            Filters
          </Button>
        </div>
      </div>

      <aside className="hidden rounded-3xl border border-[var(--border)] bg-white/75 p-5 shadow-sm lg:block">
        <div className="mb-5 space-y-1">
          <h2 className="text-lg font-semibold text-[var(--text)]">{title}</h2>
          <p className="text-sm text-[var(--muted)]">{subtitle}</p>
        </div>
        {filterForm}
      </aside>

      <Drawer
        open={mobileFiltersOpen}
        title={title}
        onClose={() => setMobileFiltersOpen(false)}
      >
        {filterForm}
      </Drawer>
    </>
  );
}
