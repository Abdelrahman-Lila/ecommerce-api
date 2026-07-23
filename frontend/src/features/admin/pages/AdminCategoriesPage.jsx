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
  createCategory,
  deleteCategory,
  updateCategory,
} from "../api/admin.api.js";
import { useCategories } from "../../catalog/hooks/useCatalogQueries.js";

const emptyForm = { name: "" };

export default function AdminCategoriesPage() {
  const queryClient = useQueryClient();
  const [sortOrder, setSortOrder] = useState("name");
  const [page, setPage] = useState(1);
  const categoriesQuery = useCategories({ limit: 12, page, sort: sortOrder });
  const [editor, setEditor] = useState(null);
  const [name, setName] = useState("");
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const invalidateCatalog = () =>
    queryClient.invalidateQueries({ queryKey: ["catalog"] });

  const saveMutation = useMutation({
    mutationFn: ({ categoryId, payload }) =>
      categoryId ? updateCategory(categoryId, payload) : createCategory(payload),
    onSuccess: () => {
      invalidateCatalog();
      setEditor(null);
      setName("");
    },
  });
  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      invalidateCatalog();
      setCategoryToDelete(null);
    },
  });

  const openCreate = () => {
    setEditor(emptyForm);
    setName("");
  };
  const openEdit = (category) => {
    setEditor(category);
    setName(category?.name ?? "");
  };
  const handleSave = async (event) => {
    event.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName) return;

    try {
      await saveMutation.mutateAsync({
        categoryId: editor?._id || editor?.id,
        payload: { name: trimmedName },
      });
    } catch {
      // Mutation state renders the API error.
    }
  };
  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(categoryToDelete?._id || categoryToDelete?.id);
    } catch {
      // Mutation state renders the API error.
    }
  };

  if (categoriesQuery.isLoading) {
    return <LoadingState label="Loading categories" />;
  }

  if (categoriesQuery.isError) {
    return (
      <ErrorState
        error={categoriesQuery.error}
        title="Could not load categories"
        onRetry={() => window.location.reload()}
      />
    );
  }

  const categories = categoriesQuery.data?.items ?? [];
  const isEditing = Boolean(editor?._id || editor?.id);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-3">
          <Badge variant="warning">Catalog management</Badge>
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">
            Categories
          </h1>
          <p className="text-sm text-[var(--muted)]">
            Create, rename, and remove product categories.
          </p>
        </div>
        <Button onClick={openCreate}>Add category</Button>
      </div>

      <div className="max-w-xs">
        <label className="block space-y-2 text-sm font-medium text-[var(--text)]">
          <span>Sort categories</span>
          <select
            className="w-full rounded-2xl border border-[var(--border)] bg-white/90 px-4 py-3 text-sm text-[var(--text)] shadow-sm transition focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[rgba(15,118,110,0.18)]"
            value={sortOrder}
            onChange={(event) => {
              setSortOrder(event.target.value);
              setPage(1);
            }}
          >
            <option value="name">A–Z</option>
            <option value="-name">Z–A</option>
          </select>
        </label>
      </div>

      {categories.length ? (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {categories.map((category) => (
            <Card key={category?._id || category?.id} className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-[var(--text)]">
                  {category?.name}
                </h2>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="secondary" size="sm" onClick={() => openEdit(category)}>
                  Edit
                </Button>
                <Button variant="danger" size="sm" onClick={() => setCategoryToDelete(category)}>
                  Delete
                </Button>
              </div>
            </Card>
            ))}
          </div>
          <CatalogPagination meta={categoriesQuery.data?.meta} onPageChange={setPage} />
        </div>
      ) : (
        <EmptyState
          title="No categories yet"
          description="Create the first category before managing subcategories or products."
          actionLabel="Add category"
          onAction={openCreate}
        />
      )}

      <Modal
        open={Boolean(editor)}
        title={isEditing ? "Edit category" : "Add category"}
        onClose={() => {
          setEditor(null);
          setName("");
        }}
      >
        <form className="space-y-5" onSubmit={handleSave}>
          <Input
            label="Category name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Category name"
            autoFocus
          />
          {saveMutation.isError ? (
            <ErrorState
              error={saveMutation.error}
              title={`Could not ${isEditing ? "update" : "create"} category`}
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
                  : "Create category"}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={Boolean(categoryToDelete)}
        title="Delete category?"
        onClose={() => setCategoryToDelete(null)}
      >
        <div className="space-y-5">
          <p className="text-sm text-[var(--muted)]">
            This removes {categoryToDelete?.name}. Ensure no products still rely
            on it before continuing.
          </p>
          {deleteMutation.isError ? (
            <ErrorState
              error={deleteMutation.error}
              title="Could not delete category"
            />
          ) : null}
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setCategoryToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete category"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
