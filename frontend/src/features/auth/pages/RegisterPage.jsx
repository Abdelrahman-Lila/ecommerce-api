import { useNavigate, Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerDefaultValues,
  registerSchema,
} from "../schemas/register.schema.js";
import { useRegisterMutation } from "../hooks/useAuthMutations.js";
import Input from "../../../components/ui/Input.jsx";
import Button from "../../../components/ui/Button.jsx";
import ErrorState from "../../../components/ui/ErrorState.jsx";
import AuthShell from "../components/AuthShell.jsx";

export default function RegisterPage() {
  const navigate = useNavigate();
  const registerMutation = useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: registerDefaultValues,
  });

  const onSubmit = async (values) => {
    const { confirmPassword, ...payload } = values;
    try {
      const result = await registerMutation.mutateAsync(payload);

      if (result?.token) {
        navigate("/", { replace: true });
      }
    } catch {
      // Mutation state already captures the API error for the UI.
    }
  };

  return (
    <AuthShell
      title="Create your account"
      switchLabel="Already have an account?"
      switchTo="/login"
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="First name"
            placeholder="First name"
            error={errors.firstName?.message}
            {...register("firstName")}
          />
          <Input
            label="Last name"
            placeholder="Last name"
            error={errors.lastName?.message}
            {...register("lastName")}
          />
        </div>

        <Input
          label="Email"
          type="email"
          placeholder="Email"
          error={errors.email?.message}
          {...register("email")}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Phone"
            placeholder="Phone"
            error={errors.phone?.message}
            {...register("phone")}
          />
          <Input
            label="Country"
            placeholder="Country"
            error={errors.country?.message}
            {...register("country")}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="City"
            placeholder="City"
            error={errors.city?.message}
            {...register("city")}
          />
          <Input
            label="Apartment"
            placeholder="Apartment"
            error={errors.apartment?.message}
            {...register("apartment")}
          />
        </div>

        <Input
          label="Street"
          placeholder="Street"
          error={errors.street?.message}
          {...register("street")}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Password"
            type="password"
            placeholder="Password"
            error={errors.password?.message}
            {...register("password")}
          />
          <Input
            label="Confirm password"
            type="password"
            placeholder="Confirm password"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
        </div>

        {registerMutation.isError ? (
          <ErrorState
            error={registerMutation.error}
            title="Registration failed"
          />
        ) : null}

        <div className="flex items-center justify-between gap-4">
          <Button type="submit" disabled={registerMutation.isPending}>
            {registerMutation.isPending
              ? "Creating account..."
              : "Create account"}
          </Button>
          <Button as={Link} to="/products" variant="ghost">
            Browse products
          </Button>
        </div>
      </form>
    </AuthShell>
  );
}
