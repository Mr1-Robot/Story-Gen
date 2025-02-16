"use client";

import TextToSpeech from "@/components/text-to-speech";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { CreatePreference, increaseUserPoints } from "@/lib/actions";
import apiClient from "@/lib/apiClient";
import { mutateAnswers, useStoryStore } from "@/stores/story-store";
import { Star } from "lucide-react";
import { Dispatch, Suspense, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function MoreQuestions({
  story,
  author,
}: {
  story: string;
  author: string;
}) {
  const [currentTab, setCurrentTab] = useState<string>("firstTab");

  return (
    <Tabs
      defaultValue={currentTab}
      value={currentTab}
      className="mt-8 flex h-full min-h-full flex-col items-center gap-14 px-10"
    >
      <TabsContent value="firstTab">
        <FirstTab onSetCurrentTab={setCurrentTab} story={story} />
      </TabsContent>
      <TabsContent value="secondTab">
        <SecondTab onSetCurrentTab={setCurrentTab} story={story} />
      </TabsContent>
      <TabsContent value="thirdTab">
        <ThirdTab author={author} story={story} />
      </TabsContent>
    </Tabs>
  );
}

function FirstTab({
  onSetCurrentTab,
  story,
}: {
  onSetCurrentTab: Dispatch<string>;
  story: string;
}) {
  const [data, setData] = useState<{
    question: string;
    choices: string[];
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [ready, setReady] = useState<boolean>(false);
  const [answer, setAnswer] = useState<string>("");

  const generateQuestion = async () => {
    setReady(true);
    setLoading(true);

    try {
      const res = await apiClient.post("/generate-question", {
        details: `This the story that kid currently reading: ${story}.`,
      });

      if (res.status !== 200) {
        return <p className="text-red-500">Error generating questions!</p>;
      }

      setData(res.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  const answerChangeHandler = (answer: string): void => {
    mutateAnswers({ answer1: answer });
    setAnswer(answer);
  };

  return (
    <div>
      <div className="mt-24 flex flex-col gap-10">
        {!ready && (
          <h3 className="text-xl font-medium text-emerald-500">
            Are you ready for the questions?
          </h3>
        )}
        {!ready && <Button onClick={generateQuestion}>Yep. Try Me</Button>}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-3">
          {data && (
            <TextToSpeech
              data={`${data?.question}. ${data?.choices.join(",")}`}
            />
          )}
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
      </div>

      {ready && (
        <Button
          onClick={() => onSetCurrentTab("secondTab")}
          disabled={loading || !answer || answer.length === 0}
          className="mt-8 w-full"
        >
          {loading
            ? "Pleae wait..."
            : !answer || answer.length === 0
              ? "Chose one"
              : "Next"}
        </Button>
      )}
    </div>
  );
}

function SecondTab({
  onSetCurrentTab,
  story,
}: {
  onSetCurrentTab: Dispatch<string>;
  story: string;
}) {
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
        details: `This the story that kid currently reading: ${story}.`,
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
  }, [story]);

  const answerChangeHandler = (answer: string): void => {
    mutateAnswers({ answer2: answer });
    setAnswer(answer);
  };

  useEffect(() => {
    getQuestion();
  }, [getQuestion]);

  return (
    <div className="mt-8 flex h-full min-h-full flex-col items-center gap-14 px-10">
      <Suspense fallback={<Skeleton className="h-4 w-full" />}>
        <div className="flex flex-col gap-3">
          {data && (
            <TextToSpeech
              data={`${data?.question}. ${data?.choices.join(",")}`}
            />
          )}
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

function ThirdTab({ author, story }: { story: string; author: string }) {
  const store = useStoryStore();

  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<"idle" | "saving" | "done">("idle");
  const [data, setData] = useState<{
    question: string;
    choices: string[];
  } | null>(null);
  const [answer, setAnswer] = useState<string>("");

  const getQuestion = useCallback(async () => {
    setLoading(true);

    try {
      const res = await apiClient.post("/generate-question", {
        details: `This the story that kid currently reading: ${story}.`,
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
  }, [story]);

  const answerChangeHandler = (answer: string): void => {
    mutateAnswers({ answer3: answer });
    setAnswer(answer);
  };

  const saveData = async () => {
    setSaving("saving");

    const details = `${store.answer1}, ${store.answer2}, ${store.answer3}`;

    try {
      const res = await CreatePreference({ author, details });
      const pointsRes = await increaseUserPoints({ userId: author });
      const parsedJson = JSON.parse(pointsRes);

      if (res.status !== 200) {
        return <p>{res.message}</p>;
      }

      if (parsedJson.status !== 200) {
        return <p>{parsedJson.error}</p>;
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

      setSaving("done");
    } catch (err) {
      console.log(err);
      return;
    }
  };

  useEffect(() => {
    getQuestion();
  }, [getQuestion]);

  return (
    <div className="mt-8 flex h-full min-h-full flex-col items-center gap-14 px-10">
      <Suspense fallback={<Skeleton className="h-4 w-full" />}>
        <div className="flex flex-col gap-3">
          {data && (
            <TextToSpeech
              data={`${data?.question}. ${data?.choices.join(",")}`}
            />
          )}
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

      {saving !== "done" && (
        <Button
          onClick={saveData}
          disabled={
            loading || !answer || answer.length === 0 || saving === "saving"
          }
          className="mt-8 w-full"
        >
          {(() => {
            if (loading) return "Please wait...";
            if (!answer) return "Chose one";
            if (saving === "saving") return "Submitting...";
            return "Submit";
          })()}
        </Button>
      )}

      {saving === "done" && (
        <p className="text-lg font-medium text-emerald-600">
          Thanks for submitting.
        </p>
      )}
    </div>
  );
}
