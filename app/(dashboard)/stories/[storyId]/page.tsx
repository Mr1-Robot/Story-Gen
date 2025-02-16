import ModeToggle from "@/components/mode-toggle";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Suspense } from "react";
import { getStory, saveStoryMainImage } from "@/lib/actions";
import TextToSpeech from "@/components/text-to-speech";
import SectionHeader from "@/components/section-header";
import MoreQuestions from "../_components/more-questions";
import serverClient from "@/lib/serverClient";
import Image from "next/image";

export default function StoryDetails({
  params,
}: {
  params: { storyId: string };
}) {
  return (
    <section>
      <Suspense fallback={<StorySkeleton />}>
        <StoryData storyId={params.storyId} />
      </Suspense>
    </section>
  );
}

function StorySkeleton() {
  return (
    <>
      <div className="flex items-center justify-between gap-4 px-10 pb-3">
        <Skeleton className="h-4 w-1/3" />
        <ModeToggle />
      </div>
      <Separator className="h-px w-full border-b" />

      <div className="mt-8 flex flex-col gap-2 px-10">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </>
  );
}

async function StoryData({ storyId }: { storyId: string }) {
  const data = await getStory({ storyId });

  if (!data || !data.storyData) {
    return <p className="px-10">Story not found.</p>;
  }

  const paresdData = JSON.parse(data.storyData);

  return (
    <>
      <SectionHeader>{paresdData.storyTitle}</SectionHeader>
      <div className="flex flex-col items-center">
        <TextToSpeech data={`${paresdData.storyTitle}. ${paresdData.story}`} />

        <div className="mt-4 px-10 text-2xl font-medium leading-loose tracking-wide">
          <Suspense fallback={<MainImageSkeleton />}>
            <StoryImage
              storyText={paresdData.story}
              storyId={storyId}
              mainImgUrl={paresdData.mainImgUrl}
            />
          </Suspense>
          <p>{paresdData.story}</p>
        </div>

        <div>
          <MoreQuestions
            story={paresdData.story.toString()}
            author={paresdData.author._id}
          />
        </div>
      </div>
    </>
  );
}

async function StoryImage({
  storyText,
  storyId,
  mainImgUrl,
}: {
  storyText: string;
  storyId: string;
  mainImgUrl: string;
}) {
  if (!storyText) return <p>No story text!</p>;

  let imgSrc: string = mainImgUrl;

  console.log({ imgSrc });

  if (!mainImgUrl || mainImgUrl.length === 0) {
    try {
      const res = await serverClient.post("/special-image", { storyText });

      if (res.status !== 200) {
        return <p>Error generating image</p>;
      }
      imgSrc = res.data.imgUrl;

      await saveStoryMainImage({
        storyId,
        mainImgUrl: imgSrc,
      });
    } catch (error) {
      console.error("Error generating or saving image:", error);
      return <p>Error</p>;
    }
  }

  return (
    <figure className="my-4 mb-14">
      <Image
        src={imgSrc}
        alt="Story main image"
        width={512}
        height={512}
        className="mx-auto rounded-lg"
      />
    </figure>
  );
}

function MainImageSkeleton() {
  return <Skeleton className="mx-auto mb-14 h-[512px] w-[512px]" />;
}
