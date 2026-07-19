import { useLocation, useNavigate, Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, loginDefaultValues } from "../schemas/login.schema.js";
import { useLoginMutation } from "../hooks/useAuthMutations.js";
import Input from "../../../components/ui/Input.jsx";
import Button from "../../../components/ui/Button.jsx";
import ErrorState from "../../../components/ui/ErrorState.jsx";
import AuthShell from "../components/AuthShell.jsx";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const loginMutation = useLoginMutation();
  const fromPath = location.state?.from?.pathname ?? "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: loginDefaultValues,
  });

  const onSubmit = async (values) => {
    try {
      const result = await loginMutation.mutateAsync(values);

      if (result?.token) {
        navigate(fromPath, { replace: true });
      }
    } catch {
      // Mutation state already captures the API error for the UI.
    }
  };

  return (
    <AuthShell
      title="Sign in to continue"
      description="Use your account to check out and access protected areas later on."
      switchLabel="Need an account?"
      switchTo="/register"
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password")}
        />

        {loginMutation.isError ? (
          <ErrorState error={loginMutation.error} title="Login failed" />
        ) : null}

        <div className="flex items-center justify-between gap-4">
          <Button type="submit" disabled={loginMutation.isPending}>
            {loginMutation.isPending ? "Signing in..." : "Sign in"}
          </Button>
          <Button as={Link} to="/products" variant="ghost">
            Browse products
          </Button>
        </div>
      </form>
    </AuthShell>
  );
}
