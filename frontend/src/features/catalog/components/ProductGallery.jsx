import { useEffect, useMemo, useState } from "react";
import Badge from "../../../components/ui/Badge.jsx";

export default function ProductGallery({ product }) {
  const images = useMemo(() => {
    const nextImages = [product?.imageCover, ...(product?.images ?? [])].filter(
      Boolean,
    );
    return Array.from(new Set(nextImages));
  }, [product]);

  const [activeImage, setActiveImage] = useState(images[0] ?? "");

  useEffect(() => {
    setActiveImage(images[0] ?? "");
  }, [images]);

  if (!images.length) {
    return (
      <div className="flex min-h-[360px] items-center justify-center rounded-3xl bg-slate-100 text-sm text-[var(--muted)]">
        No image available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-3xl bg-slate-100 shadow-sm">
        <img
          src={activeImage}
          alt={product?.title || "Product image"}
          className="h-full w-full object-contain p-4"
        />
        <div className="absolute left-4 top-4">
          <Badge variant="neutral">{images.length} photos</Badge>
        </div>
      </div>

      {images.length > 1 ? (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
          {images.map((image) => (
            <button
              key={image}
              type="button"
              onClick={() => setActiveImage(image)}
              className={`overflow-hidden rounded-2xl border-2 transition ${
                image === activeImage
                  ? "border-[var(--primary)] shadow-md"
                  : "border-transparent opacity-80 hover:opacity-100"
              }`}
            >
              <img
                src={image}
                alt={product?.title || "Thumbnail"}
                className="aspect-square w-full object-contain p-1"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
