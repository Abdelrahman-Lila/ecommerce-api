import ProductCard from "./ProductCard.jsx";

export default function ProductGrid({
  products = [],
  categoriesById = {},
  brandsById = {},
}) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => {
        const categoryId = product?.category?._id || product?.category;
        const brandId = product?.brand?._id || product?.brand;

        return (
          <ProductCard
            key={product?._id || product?.id}
            product={product}
            categoryName={categoriesById[categoryId]?.name}
            brandName={brandsById[brandId]?.name}
          />
        );
      })}
    </div>
  );
}
