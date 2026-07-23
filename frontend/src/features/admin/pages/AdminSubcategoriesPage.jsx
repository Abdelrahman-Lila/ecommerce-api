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
import CatalogPagination from "../../catalog/components/CatalogPagination.jsx";
import {
  createSubcategory,
  deleteSubcategory,
  updateSubcategory,
} from "../api/admin.api.js";
import {
  useCategories,
  useSubcategories,
} from "../../catalog/hooks/useCatalogQueries.js";

const selectClassName =
  "w-full rounded-2xl border border-[var(--border)] bg-white/90 px-4 py-3 text-sm text-[var(--text)] shadow-sm transition focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[rgba(15,118,110,0.18)]";

export default function AdminSubcategoriesPage() {
  const queryClient = useQueryClient();
  const categoriesQuery = useCategories({ limit: 100, sort: "name" });
  const [categoryFilterId, setCategoryFilterId] = useState("");
  const [page, setPage] = useState(1);
  const subcategoriesQuery = useSubcategories({
    limit: 12,
    page,
    sort: "name",
    ...(categoryFilterId ? { category: categoryFilterId } : {}),
  });
  const [editor, setEditor] = useState(null);
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subcategoryToDelete, setSubcategoryToDelete] = useState(null);

  const invalidateCatalog = () =>
    queryClient.invalidateQueries({ queryKey: ["catalog"] });
  const saveMutation = useMutation({
    mutationFn: ({ subcategoryId, payload }) =>
      subcategoryId
        ? updateSubcategory(subcategoryId, payload)
        : createSubcategory(payload),
    onSuccess: () => {
      invalidateCatalog();
      setEditor(null);
      setName("");
      setCategoryId("");
    },
  });
  const deleteMutation = useMutation({
    mutationFn: deleteSubcategory,
    onSuccess: () => {
      invalidateCatalog();
      setSubcategoryToDelete(null);
    },
  });

  const openCreate = () => {
    setEditor({});
    setName("");
    setCategoryId("");
  };
  const openEdit = (subcategory) => {
    setEditor(subcategory);
    setName(subcategory?.name ?? "");
    setCategoryId(subcategory?.category?._id || subcategory?.category || "");
  };
  const handleSave = async (event) => {
    event.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName || !categoryId) return;

    try {
      await saveMutation.mutateAsync({
        subcategoryId: editor?._id || editor?.id,
        payload: { name: trimmedName, category: categoryId },
      });
    } catch {
      // Mutation state renders the API error.
    }
  };
  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(
        subcategoryToDelete?._id || subcategoryToDelete?.id,
      );
    } catch {
      // Mutation state renders the API error.
    }
  };

  if (categoriesQuery.isLoading || subcategoriesQuery.isLoading) {
    return <LoadingState label="Loading subcategories" />;
  }

  if (categoriesQuery.isError || subcategoriesQuery.isError) {
    return (
      <ErrorState
        error={categoriesQuery.error || subcategoriesQuery.error}
        title="Could not load subcategories"
        onRetry={() => window.location.reload()}
      />
    );
  }

  const categories = categoriesQuery.data?.items ?? [];
  const subcategories = subcategoriesQuery.data?.items ?? [];
  const categoriesById = Object.fromEntries(
    categories.map((category) => [category?._id || category?.id, category]),
  );
  const isEditing = Boolean(editor?._id || editor?.id);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-3">
          <Badge variant="warning">Catalog management</Badge>
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">
            Subcategories
          </h1>
          <p className="text-sm text-[var(--muted)]">
            Organize product collections beneath their parent categories.
          </p>
        </div>
        <Button onClick={openCreate} disabled={!categories.length}>
          Add subcategory
        </Button>
      </div>

      <div className="max-w-md">
        <label className="block space-y-2 text-sm font-medium text-[var(--text)]">
          <span>Filter by category</span>
          <select
            className={selectClassName}
            value={categoryFilterId}
            onChange={(event) => {
              setCategoryFilterId(event.target.value);
              setPage(1);
            }}
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category?._id || category?.id} value={category?._id || category?.id}>
                {category?.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {!categories.length ? (
        <EmptyState
          title="Create a category first"
          description="Subcategories require a parent category."
          actionLabel="Manage categories"
          onAction={() => window.location.assign("/admin/categories")}
        />
      ) : subcategories.length ? (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {subcategories.map((subcategory) => {
            const parentId =
              subcategory?.category?._id || subcategory?.category || "";
            const parentName =
              subcategory?.category?.name || categoriesById[parentId]?.name || "Unassigned";

            return (
              <Card key={subcategory?._id || subcategory?.id} className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold text-[var(--text)]">
                    {subcategory?.name}
                  </h2>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {parentName}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button variant="secondary" size="sm" onClick={() => openEdit(subcategory)}>
                    Edit
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => setSubcategoryToDelete(subcategory)}>
                    Delete
                  </Button>
                </div>
              </Card>
            );
            })}
          </div>
          <CatalogPagination meta={subcategoriesQuery.data?.meta} onPageChange={setPage} />
        </div>
      ) : (
        <EmptyState
          title={categoryFilterId ? "No subcategories in this category" : "No subcategories yet"}
          description={categoryFilterId ? "Choose another category or clear the filter." : "Create a subcategory to organize products more precisely."}
          actionLabel={categoryFilterId ? "Clear filter" : "Add subcategory"}
          onAction={categoryFilterId ? () => {
            setCategoryFilterId("");
            setPage(1);
          } : openCreate}
        />
      )}

      <Modal
        open={Boolean(editor)}
        title={isEditing ? "Edit subcategory" : "Add subcategory"}
        onClose={() => setEditor(null)}
      >
        <form className="space-y-5" onSubmit={handleSave}>
          <Input
            label="Subcategory name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Subcategory name"
            autoFocus
          />
          <label className="block space-y-2 text-sm font-medium text-[var(--text)]">
            <span>Parent category</span>
            <select
              className={selectClassName}
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category?._id || category?.id} value={category?._id || category?.id}>
                  {category?.name}
                </option>
              ))}
            </select>
          </label>
          {saveMutation.isError ? (
            <ErrorState
              error={saveMutation.error}
              title={`Could not ${isEditing ? "update" : "create"} subcategory`}
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
                  : "Create subcategory"}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={Boolean(subcategoryToDelete)}
        title="Delete subcategory?"
        onClose={() => setSubcategoryToDelete(null)}
      >
        <div className="space-y-5">
          <p className="text-sm text-[var(--muted)]">
            This removes {subcategoryToDelete?.name}. Ensure no products still
            rely on it before continuing.
          </p>
          {deleteMutation.isError ? (
            <ErrorState
              error={deleteMutation.error}
              title="Could not delete subcategory"
            />
          ) : null}
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setSubcategoryToDelete(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? "Deleting..." : "Delete subcategory"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
