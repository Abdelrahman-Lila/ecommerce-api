import { Link } from "react-router";
import Badge from "../../../components/ui/Badge.jsx";
import { Card } from "../../../components/ui/Card.jsx";

export default function EntityCard({ entity, to, type }) {
  const imageSource = entity?.image || entity?.imageCover || "";

  return (
    <Card className="overflow-hidden p-0 transition hover:-translate-y-1 hover:shadow-[0_26px_60px_rgba(15,23,42,0.14)]">
      <Link to={to} className="block h-full">
        <div className="flex aspect-[4/3] items-center justify-center bg-slate-50">
          {imageSource ? (
            <img
              src={imageSource}
              alt={entity?.name || entity?.title || type}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-teal-50 via-white to-slate-100">
              <Badge variant="primary">{type}</Badge>
            </div>
          )}
        </div>
        <div className="space-y-2 p-4">
          <h3 className="text-lg font-semibold tracking-tight text-[var(--text)]">
            {entity?.name || entity?.title}
          </h3>
          <p className="text-sm text-[var(--muted)]">
            Browse products in this {type.toLowerCase()}.
          </p>
        </div>
      </Link>
    </Card>
  );
}
