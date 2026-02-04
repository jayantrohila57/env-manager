import { Skeleton } from "@/components/ui/skeleton";

export function ProjectsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
        <Skeleton key={i} className="h-36 w-full" />
      ))}
    </div>
  );
}
