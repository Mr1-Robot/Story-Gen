import SectionHeader from "@/components/section-header";
import { Skeleton } from "@/components/ui/skeleton";
import { getLoggedInUserData, getRecentStories } from "@/lib/actions";
import { formatDate } from "@/lib/utils";
import { RankCardPropsTypes, StoryCardProps } from "@/types";
import { Trophy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Key, Suspense } from "react";

export default function Profile() {
  return (
    <section className="">
      <SectionHeader>My Profile</SectionHeader>
      <div className="mt-8 px-10">
        <Suspense fallback={<FallBack />}>
          <RankCardsContainer />
        </Suspense>
      </div>
    </section>
  );
}

function RankCard({ title, rank, url }: RankCardPropsTypes) {
  return (
    <div className="flex w-fit flex-grow justify-between gap-8 rounded-md bg-slate-200 px-10 py-4 dark:bg-slate-800">
      <div className="flex flex-col gap-1">
        <h1 className="font-medium">{title}</h1>
        <span className="text-xl font-semibold">{rank}</span>
      </div>
      <Image src={url} width={38} height={51} alt="Silver rank" />
    </div>
  );
}

async function RankCardsContainer() {
  const userData = await getLoggedInUserData();

  if (!userData || !userData.user) {
    return <p className="mt-8 text-center">No user found.</p>;
  }
  const rankNumber = userData.user.rank || 0;

  const calculateBadges = (rank: number) => {
    const bronze = Math.min(Math.floor(rank / 10), 10); // 1 badge for every 10 points, up to 10 badges
    const silver = Math.min(Math.floor((rank - 100) / 20), 5); // 1 badge for every 20 points after 100, up to 5 badges
    const gold = Math.max(0, Math.floor((rank - 200) / 30)); // 1 badge for every 30 points after 200

    return {
      bronze: bronze < 0 ? 0 : bronze,
      silver: silver < 0 ? 0 : silver,
      gold: gold < 0 ? 0 : gold,
    };
  };

  return (
    <article className="flex flex-col gap-10">
      <div className="flex justify-between">
        <div>
          <h1 className="text-xl font-medium">
            Welcome back,{" "}
            <span className="font-semibold">{userData.user.name}</span>
          </h1>
          <p className="text text-slate-600 dark:text-slate-400">
            Here is your detailed profile.
          </p>
        </div>

        <p className="flex flex-col items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
          <Trophy size={24} className="text-orange-500" />
          <span className="flex items-center gap-1">
            You have
            <span className="flex items-center gap-1 text-base font-semibold text-slate-900 dark:text-slate-50">
              {userData?.user?.rank ?? 0}
            </span>{" "}
            pt&apos;s
          </span>
        </p>
      </div>

      <div className="flex justify-between gap-4">
        <RankCard
          title="Bronze"
          rank={calculateBadges(rankNumber).bronze}
          url="/images/bronze.svg"
        />
        <RankCard
          title="Silver"
          rank={calculateBadges(rankNumber).silver}
          url="/images/silver.svg"
        />
        <RankCard
          title="Gold"
          rank={calculateBadges(rankNumber).gold}
          url="/images/gold.svg"
        />
      </div>

      <h1 className="text-lg font-medium">Recent Stories</h1>
      <div className="flex flex-col gap-2">
        <Suspense fallback={<StoriesFallBack />}>
          <Stories />
        </Suspense>
      </div>
    </article>
  );
}
function FallBack() {
  return (
    <article className="flex flex-col gap-10">
      <div className="flex items-center gap-1 text-xl font-medium">
        Welcome back, <Skeleton className="h-7 w-44" />
      </div>
      <div className="flex justify-between gap-4">
        {[1, 2, 3].map((_, idx) => (
          <Skeleton key={idx} className="h-24 flex-grow" />
        ))}
      </div>
    </article>
  );
}

function StoryCard({
  _id,
  imgUrl,
  storyTitle,
  story,
  createdAt,
}: StoryCardProps) {
  return (
    <Link
      href={`/stories/${_id}`}
      className="group flex cursor-pointer gap-4 rounded-lg bg-primary-foreground/70 p-2 transition-all hover:bg-primary-foreground"
    >
      <Image
        src={imgUrl}
        width={240}
        height={240}
        alt={storyTitle}
        priority
        className="min-w-36 rounded-md transition-transform group-hover:rotate-1 group-hover:scale-[1.01]"
      />

      <div className="flex flex-col gap-2">
        <div className="flex-grow">
          <h1 className="text-xl font-medium">{storyTitle}</h1>
          <p className="line-clamp-4 text-slate-600 dark:text-slate-300">
            {story}
          </p>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {formatDate(createdAt)}
        </p>
      </div>
    </Link>
  );
}

async function Stories() {
  const userStories = await getRecentStories();

  if (!userStories || userStories.stories.length === 0) {
    return <p className="text-center">No stories found.</p>;
  }

  return (
    <>
      {userStories.stories.map(
        (
          story: {
            _id: string;
            storyTitle: string;
            story: string;
            imgUrl: string;
            createdAt: { toString: () => string };
          },
          idx: Key | null | undefined,
        ) => (
          <StoryCard
            key={idx}
            _id={story._id}
            storyTitle={story.storyTitle}
            story={story.story}
            imgUrl={story.imgUrl}
            createdAt={story.createdAt.toString()}
          />
        ),
      )}
    </>
  );
}

function StoriesFallBack() {
  return (
    <>
      {[1, 2, 3].map((_, idx) => (
        <Skeleton key={idx} className="h-24 w-full" />
      ))}
    </>
  );
}
