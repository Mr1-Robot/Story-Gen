"use client";

import { Button } from "@/components/ui/button";
import apiClient from "@/lib/apiClient";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function GenerateCustomStory() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleGenerateStory = async () => {
    setIsLoading(true);

    try {
      const res = await apiClient.get("/generate-personal-story");

      if (res.status !== 200) {
        return <p>Error</p>;
      }

      router.push("/");

      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);

      console.log(err);
      return (
        <p>{err instanceof Error ? err.message : "Something went wrong!"}</p>
      );
    }
  };
  return (
    <Button
      onClick={handleGenerateStory}
      disabled={isLoading}
      className="mx-auto w-fit text-black dark:text-white"
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <Loader size={16} className="animate-spin" />
          <span>Generating...</span>
        </div>
      ) : (
        "Generate Custom Story"
      )}
    </Button>
  );
}
