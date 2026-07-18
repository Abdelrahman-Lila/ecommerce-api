import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../../../components/ui/Button.jsx";
import Input from "../../../components/ui/Input.jsx";
import {
  catalogFiltersDefaultValues,
  catalogFiltersSchema,
} from "../schemas/catalogFiltersSchema.js";

const selectClassName =
  "w-full rounded-2xl border border-[var(--border)] bg-white/90 px-4 py-3 text-sm text-[var(--text)] shadow-sm transition focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[rgba(15,118,110,0.18)]";

export default function CatalogFiltersForm({
  defaultValues,
  onSubmit,
  onClear,
  showCategory = true,
  showBrand = true,
  showSubcategory = false,
  categoryOptions = [],
  subcategoryOptions = [],
  brandOptions = [],
}) {
  const initialValues = useMemo(
    () => ({
      ...catalogFiltersDefaultValues,
      ...defaultValues,
    }),
    [defaultValues],
  );

  const { register, handleSubmit, reset } = useForm({
    resolver: zodResolver(catalogFiltersSchema),
    defaultValues: initialValues,
  });

  useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  const availableSubcategories = useMemo(
    () => (showSubcategory ? subcategoryOptions : []),
    [showSubcategory, subcategoryOptions],
  );

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Input
          label="Search"
          placeholder="Search products"
          {...register("keyword")}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm font-medium text-[var(--text)]">
          <span>Sort</span>
          <select className={selectClassName} {...register("sort")}>
            <option value="-createdAt">Newest</option>
            <option value="createdAt">Oldest</option>
            <option value="price">Price: low to high</option>
            <option value="-price">Price: high to low</option>
            <option value="title">Title: A to Z</option>
            <option value="-title">Title: Z to A</option>
          </select>
        </label>

        <label className="block space-y-2 text-sm font-medium text-[var(--text)]">
          <span>Per page</span>
          <select className={selectClassName} {...register("limit")}>
            <option value="12">12</option>
            <option value="24">24</option>
            <option value="48">48</option>
          </select>
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Min price"
          type="number"
          min="0"
          placeholder="0"
          {...register("minPrice")}
        />
        <Input
          label="Max price"
          type="number"
          min="0"
          placeholder="1000"
          {...register("maxPrice")}
        />
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-white/70 px-4 py-3">
        <input
          id="inStock"
          type="checkbox"
          className="h-4 w-4 rounded border-[var(--border)] text-[var(--primary)]"
          {...register("inStock")}
        />
        <label htmlFor="inStock" className="text-sm text-[var(--text)]">
          In stock only
        </label>
      </div>

      {showCategory ? (
        <label className="block space-y-2 text-sm font-medium text-[var(--text)]">
          <span>Category</span>
          <select className={selectClassName} {...register("category")}>
            <option value="">All categories</option>
            {categoryOptions.map((category) => (
              <option
                key={category?._id || category?.id}
                value={category?._id || category?.id}
              >
                {category?.name}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      {showBrand ? (
        <label className="block space-y-2 text-sm font-medium text-[var(--text)]">
          <span>Brand</span>
          <select className={selectClassName} {...register("brand")}>
            <option value="">All brands</option>
            {brandOptions.map((brand) => (
              <option
                key={brand?._id || brand?.id}
                value={brand?._id || brand?.id}
              >
                {brand?.name}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      {showSubcategory ? (
        <label className="block space-y-2 text-sm font-medium text-[var(--text)]">
          <span>Subcategory</span>
          <select className={selectClassName} {...register("subcategory")}>
            <option value="">All subcategories</option>
            {availableSubcategories.map((subcategory) => (
              <option
                key={subcategory?._id || subcategory?.id}
                value={subcategory?._id || subcategory?.id}
              >
                {subcategory?.name}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Button type="submit">Apply filters</Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            reset(catalogFiltersDefaultValues);
            onClear?.();
          }}
        >
          Clear
        </Button>
      </div>
    </form>
  );
}
