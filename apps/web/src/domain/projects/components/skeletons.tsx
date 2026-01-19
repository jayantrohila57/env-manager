import { Skeleton } from "@/components/ui/skeleton";

export function ProjectsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-36 w-full" />
      ))}
    </div>
  );
}
