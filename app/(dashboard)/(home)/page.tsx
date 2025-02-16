/* eslint-disable @typescript-eslint/no-explicit-any */

import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import SectionHeader from "@/components/section-header";
import Link from "next/link";
import Image from "next/image";
import { getUserStories } from "@/lib/actions";
import { cn, formatDate } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export default async function Home() {
  return (
    <section>
      <SectionHeader>All Stories</SectionHeader>
      <Suspense fallback={<StoriesSkeleton />}>
        <StoriesData />
      </Suspense>
    </section>
  );
}

// Stories skeleton.
function StoriesSkeleton() {
  return (
    <div className="mt-8 space-y-2 px-10">
      <Skeleton className="h-10 w-full rounded-md px-10" />
      <Skeleton className="h-10 w-full rounded-md px-10" />
      <Skeleton className="h-10 w-full rounded-md px-10" />
    </div>
  );
}

async function StoriesData() {
  const data = await getUserStories();

  if (!data || data.stories.length === 0) {
    return (
      <p className="mt-8 text-center">
        You have no stories yet.
        <Link
          href="/new-story"
          className={cn(buttonVariants(), "ml-2 text-white")}
        >
          Generate Now
        </Link>
      </p>
    );
  }

  const { stories } = data;

  return (
    <article className="mt-8 space-y-2 px-10">
      {stories.map((item: any) => (
        <Link
          key={item._id}
          href={`/stories/${item._id}`}
          className="group flex gap-4 rounded-lg bg-primary-foreground/70 p-2 transition-all hover:bg-primary-foreground"
        >
          <Image
            src={item.imgUrl}
            width={240}
            height={240}
            alt={item.storyTitle}
            priority
            className="min-w-36 rounded-md transition-transform group-hover:rotate-1 group-hover:scale-[1.01]"
          />

          <div className="flex flex-col gap-2">
            <div className="flex-grow">
              <h1 className="text-xl font-medium">{item.storyTitle}</h1>
              <p className="line-clamp-4 text-slate-600 dark:text-slate-300">
                {item.story}
              </p>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {formatDate(item.createdAt)}
            </p>
          </div>
        </Link>
      ))}
    </article>
  );
}
