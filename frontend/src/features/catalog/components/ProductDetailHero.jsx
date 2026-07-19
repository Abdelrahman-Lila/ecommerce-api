import Badge from "../../../components/ui/Badge.jsx";
import Button from "../../../components/ui/Button.jsx";
import { Card } from "../../../components/ui/Card.jsx";
import { getEntityId, readLabel } from "../lib/catalogFilters.js";
import { Link } from "react-router";
import { useCart } from "../../cart/hooks/useCart.js";
import ProductGallery from "./ProductGallery.jsx";
import { formatCurrency } from "../../../lib/currency.js";

export default function ProductDetailHero({ product, category, brand }) {
  const { addItem } = useCart();
  const categoryId = getEntityId(product?.category || category);
  const brandId = getEntityId(product?.brand || brand);

  return (
    <Card className="overflow-hidden p-0">
      <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="p-4 sm:p-6">
          <ProductGallery product={product} />
        </div>

        <div className="flex flex-col justify-between gap-8 p-6 sm:p-8">
          <div className="space-y-5">
            <div className="flex flex-wrap gap-2">
              {category ? (
                <Badge variant="neutral">{category.name}</Badge>
              ) : null}
              {brand ? <Badge variant="primary">{brand.name}</Badge> : null}
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
                <p className="text-sm text-[var(--muted)]">Stock</p>
                <p className="text-2xl font-semibold text-[var(--text)]">
                  {Number(product?.quantity ?? 0)} available
                </p>
              </div>
              <div>
                <p className="text-sm text-[var(--muted)]">Category</p>
                <p className="font-medium text-[var(--text)]">
                  {readLabel(product?.category || category)}
                </p>
              </div>
              <div>
                <p className="text-sm text-[var(--muted)]">Brand</p>
                <p className="font-medium text-[var(--text)]">
                  {readLabel(product?.brand || brand)}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() =>
                addItem({
                  id: product?._id || product?.id,
                  title: product?.title,
                  price: product?.price,
                  image: product?.imageCover || product?.images?.[0] || "",
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
            <Button
              as={Link}
              to={categoryId ? `/categories/${categoryId}` : "/products"}
              variant="secondary"
            >
              More from category
            </Button>
            <Button as={Link} to={brandId ? `/brands/${brandId}` : "/products"}>
              More from brand
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
