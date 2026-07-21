import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Badge from "../../../components/ui/Badge.jsx";
import Button from "../../../components/ui/Button.jsx";
import { Card } from "../../../components/ui/Card.jsx";
import EmptyState from "../../../components/ui/EmptyState.jsx";
import ErrorState from "../../../components/ui/ErrorState.jsx";
import Input from "../../../components/ui/Input.jsx";
import LoadingState from "../../../components/ui/LoadingState.jsx";
import Modal from "../../../components/ui/Modal.jsx";
import { createBrand, deleteBrand, updateBrand } from "../api/admin.api.js";
import { useBrands } from "../../catalog/hooks/useCatalogQueries.js";

export default function AdminBrandsPage() {
  const queryClient = useQueryClient();
  const [sortOrder, setSortOrder] = useState("name");
  const brandsQuery = useBrands({ limit: 100, sort: sortOrder });
  const [editor, setEditor] = useState(null);
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [brandToDelete, setBrandToDelete] = useState(null);

  const invalidateCatalog = () =>
    queryClient.invalidateQueries({ queryKey: ["catalog"] });
  const saveMutation = useMutation({
    mutationFn: ({ brandId, payload }) =>
      brandId ? updateBrand(brandId, payload) : createBrand(payload),
    onSuccess: () => {
      invalidateCatalog();
      setEditor(null);
      setName("");
      setImage(null);
    },
  });
  const deleteMutation = useMutation({
    mutationFn: deleteBrand,
    onSuccess: () => {
      invalidateCatalog();
      setBrandToDelete(null);
    },
  });

  const openCreate = () => {
    setEditor({});
    setName("");
    setImage(null);
  };
  const openEdit = (brand) => {
    setEditor(brand);
    setName(brand?.name ?? "");
    setImage(null);
  };
  const handleSave = async (event) => {
    event.preventDefault();
    const trimmedName = name.trim();
    const brandId = editor?._id || editor?.id;

    if (!trimmedName || (!brandId && !image)) return;

    try {
      await saveMutation.mutateAsync({
        brandId,
        payload: brandId ? { name: trimmedName } : { name: trimmedName, image },
      });
    } catch {
      // Mutation state renders the API error.
    }
  };
  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(brandToDelete?._id || brandToDelete?.id);
    } catch {
      // Mutation state renders the API error.
    }
  };

  if (brandsQuery.isLoading) {
    return <LoadingState label="Loading brands" />;
  }

  if (brandsQuery.isError) {
    return (
      <ErrorState
        error={brandsQuery.error}
        title="Could not load brands"
        onRetry={() => window.location.reload()}
      />
    );
  }

  const brands = brandsQuery.data?.items ?? [];
  const isEditing = Boolean(editor?._id || editor?.id);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-3">
          <Badge variant="warning">Catalog management</Badge>
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">
            Brands
          </h1>
          <p className="text-sm text-[var(--muted)]">
            Create, rename, and remove brands from the catalog.
          </p>
        </div>
        <Button onClick={openCreate}>Add brand</Button>
      </div>

      <div className="max-w-xs">
        <label className="block space-y-2 text-sm font-medium text-[var(--text)]">
          <span>Sort brands</span>
          <select
            className="w-full rounded-2xl border border-[var(--border)] bg-white/90 px-4 py-3 text-sm text-[var(--text)] shadow-sm transition focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[rgba(15,118,110,0.18)]"
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value)}
          >
            <option value="name">A–Z</option>
            <option value="-name">Z–A</option>
          </select>
        </label>
      </div>

      {brands.length ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {brands.map((brand) => (
            <Card key={brand?._id || brand?.id} className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 flex-none items-center justify-center overflow-hidden rounded-2xl bg-slate-100">
                  {brand?.image ? (
                    <img
                      src={brand.image}
                      alt={brand?.name || "Brand"}
                      className="h-full w-full object-contain p-1"
                    />
                  ) : null}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-[var(--text)]">
                    {brand?.name}
                  </h2>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="secondary" size="sm" onClick={() => openEdit(brand)}>
                  Edit
                </Button>
                <Button variant="danger" size="sm" onClick={() => setBrandToDelete(brand)}>
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No brands yet"
          description="Create a brand to associate it with products."
          actionLabel="Add brand"
          onAction={openCreate}
        />
      )}

      <Modal
        open={Boolean(editor)}
        title={isEditing ? "Edit brand" : "Add brand"}
        onClose={() => setEditor(null)}
      >
        <form className="space-y-5" onSubmit={handleSave}>
          <Input
            label="Brand name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Brand name"
            autoFocus
          />
          {!isEditing ? (
            <Input
              label="Brand image"
              type="file"
              accept="image/png,image/jpeg"
              onChange={(event) => setImage(event.target.files?.[0] ?? null)}
              helperText="PNG or JPEG image required."
            />
          ) : (
            <p className="text-sm text-[var(--muted)]">
              The current backend supports brand-name updates only; image changes
              require a separate backend upload endpoint.
            </p>
          )}
          {saveMutation.isError ? (
            <ErrorState
              error={saveMutation.error}
              title={`Could not ${isEditing ? "update" : "create"} brand`}
            />
          ) : null}
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setEditor(null)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saveMutation.isPending}>
              {saveMutation.isPending
                ? "Saving..."
                : isEditing
                  ? "Save changes"
                  : "Create brand"}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={Boolean(brandToDelete)}
        title="Delete brand?"
        onClose={() => setBrandToDelete(null)}
      >
        <div className="space-y-5">
          <p className="text-sm text-[var(--muted)]">
            This removes {brandToDelete?.name}. Ensure no products still rely on
            it before continuing.
          </p>
          {deleteMutation.isError ? (
            <ErrorState error={deleteMutation.error} title="Could not delete brand" />
          ) : null}
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setBrandToDelete(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? "Deleting..." : "Delete brand"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
