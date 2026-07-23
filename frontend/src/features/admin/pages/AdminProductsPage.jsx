import { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router";
import Badge from "../../../components/ui/Badge.jsx";
import Button from "../../../components/ui/Button.jsx";
import { Card } from "../../../components/ui/Card.jsx";
import EmptyState from "../../../components/ui/EmptyState.jsx";
import ErrorState from "../../../components/ui/ErrorState.jsx";
import Input from "../../../components/ui/Input.jsx";
import LoadingState from "../../../components/ui/LoadingState.jsx";
import Modal from "../../../components/ui/Modal.jsx";
import CatalogPagination from "../../catalog/components/CatalogPagination.jsx";
import { formatCurrency } from "../../../lib/currency.js";
import {
  createProduct,
  deleteProduct,
  updateProduct,
  uploadProductGalleryImages,
} from "../api/admin.api.js";
import {
  useBrands,
  useCategories,
  useProducts,
  useSubcategories,
} from "../../catalog/hooks/useCatalogQueries.js";
import {
  buildProductQueryParams,
  getEntityId,
  readLabel,
} from "../../catalog/lib/catalogFilters.js";

const selectClassName =
  "w-full rounded-2xl border border-[var(--border)] bg-white/90 px-4 py-3 text-sm text-[var(--text)] shadow-sm transition focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[rgba(15,118,110,0.18)]";
const textareaClassName =
  "min-h-32 w-full rounded-2xl border border-[var(--border)] bg-white/90 px-4 py-3 text-sm text-[var(--text)] shadow-sm transition focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[rgba(15,118,110,0.18)]";

const createEmptyForm = () => ({
  title: "",
  description: "",
  price: "",
  quantity: "",
  priceAfterDiscount: "",
  colors: "",
  rating: "",
  ratingsCount: "",
  category: "",
  brand: "",
  subcategories: [],
  imageCover: null,
  galleryImages: [],
});

export default function AdminProductsPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [productFilters, setProductFilters] = useState({
    keyword: "",
    category: "",
    brand: "",
    inStock: false,
    sort: "-createdAt",
  });
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setProductFilters((current) =>
        current.keyword === searchTerm
          ? current
          : { ...current, keyword: searchTerm },
      );
      setPage(1);
    }, 350);

    return () => window.clearTimeout(timeoutId);
  }, [searchTerm]);
  const productQueryParams = useMemo(
    () =>
      buildProductQueryParams({
        ...productFilters,
        page,
        limit: 12,
      }),
    [page, productFilters],
  );
  const productsQuery = useProducts(productQueryParams);
  const categoriesQuery = useCategories({ limit: 100, sort: "name" });
  const subcategoriesQuery = useSubcategories({ limit: 100, sort: "name" });
  const brandsQuery = useBrands({ limit: 100, sort: "name" });
  const [editor, setEditor] = useState(null);
  const [form, setForm] = useState(createEmptyForm);
  const [productToDelete, setProductToDelete] = useState(null);

  const invalidateCatalog = () =>
    queryClient.invalidateQueries({ queryKey: ["catalog"] });
  const saveMutation = useMutation({
    mutationFn: async ({ productId, payload, galleryImages }) => {
      const product = productId
        ? await updateProduct(productId, payload)
        : await createProduct(payload);
      const resolvedProductId = productId || product?._id || product?.id;

      if (galleryImages.length && resolvedProductId) {
        const galleryPayload = new FormData();
        galleryImages.forEach((image) => galleryPayload.append("images", image));
        await uploadProductGalleryImages(resolvedProductId, galleryPayload);
      }

      return product;
    },
    onSuccess: () => {
      invalidateCatalog();
      setEditor(null);
      setForm(createEmptyForm());
    },
  });
  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      invalidateCatalog();
      setProductToDelete(null);
    },
  });

  const categories = categoriesQuery.data?.items ?? [];
  const brands = brandsQuery.data?.items ?? [];
  const products = productsQuery.data?.items ?? [];
  const availableSubcategories = useMemo(
    () => {
      const subcategories = subcategoriesQuery.data?.items ?? [];

      return form.category
        ? subcategories.filter(
            (subcategory) =>
              getEntityId(subcategory?.category) === form.category ||
              subcategory?.category === form.category,
          )
        : subcategories;
    },
    [form.category, subcategoriesQuery.data],
  );

  const setField = (field, value) =>
    setForm((current) => ({ ...current, [field]: value }));
  const setProductFilter = (field, value) => {
    setProductFilters((current) => ({ ...current, [field]: value }));
    setPage(1);
  };
  const clearProductFilters = () =>
    {
      setSearchTerm("");
      setPage(1);
      setProductFilters({
        keyword: "",
        category: "",
        brand: "",
        inStock: false,
        sort: "-createdAt",
      });
    };
  const openCreate = () => {
    setEditor({});
    setForm(createEmptyForm());
  };
  const openEdit = (product) => {
    setEditor(product);
    setForm({
      ...createEmptyForm(),
      title: product?.title ?? "",
      description: product?.description ?? "",
      price: String(product?.price ?? ""),
      quantity: String(product?.quantity ?? ""),
      priceAfterDiscount: String(product?.priceAfterDiscount ?? ""),
      colors: (product?.colors ?? []).join(", "),
      rating: String(product?.rating ?? ""),
      ratingsCount: String(product?.ratingsCount ?? ""),
    });
  };
  const handleSave = async (event) => {
    event.preventDefault();
    const productId = editor?._id || editor?.id;

    if (!form.title.trim() || !form.description.trim() || !form.price || !form.quantity) {
      return;
    }

    if (!productId && (!form.category || !form.imageCover)) {
      return;
    }

    const productPayload = {
      title: form.title.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      quantity: Number(form.quantity),
      ...(form.priceAfterDiscount
        ? { priceAfterDiscount: Number(form.priceAfterDiscount) }
        : {}),
      ...(form.colors
        ? {
            colors: form.colors
              .split(",")
              .map((color) => color.trim())
              .filter(Boolean),
          }
        : {}),
      ...(form.rating ? { rating: Number(form.rating) } : {}),
      ...(form.ratingsCount ? { ratingsCount: Number(form.ratingsCount) } : {}),
      ...(form.category ? { category: form.category } : {}),
      ...(form.brand ? { brand: form.brand } : {}),
      ...(form.subcategories.length
        ? { subcategories: form.subcategories }
        : {}),
    };

    try {
      if (productId) {
        await saveMutation.mutateAsync({
          productId,
          payload: productPayload,
          galleryImages: form.galleryImages,
        });
      } else {
        const createPayload = new FormData();
        Object.entries(productPayload).forEach(([key, value]) => {
          createPayload.append(
            key,
            Array.isArray(value) ? JSON.stringify(value) : String(value),
          );
        });
        createPayload.append("imageCover", form.imageCover);
        await saveMutation.mutateAsync({
          payload: createPayload,
          galleryImages: form.galleryImages,
        });
      }
    } catch {
      // Mutation state renders the API error.
    }
  };
  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(productToDelete?._id || productToDelete?.id);
    } catch {
      // Mutation state renders the API error.
    }
  };

  if (
    productsQuery.isLoading ||
    categoriesQuery.isLoading ||
    subcategoriesQuery.isLoading ||
    brandsQuery.isLoading
  ) {
    return <LoadingState label="Loading products" />;
  }

  if (
    productsQuery.isError ||
    categoriesQuery.isError ||
    subcategoriesQuery.isError ||
    brandsQuery.isError
  ) {
    return (
      <ErrorState
        error={
          productsQuery.error ||
          categoriesQuery.error ||
          subcategoriesQuery.error ||
          brandsQuery.error
        }
        title="Could not load products"
        onRetry={() => window.location.reload()}
      />
    );
  }

  const isEditing = Boolean(editor?._id || editor?.id);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-3">
          <Badge variant="warning">Catalog management</Badge>
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">
            Products
          </h1>
          <p className="text-sm text-[var(--muted)]">
            Create products, maintain product information, manage gallery images,
            and remove discontinued items.
          </p>
        </div>
        <Button onClick={openCreate} disabled={!categories.length}>
          Add product
        </Button>
      </div>

      <div className="rounded-3xl border border-[var(--border)] bg-white/70 p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(0,1.6fr)_1fr_1fr_1fr_auto] xl:items-end">
          <Input
            label="Search products"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search title or description"
          />
          <label className="block space-y-2 text-sm font-medium text-[var(--text)]">
            <span>Category</span>
            <select
              className={selectClassName}
              value={productFilters.category}
              onChange={(event) => setProductFilter("category", event.target.value)}
            >
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={getEntityId(category)} value={getEntityId(category)}>
                  {category?.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block space-y-2 text-sm font-medium text-[var(--text)]">
            <span>Brand</span>
            <select
              className={selectClassName}
              value={productFilters.brand}
              onChange={(event) => setProductFilter("brand", event.target.value)}
            >
              <option value="">All brands</option>
              {brands.map((brand) => (
                <option key={getEntityId(brand)} value={getEntityId(brand)}>
                  {brand?.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block space-y-2 text-sm font-medium text-[var(--text)]">
            <span>Availability</span>
            <select
              className={selectClassName}
              value={productFilters.inStock ? "in-stock" : "all"}
              onChange={(event) => setProductFilter("inStock", event.target.value === "in-stock")}
            >
              <option value="all">All products</option>
              <option value="in-stock">In stock</option>
            </select>
          </label>
          <label className="block space-y-2 text-sm font-medium text-[var(--text)]">
            <span>Sort by</span>
            <select
              className={selectClassName}
              value={productFilters.sort}
              onChange={(event) => setProductFilter("sort", event.target.value)}
            >
              <option value="-createdAt">Newest</option>
              <option value="title">Name: A–Z</option>
              <option value="price">Price: low to high</option>
              <option value="-price">Price: high to low</option>
              <option value="quantity">Stock: low to high</option>
            </select>
          </label>
        </div>
        <div className="mt-3 flex justify-end">
          <Button variant="secondary" size="sm" onClick={clearProductFilters}>
            Clear filters
          </Button>
        </div>
      </div>

      {!categories.length ? (
        <EmptyState
          title="Create a category first"
          description="Products need a category before they can be added."
          actionLabel="Manage categories"
          onAction={() => window.location.assign("/admin/categories")}
        />
      ) : products.length ? (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
            <Card key={product?._id || product?.id} className="space-y-4">
              <div className="flex gap-4">
                <div className="flex h-20 w-20 flex-none items-center justify-center overflow-hidden rounded-2xl bg-slate-100">
                  {product?.imageCover ? (
                    <img
                      src={product.imageCover}
                      alt={product?.title || "Product"}
                      className="h-full w-full object-contain p-1"
                    />
                  ) : null}
                </div>
                <div className="min-w-0">
                  <h2 className="line-clamp-2 text-lg font-semibold text-[var(--text)]">
                    {product?.title}
                  </h2>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {formatCurrency(product?.price)} · {product?.quantity ?? 0} in stock
                  </p>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {readLabel(product?.category)}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  as={Link}
                  to={`/products/${product?._id || product?.id}`}
                  variant="secondary"
                  size="sm"
                >
                  View product
                </Button>
                <Button variant="secondary" size="sm" onClick={() => openEdit(product)}>
                  Edit
                </Button>
                <Button variant="danger" size="sm" onClick={() => setProductToDelete(product)}>
                  Delete
                </Button>
              </div>
            </Card>
            ))}
          </div>
          <CatalogPagination meta={productsQuery.data?.meta} onPageChange={setPage} />
        </div>
      ) : (
        <EmptyState
          title="No products yet"
          description="Create the first catalog product with a cover image."
          actionLabel="Add product"
          onAction={openCreate}
        />
      )}

      <Modal
        open={Boolean(editor)}
        title={isEditing ? "Edit product" : "Add product"}
        onClose={() => setEditor(null)}
        className="max-h-[calc(100vh-2rem)] max-w-4xl overflow-y-auto"
      >
        <form className="space-y-5" onSubmit={handleSave}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Title" value={form.title} onChange={(event) => setField("title", event.target.value)} placeholder="Product title" />
            <Input label="Price" type="number" min="0" step="1" value={form.price} onChange={(event) => setField("price", event.target.value)} placeholder="Price" />
            <Input label="Quantity" type="number" min="0" step="1" value={form.quantity} onChange={(event) => setField("quantity", event.target.value)} placeholder="Quantity" />
            <Input label="Discounted price" type="number" min="0" step="1" value={form.priceAfterDiscount} onChange={(event) => setField("priceAfterDiscount", event.target.value)} placeholder="Optional" />
            <Input label="Colors" value={form.colors} onChange={(event) => setField("colors", event.target.value)} placeholder="Red, Blue" />
            <Input label="Rating" type="number" min="1" max="5" step="0.1" value={form.rating} onChange={(event) => setField("rating", event.target.value)} placeholder="Optional" />
          </div>
          <Input label="Rating count" type="number" min="0" step="1" value={form.ratingsCount} onChange={(event) => setField("ratingsCount", event.target.value)} placeholder="Optional" />
          <label className="block space-y-2 text-sm font-medium text-[var(--text)]">
            <span>Description</span>
            <textarea className={textareaClassName} value={form.description} onChange={(event) => setField("description", event.target.value)} placeholder="Product description" />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-2 text-sm font-medium text-[var(--text)]">
              <span>Category {isEditing ? "(optional reassignment)" : ""}</span>
              <select className={selectClassName} value={form.category} onChange={(event) => {
                setField("category", event.target.value);
                setField("subcategories", []);
              }}>
                <option value="">{isEditing ? "Keep current category" : "Select a category"}</option>
                {categories.map((category) => <option key={category?._id || category?.id} value={category?._id || category?.id}>{category?.name}</option>)}
              </select>
            </label>
            <label className="block space-y-2 text-sm font-medium text-[var(--text)]">
              <span>Brand {isEditing ? "(optional reassignment)" : ""}</span>
              <select className={selectClassName} value={form.brand} onChange={(event) => setField("brand", event.target.value)}>
                <option value="">{isEditing ? "Keep current brand" : "No brand"}</option>
                {brands.map((brand) => <option key={brand?._id || brand?.id} value={brand?._id || brand?.id}>{brand?.name}</option>)}
              </select>
            </label>
          </div>
          <label className="block space-y-2 text-sm font-medium text-[var(--text)]">
            <span>Subcategories</span>
            <select className={selectClassName} multiple value={form.subcategories} onChange={(event) => setField("subcategories", Array.from(event.target.selectedOptions, (option) => option.value))}>
              {availableSubcategories.map((subcategory) => <option key={subcategory?._id || subcategory?.id} value={subcategory?._id || subcategory?.id}>{subcategory?.name}</option>)}
            </select>
            <span className="text-xs font-normal text-[var(--muted)]">Hold Ctrl or Command to choose more than one.</span>
          </label>
          {!isEditing ? (
            <Input label="Cover image" type="file" accept="image/png,image/jpeg" onChange={(event) => setField("imageCover", event.target.files?.[0] ?? null)} helperText="PNG or JPEG image required." />
          ) : null}
          <Input label={isEditing ? "Add gallery images" : "Gallery images"} type="file" accept="image/png,image/jpeg" multiple onChange={(event) => setField("galleryImages", Array.from(event.target.files ?? []))} helperText="Optional: up to 5 PNG or JPEG images." />
          {saveMutation.isError ? <ErrorState error={saveMutation.error} title={`Could not ${isEditing ? "update" : "create"} product`} /> : null}
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setEditor(null)}>Cancel</Button>
            <Button type="submit" disabled={saveMutation.isPending}>{saveMutation.isPending ? "Saving..." : isEditing ? "Save changes" : "Create product"}</Button>
          </div>
        </form>
      </Modal>

      <Modal open={Boolean(productToDelete)} title="Delete product?" onClose={() => setProductToDelete(null)}>
        <div className="space-y-5">
          <p className="text-sm text-[var(--muted)]">This permanently removes {productToDelete?.title} and its cover image.</p>
          {deleteMutation.isError ? <ErrorState error={deleteMutation.error} title="Could not delete product" /> : null}
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setProductToDelete(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete} disabled={deleteMutation.isPending}>{deleteMutation.isPending ? "Deleting..." : "Delete product"}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
