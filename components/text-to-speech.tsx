"use client";

import { CirclePause, Headphones } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

export default function TextToSpeech({ data }: { data: string }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSynthesisInstance] = useState(new SpeechSynthesisUtterance());

  const startSpeech = () => {
    // Start speaking
    // window.speechSynthesis.speak(speechSynthesisInstance);
    setIsSpeaking(true);
  };

  const pauseSpeech = () => {
    window.speechSynthesis.pause();
    setIsSpeaking(false);
  };

  const resumeSpeech = () => {
    window.speechSynthesis.resume();
    setIsSpeaking(true);
  };

  const stopSpeech = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  useEffect(() => {
    if (data) {
      speechSynthesisInstance.text = data;

      if (isSpeaking) {
        window.speechSynthesis.speak(speechSynthesisInstance);
        window.speechSynthesis.resume();
      }
    }

    console.log({ isSpeaking });
  }, [isSpeaking, data, speechSynthesisInstance]);

  return (
    <div className="my-6 flex items-center justify-center gap-2">
      <Button
        variant="secondary"
        className="p-3"
        onClick={isSpeaking ? pauseSpeech : resumeSpeech}
      >
        <CirclePause size={24} className="size-24 text-black dark:text-white" />
      </Button>
      <Button variant="secondary" className="p-3" onClick={startSpeech}>
        <Headphones size={24} className="size-24 text-black dark:text-white" />
      </Button>
      <Button
        variant="secondary"
        className="p-3"
        onClick={stopSpeech}
        title="Stop"
      >
        Stop
      </Button>
    </div>
  );
}
