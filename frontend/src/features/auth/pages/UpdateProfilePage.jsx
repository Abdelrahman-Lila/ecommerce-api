import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router";
import PageShell from "../../../components/layout/PageShell.jsx";
import Badge from "../../../components/ui/Badge.jsx";
import Button from "../../../components/ui/Button.jsx";
import ErrorState from "../../../components/ui/ErrorState.jsx";
import Input from "../../../components/ui/Input.jsx";
import { useAuthSession } from "../hooks/useAuthSession.js";
import { useUpdateUserProfileMutation } from "../hooks/useAuthMutations.js";
import {
  profileDefaultValues,
  profileSchema,
} from "../schemas/profile.schema.js";

export default function UpdateProfilePage() {
  const session = useAuthSession();
  const updateProfileMutation = useUpdateUserProfileMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: profileDefaultValues,
  });

  const onSubmit = async (values) => {
    const payload = Object.fromEntries(
      Object.entries(values).filter(
        ([key, value]) => key !== "confirmPassword" && value !== "",
      ),
    );

    if (!Object.keys(payload).length) {
      return;
    }

    try {
      await updateProfileMutation.mutateAsync({
        userId: session.user?.id,
        payload,
      });
    } catch {
      // Mutation state renders the API error.
    }
  };

  return (
    <PageShell className="space-y-8 py-8 sm:py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-3">
          <Badge variant="primary">Account</Badge>
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">
            Update profile
          </h1>
          <p className="text-sm text-[var(--muted)]">
            Leave a field blank to keep its current value.
          </p>
        </div>
        <Button as={Link} to="/profile" variant="secondary">
          Back to profile
        </Button>
      </div>

      <form
        className="max-w-3xl space-y-5 rounded-3xl border border-[var(--border)] bg-white/75 p-6 shadow-sm"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="First name" placeholder="First name" error={errors.firstName?.message} {...register("firstName")} />
          <Input label="Last name" placeholder="Last name" error={errors.lastName?.message} {...register("lastName")} />
          <Input label="Phone" placeholder="Phone" error={errors.phone?.message} {...register("phone")} />
          <Input label="Country" placeholder="Country" error={errors.country?.message} {...register("country")} />
          <Input label="City" placeholder="City" error={errors.city?.message} {...register("city")} />
          <Input label="Apartment" placeholder="Apartment" error={errors.apartment?.message} {...register("apartment")} />
        </div>
        <Input label="Street" placeholder="Street" error={errors.street?.message} {...register("street")} />

        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="New password" type="password" placeholder="New password" error={errors.password?.message} {...register("password")} />
          <Input label="Confirm new password" type="password" placeholder="Confirm new password" error={errors.confirmPassword?.message} {...register("confirmPassword")} />
        </div>

        {updateProfileMutation.isError ? (
          <ErrorState
            error={updateProfileMutation.error}
            title="Could not update profile"
          />
        ) : null}
        {updateProfileMutation.isSuccess ? (
          <p className="text-sm font-medium text-emerald-700">
            Profile updated successfully.
          </p>
        ) : null}

        <Button type="submit" disabled={updateProfileMutation.isPending}>
          {updateProfileMutation.isPending ? "Saving..." : "Save changes"}
        </Button>
      </form>
    </PageShell>
  );
}
