import { create } from "zustand";
import { StoryStoreTypes } from "./types";

const useStoryStore = create<StoryStoreTypes>(() => ({
  question: "",
  image: { title: "", url: "" },
  answer1: "",
  answer2: "",
  answer3: "",
}));

const mutateQuestion = (value: string): void => {
  useStoryStore.setState({ question: value });
};

const mutateImage = ({ title, url }: { title: string; url: string }): void => {
  useStoryStore.setState({ image: { title, url } });
};

const mutateAnswers = ({
  answer1,
  answer2,
  answer3,
}: {
  answer1?: string;
  answer2?: string;
  answer3?: string;
}): void => {
  if (answer1) {
    useStoryStore.setState({ answer1 });
  } else if (answer2) {
    useStoryStore.setState({ answer2 });
  } else {
    useStoryStore.setState({ answer3 });
  }
};

export { useStoryStore, mutateQuestion, mutateImage, mutateAnswers };
