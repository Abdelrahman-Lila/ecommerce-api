import Button from "./Button.jsx";
import { normalizeApiError } from "../../api/error.js";

export default function ErrorState({
  error,
  title = "Something went wrong",
  onRetry,
}) {
  const normalizedError = normalizeApiError(error);

  return (
    <div className="rounded-3xl border border-red-200 bg-red-50/80 p-8 shadow-sm">
      <div className="mx-auto max-w-lg space-y-3 text-center">
        <h3 className="text-xl font-semibold text-red-900">{title}</h3>
        <p className="text-sm text-red-800">{normalizedError.message}</p>
        {onRetry ? (
          <Button variant="danger" onClick={onRetry}>
            Try again
          </Button>
        ) : null}
      </div>
    </div>
  );
}
