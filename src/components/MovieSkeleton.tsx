export default function MovieSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <div className="aspect-[2/3] rounded-2xl animate-shimmer" />
      <div className="flex flex-col gap-2">
        <div className="h-4 w-3/4 rounded animate-shimmer" />
        <div className="h-3 w-1/2 rounded animate-shimmer" />
      </div>
    </div>
  );
}
