"use client";

import { Button } from "@/components/ui/button";
import { generateImages } from "@/lib/actions";
import apiClient from "@/lib/apiClient";
import { GenerateImageResponse } from "@/types";
import { Loader, Star } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dispatch, Suspense, useCallback, useEffect, useState } from "react";
import ImagesSkeleton from "./image-skeleton";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  mutateAnswers,
  mutateImage,
  mutateQuestion,
  useStoryStore,
} from "@/stores/story-store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import TextToSpeech from "@/components/text-to-speech";
import { toast } from "sonner";

export default function StoryCreation() {
  const [currentTab, setCurrentTab] = useState<string>("firstTab");

  console.log({ currentTab });

  return (
    <Tabs
      defaultValue={currentTab}
      value={currentTab}
      className="mt-8 flex h-full min-h-full flex-col items-center gap-14 px-10"
    >
      <TabsContent value="firstTab">
        <FirstTab onSetCurrentTab={setCurrentTab} />
      </TabsContent>
      <TabsContent value="secondTab">
        <SecondTab onSetCurrentTab={setCurrentTab} />
      </TabsContent>
      <TabsContent value="thirdTab">
        <ThirdTab />
      </TabsContent>
    </Tabs>
  );
}

function FirstTab({ onSetCurrentTab }: { onSetCurrentTab: Dispatch<string> }) {
  const [data, setData] = useState<GenerateImageResponse | null>(null);
  const [loadingImages, setLoadingImages] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<{
    title: string;
    url: string;
  } | null>(null);

  const getImages = useCallback(async () => {
    setLoadingImages(true);

    const data = await generateImages();
    if (data) {
      setData(data);
      mutateQuestion(data.question);
    } else {
      return (
        <p className="mt-8 flex items-center text-xl font-medium">Error</p>
      );
    }

    setLoadingImages(false);
  }, []);

  useEffect(() => {
    getImages();
  }, [getImages]);

  const selectImageHandler = (img: { title: string; url: string }) => {
    setSelectedImage({ title: img.title, url: img.url });

    mutateImage({ title: img.title, url: img.url });
  };

  return (
    <div className="mt-8 flex h-full min-h-full flex-col items-center gap-14 px-10">
      <div className="flex flex-col gap-3">
        <TextToSpeech data={data?.question || ""} />
        <h2 className="text-center text-lg font-medium">{data?.question}</h2>
      </div>
      <div className="flex flex-col gap-2">
        {loadingImages ? (
          <ImagesSkeleton />
        ) : (
          <>
            <div className="flex items-center gap-2">
              <Image
                src={data?.images?.at(0)?.url || ""}
                width={200}
                height={200}
                alt={data?.images?.at(0)?.title || ""}
                onClick={() =>
                  selectImageHandler({
                    title: data?.images?.at(0)?.title || "",
                    url: data?.images?.at(0)?.url || "",
                  })
                }
                className={cn(
                  "cursor-pointer rounded-md",
                  selectedImage?.title === data?.images?.at(0)?.title &&
                    "border-2 border-primary p-1 dark:border-white",
                )}
              />
              <Image
                src={data?.images?.at(1)?.url || ""}
                width={200}
                height={200}
                alt={data?.images?.at(1)?.title || ""}
                onClick={() =>
                  selectImageHandler({
                    title: data?.images?.at(1)?.title || "",
                    url: data?.images?.at(1)?.url || "",
                  })
                }
                className={cn(
                  "cursor-pointer rounded-md",
                  selectedImage?.title === data?.images?.at(1)?.title &&
                    "border-2 border-primary p-1 dark:border-white",
                )}
              />
            </div>
            <div className="flex items-center gap-2">
              <Image
                src={data?.images?.at(2)?.url || ""}
                width={200}
                height={200}
                alt={data?.images?.at(2)?.title || ""}
                onClick={() =>
                  selectImageHandler({
                    title: data?.images?.at(2)?.title || "",
                    url: data?.images?.at(2)?.url || "",
                  })
                }
                className={cn(
                  "cursor-pointer rounded-md",
                  selectedImage?.title === data?.images?.at(2)?.title &&
                    "border-2 border-primary p-1 dark:border-white",
                )}
              />
              <Image
                src={data?.images?.at(3)?.url || ""}
                width={200}
                height={200}
                alt={data?.images?.at(3)?.title || ""}
                onClick={() =>
                  selectImageHandler({
                    title: data?.images?.at(3)?.title || "",
                    url: data?.images?.at(3)?.url || "",
                  })
                }
                className={cn(
                  "cursor-pointer rounded-md",
                  selectedImage?.title === data?.images?.at(3)?.title &&
                    "border-2 border-primary p-1 dark:border-white",
                )}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => onSetCurrentTab("secondTab")}
                className="mt-8 w-full"
              >
                Next
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function SecondTab({ onSetCurrentTab }: { onSetCurrentTab: Dispatch<string> }) {
  const store = useStoryStore();

  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<{
    question: string;
    choices: string[];
  } | null>(null);
  const [answer, setAnswer] = useState<string>("");

  const getQuestion = useCallback(async () => {
    setLoading(true);

    try {
      const res = await apiClient.post("/generate-question", {
        details: `User selected this image title: ${store.image.title} regarding this question: ${store.question}`,
      });

      if (res.status !== 200) {
        return (
          <p className="">Error generating question! Please try again later.</p>
        );
      }

      setData(res.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  }, [store.image.title, store.question]);

  const answerChangeHandler = (answer: string): void => {
    mutateAnswers({ answer1: answer });
    setAnswer(answer);
  };

  useEffect(() => {
    getQuestion();
  }, [getQuestion]);

  return (
    <div className="mt-8 flex h-full min-h-full flex-col items-center gap-14 px-10">
      <Suspense fallback={<Skeleton className="h-4 w-full" />}>
        <div className="flex flex-col gap-3">
          <TextToSpeech
            data={`${data?.question}. ${data?.choices.join(",")}`}
          />
          <h1 className="text-center text-xl font-medium">{data?.question}</h1>
        </div>

        <ul className="space-y-2">
          {data?.choices?.map((item: string, idx: number) => (
            <li key={idx}>
              <Label
                htmlFor={item}
                className="flex cursor-pointer items-center gap-4 text-lg"
              >
                <Input
                  type="radio"
                  id={item}
                  value={item}
                  name="chose"
                  onChange={() => answerChangeHandler(item)}
                  className="size-6"
                />
                {item}
              </Label>
            </li>
          ))}
        </ul>
      </Suspense>
      <Button
        onClick={() => onSetCurrentTab("thirdTab")}
        disabled={loading || !answer || answer.length === 0}
        className="mt-8 w-full"
      >
        {loading
          ? "Pleae wait..."
          : !answer || answer.length === 0
            ? "Chose one"
            : "Next"}
      </Button>
    </div>
  );
}

function ThirdTab() {
  const store = useStoryStore();

  const router = useRouter();
  const [data, setData] = useState<{
    question: string;
    choices: string[];
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [questionLoading, setQuestionLoading] = useState<boolean>(false);
  const [answer, setAnswer] = useState<string>("");

  const { question, image } = useStoryStore();

  const getQuestion = useCallback(async () => {
    setQuestionLoading(true);

    try {
      const res = await apiClient.post("/generate-question", {
        details: `User selected this image title: ${store.image.title} regarding this question: ${store.question}, and he answered with this option: ${store.answer2}`,
      });

      if (res.status !== 200) {
        return (
          <p className="">Error generating question! Please try again later.</p>
        );
      }

      setData(res.data);
      setQuestionLoading(false);
    } catch (err) {
      console.log(err);
    }
  }, [store.answer2, store.image.title, store.question]);

  const generateStory = async () => {
    setLoading(true);
    try {
      const details = [
        `Here's the question of the story: ${question}`,
        `This is the selected image title: ${image.title} by the kid. And he answered previous question with this option: ${store.answer1}`,
      ];

      const res = await apiClient.post("/generate-story", {
        details: details.join(", "),
        imgUrl: image.url,
        imgTitle: image.title,
        answer1: store.answer1,
        answer2: store.answer2,
      });

      if (res.status !== 200) {
        console.error("Failed to generate story:", res.data.error);
        return;
      }

      // Render a toast.
      toast.success("2 more points!", {
        description:
          "Story generated successfully, and you've got 2 more points.",
        icon: <Star size={24} className="text-orange-600" />,
        action: {
          label: "Close",
          onClick: () => {},
        },
      });

      setLoading(false);
      router.push("/");
    } catch (err) {
      setLoading(false);
      console.error("Error generating story:", err);
    }
  };

  const answerChangeHandler = (answer: string): void => {
    mutateAnswers({ answer2: answer });
    setAnswer(answer);
  };

  useEffect(() => {
    getQuestion();
  }, [getQuestion]);

  return (
    <div className="mt-8 flex h-full min-h-full flex-col items-center gap-14 px-10">
      {questionLoading ? (
        <Skeleton className="h-6 w-full" />
      ) : (
        <Suspense fallback={<Skeleton className="h-4 w-full" />}>
          <div className="flex flex-col gap-3">
            <TextToSpeech
              data={`${data?.question}. ${data?.choices.join(",")}`}
            />
            <h1 className="text-center text-xl font-medium">
              {data?.question}
            </h1>
          </div>
          <ul className="space-y-2">
            {data?.choices?.map((item: string, idx: number) => (
              <li key={idx}>
                <Label
                  htmlFor={item}
                  className="flex cursor-pointer items-center gap-4 text-lg"
                >
                  <Input
                    type="radio"
                    id={item}
                    value={item}
                    name="chose"
                    onChange={() => answerChangeHandler(item)}
                    className="size-6"
                  />
                  {item}
                </Label>
              </li>
            ))}
          </ul>
        </Suspense>
      )}

      <Button
        onClick={generateStory}
        disabled={loading || !answer || answer.length === 0}
        className="mt-8 w-full"
      >
        {questionLoading ? (
          "Pleae wait..."
        ) : !answer || answer.length === 0 ? (
          "Chose one"
        ) : loading ? (
          <div className="flex items-center gap-2">
            <Loader size={16} className="animate-spin" />
            <span>Generating...</span>
          </div>
        ) : (
          "Generate"
        )}
      </Button>
    </div>
  );
}
