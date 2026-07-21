import { useState } from "react";
import { useNavigate, Link } from "react-router";
import PageShell from "../../../components/layout/PageShell.jsx";
import Badge from "../../../components/ui/Badge.jsx";
import Button from "../../../components/ui/Button.jsx";
import ErrorState from "../../../components/ui/ErrorState.jsx";
import Modal from "../../../components/ui/Modal.jsx";
import { useAuthSession } from "../hooks/useAuthSession.js";
import { useDeleteUserAccountMutation } from "../hooks/useAuthMutations.js";
import { clearAccessToken } from "../lib/authStorage.js";

export default function ProfilePage() {
  const navigate = useNavigate();
  const session = useAuthSession();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const deleteAccountMutation = useDeleteUserAccountMutation();

  const handleDeleteAccount = async () => {
    try {
      await deleteAccountMutation.mutateAsync(session.user?.id);
      clearAccessToken();
      navigate("/", { replace: true });
    } catch {
      // Mutation state renders the API error.
    }
  };

  return (
    <PageShell className="space-y-8 py-8 sm:py-10">
      <div className="space-y-3">
        <Badge variant="primary">Account</Badge>
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">
          Your profile
        </h1>
      </div>

      <section className="max-w-3xl space-y-6 rounded-3xl border border-[var(--border)] bg-white/75 p-6 shadow-sm">
        <div>
          <h2 className="text-xl font-semibold text-[var(--text)]">
            Account details
          </h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Your currently signed-in account information.
          </p>
        </div>

        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-[var(--muted)]">Email</dt>
            <dd className="mt-1 font-medium text-[var(--text)]">
              {session.user?.email}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-[var(--muted)]">Account type</dt>
            <dd className="mt-1 font-medium capitalize text-[var(--text)]">
              {session.role ?? "user"}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm text-[var(--muted)]">Account ID</dt>
            <dd className="mt-1 break-all font-medium text-[var(--text)]">
              {session.user?.id}
            </dd>
          </div>
        </dl>

        <div className="flex flex-wrap gap-3 border-t border-[var(--border)] pt-5">
          <Button as={Link} to="/profile/update">
            Update profile
          </Button>
          <Button variant="danger" onClick={() => setDeleteOpen(true)}>
            Delete my account
          </Button>
        </div>
      </section>

      <Modal
        open={deleteOpen}
        title="Delete your account?"
        onClose={() => setDeleteOpen(false)}
      >
        <div className="space-y-5">
          <p className="text-sm text-[var(--muted)]">
            This action permanently deletes your account. It cannot be undone.
          </p>
          {deleteAccountMutation.isError ? (
            <ErrorState
              error={deleteAccountMutation.error}
              title="Could not delete account"
            />
          ) : null}
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteAccount}
              disabled={deleteAccountMutation.isPending}
            >
              {deleteAccountMutation.isPending
                ? "Deleting..."
                : "Delete account"}
            </Button>
          </div>
        </div>
      </Modal>
    </PageShell>
  );
}
