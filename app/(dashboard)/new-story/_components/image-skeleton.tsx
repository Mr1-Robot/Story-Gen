import { Skeleton } from "@/components/ui/skeleton";

export default function ImagesSkeleton() {
  return (
    <div className="mt-0 flex h-full min-h-full flex-col items-center gap-14 px-10">
      <div className="flex w-full flex-col items-center gap-1">
        <Skeleton className="h-4 w-full text-center" />
        <Skeleton className="h-4 w-1/2 text-center" />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Skeleton className="size-44" />
          <Skeleton className="size-44" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="size-44" />
          <Skeleton className="size-44" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-24" />
      </div>
    </div>
  );
}
