import Badge from "../ui/Badge.jsx";
import Button from "../ui/Button.jsx";
import {
  Card,
  CardBody,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/Card.jsx";
import PageShell from "./PageShell.jsx";

export default function FeaturePlaceholderPage({
  area,
  title,
  description,
  primaryActionLabel,
  primaryActionTo,
  secondaryActionLabel,
  secondaryActionTo,
}) {
  return (
    <PageShell className="py-10 sm:py-14">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="space-y-3">
          <Badge variant="primary">{area}</Badge>
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">
            {title}
          </h1>
          <p className="max-w-2xl text-base text-[var(--muted)]">
            {description}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Foundation ready</CardTitle>
            <CardDescription>
              This route exists so the shell, layouts, and data layer can be
              wired before the actual feature UI lands.
            </CardDescription>
          </CardHeader>
          <CardBody>
            <ul className="grid gap-3 text-sm text-[var(--muted)] sm:grid-cols-2">
              <li className="rounded-2xl bg-slate-50 p-4">
                React Router layouts are in place.
              </li>
              <li className="rounded-2xl bg-slate-50 p-4">
                React Query is available app-wide.
              </li>
              <li className="rounded-2xl bg-slate-50 p-4">
                Shared UI primitives are reusable.
              </li>
              <li className="rounded-2xl bg-slate-50 p-4">
                Axios keeps the existing token interceptor.
              </li>
            </ul>
          </CardBody>
          {primaryActionLabel || secondaryActionLabel ? (
            <CardFooter>
              {primaryActionLabel ? (
                <Button as="a" href={primaryActionTo}>
                  {primaryActionLabel}
                </Button>
              ) : null}
              {secondaryActionLabel ? (
                <Button as="a" href={secondaryActionTo} variant="secondary">
                  {secondaryActionLabel}
                </Button>
              ) : null}
            </CardFooter>
          ) : null}
        </Card>
      </div>
    </PageShell>
  );
}
