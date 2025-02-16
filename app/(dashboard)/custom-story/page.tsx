import SectionHeader from "@/components/section-header";
import GenerateCustomStory from "./_components/generate-custom-story";
import { getLoggedInUserData } from "@/lib/actions";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Suspense } from "react";

export default function CustomStory() {
  return (
    <section className="flex min-h-[calc(100vh-2rem)] flex-col">
      <SectionHeader>Custom Story</SectionHeader>
      <Suspense fallback={<FallBack />}>
        <UserPreferences />
      </Suspense>
    </section>
  );
}

async function UserPreferences() {
  const userData = await getLoggedInUserData();

  if (!userData?.userPreferences) {
    return (
      <div className="mt-8 flex flex-grow flex-col items-center justify-center gap-8 px-10">
        <div className="text-center">
          <h1 className="text-xl font-medium">
            There are no preferences found.
          </h1>
          <p className="text-slate-500 dark:text-slate-200">
            Generate a new story to help system get to know you.
          </p>
        </div>
        <Link
          href="/new-story"
          className={cn(buttonVariants(), "mx-auto w-fit text-white")}
        >
          Generate Now
        </Link>
      </div>
    );
  } else {
    return <FallBack />;
  }
}

function FallBack() {
  return (
    <div className="mt-8 flex flex-grow flex-col justify-center gap-8 px-10">
      <h1 className="text-center text-lg font-medium">
        Unleash your creativity by generating a story tailored to your unique
        preferences. Based on your past choices, this page crafts a personalized
        tale just for you. Dive into your custom adventure today!
      </h1>
      <GenerateCustomStory />
    </div>
  );
}
