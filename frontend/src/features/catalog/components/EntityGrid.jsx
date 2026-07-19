import EntityCard from "./EntityCard.jsx";

export default function EntityGrid({
  entities = [],
  type,
  getTo,
  showImage = true,
}) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {entities.map((entity) => (
        <EntityCard
          key={entity?._id || entity?.id}
          entity={entity}
          type={type}
          to={getTo(entity)}
          showImage={showImage}
        />
      ))}
    </div>
  );
}
