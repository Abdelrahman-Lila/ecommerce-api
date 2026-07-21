import Badge from "../../../components/ui/Badge.jsx";
import Button from "../../../components/ui/Button.jsx";
import { Card } from "../../../components/ui/Card.jsx";
import { readLabel } from "../lib/catalogFilters.js";
import { useCart } from "../../cart/hooks/useCart.js";
import { useAuthSession } from "../../auth/hooks/useAuthSession.js";
import ProductGallery from "./ProductGallery.jsx";
import { formatCurrency } from "../../../lib/currency.js";

export default function ProductDetailHero({ product }) {
  const { addItem } = useCart();
  const { role } = useAuthSession();
  const isAdmin = role === "admin";
  const categoryLabel = readLabel(product?.category);
  const brandLabel = readLabel(product?.brand);
  const colors = (product?.colors ?? []).filter(Boolean);
  const rating = Number(product?.rating);
  const ratingsCount = Number(product?.ratingsCount ?? 0);

  return (
    <Card className="overflow-hidden p-0">
      <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="p-4 sm:p-6">
          <ProductGallery product={product} />
        </div>

        <div className="flex flex-col justify-between gap-8 p-6 sm:p-8">
          <div className="space-y-5">
            <div className="flex flex-wrap gap-2">
              {categoryLabel ? (
                <Badge variant="neutral">{categoryLabel}</Badge>
              ) : null}
              {brandLabel ? <Badge variant="primary">{brandLabel}</Badge> : null}
            </div>
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">
                {product?.title}
              </h1>
              <p className="text-base leading-7 text-[var(--muted)]">
                {product?.description}
              </p>
            </div>

            <div className="grid gap-3 rounded-3xl bg-slate-50 p-5 sm:grid-cols-2">
              <div>
                <p className="text-sm text-[var(--muted)]">Price</p>
                <p className="text-2xl font-semibold text-[var(--text)]">
                  {formatCurrency(product?.price)}
                </p>
              </div>
              <div>
                <p className="text-sm text-[var(--muted)]">Category</p>
                <p className="font-medium text-[var(--text)]">
                  {categoryLabel}
                </p>
              </div>
              <div>
                <p className="text-sm text-[var(--muted)]">Brand</p>
                <p className="font-medium text-[var(--text)]">
                  {brandLabel}
                </p>
              </div>
              <div>
                <p className="text-sm text-[var(--muted)]">Rating</p>
                <p className="font-medium text-[var(--text)]">
                  {Number.isFinite(rating) && rating > 0
                    ? `${rating.toFixed(1)} / 5 (${ratingsCount} review${
                        ratingsCount === 1 ? "" : "s"
                      })`
                    : "No ratings yet"}
                </p>
              </div>
              {colors.length ? (
                <div className="sm:col-span-2">
                  <p className="text-sm text-[var(--muted)]">Colors</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {colors.map((color) => (
                      <span
                        key={color}
                        className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-3 py-1.5 text-sm font-medium text-[var(--text)]"
                      >
                        <span
                          className="h-3 w-3 rounded-full border border-slate-300"
                          style={{ backgroundColor: color }}
                          aria-hidden="true"
                        />
                        {color}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              onClick={
                isAdmin
                  ? undefined
                  : () =>
                      addItem({
                        id: product?._id || product?.id,
                        title: product?.title,
                        price: product?.price,
                        image:
                          product?.imageCover || product?.images?.[0] || "",
                        quantity: 1,
                        stock: product?.quantity,
                        category: product?.category,
                        brand: product?.brand,
                      })
              }
              disabled={isAdmin || Number(product?.quantity ?? 0) <= 0}
            >
              Add to cart
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
