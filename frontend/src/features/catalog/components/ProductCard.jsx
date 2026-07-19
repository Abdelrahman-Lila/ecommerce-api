import { Link } from "react-router";
import Badge from "../../../components/ui/Badge.jsx";
import Button from "../../../components/ui/Button.jsx";
import { Card } from "../../../components/ui/Card.jsx";
import { readLabel } from "../lib/catalogFilters.js";
import { useCart } from "../../cart/hooks/useCart.js";
import { formatCurrency } from "../../../lib/currency.js";

export default function ProductCard({ product, categoryName, brandName }) {
  const productId = product?._id || product?.id;
  const { addItem } = useCart();
  const imageSource = product?.imageCover || product?.images?.[0] || "";
  const categoryLabel = categoryName || readLabel(product?.category);
  const brandLabel = brandName || readLabel(product?.brand);

  return (
    <Card className="group overflow-hidden p-0 transition hover:-translate-y-1 hover:shadow-[0_26px_60px_rgba(15,23,42,0.14)]">
      <Link to={`/products/${productId}`} className="block">
        <div className="flex aspect-[4/3] items-center justify-center overflow-hidden bg-slate-100">
          {imageSource ? (
            <img
              src={imageSource}
              alt={product?.title || "Product image"}
              className="h-full w-full object-contain p-2"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-[var(--muted)]">
              No image available
            </div>
          )}
        </div>
      </Link>

      <div className="space-y-4 p-5">
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {categoryLabel ? (
              <Badge variant="neutral">{categoryLabel}</Badge>
            ) : null}
            {brandLabel ? <Badge variant="primary">{brandLabel}</Badge> : null}
          </div>
          <h3 className="line-clamp-2 text-lg font-semibold tracking-tight text-[var(--text)]">
            {product?.title}
          </h3>
          <p className="line-clamp-2 text-sm text-[var(--muted)]">
            {product?.description}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm text-[var(--muted)]">Price</p>
            <p className="text-xl font-semibold text-[var(--text)]">
              {formatCurrency(product?.price)}
            </p>
          </div>
          <div className="text-right text-sm text-[var(--muted)]">
            <p>{Number(product?.quantity ?? 0)} available</p>
            {typeof product?.rating === "number" ? (
              <p>{product.rating.toFixed(1)} rating</p>
            ) : null}
          </div>
        </div>

        <Button
          as={Link}
          to={`/products/${productId}`}
          variant="secondary"
          className="w-full"
        >
          View details
        </Button>
        <Button
          className="w-full"
          onClick={() =>
            addItem({
              id: productId,
              title: product?.title,
              price: product?.price,
              image: imageSource,
              quantity: 1,
              stock: product?.quantity,
              category: product?.category,
              brand: product?.brand,
            })
          }
          disabled={Number(product?.quantity ?? 0) <= 0}
        >
          Add to cart
        </Button>
      </div>
    </Card>
  );
}
