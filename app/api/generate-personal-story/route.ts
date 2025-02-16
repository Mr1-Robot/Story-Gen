import { createStory, getLoggedInUserData } from "@/lib/actions";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openAI = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY!,
});

export async function GET() {
  try {
    const resData = await getLoggedInUserData();
    const userPreferences = resData?.userPreferences?.details;

    // Return if no preferences exisit.
    if (!userPreferences || !resData.user) {
      return NextResponse.json(
        { error: "User has no preferences yet. Or user doesn't exist" },
        { status: 400 },
      );
    }

    // Generate image.
    const imgRes = await openAI.images.generate({
      prompt: userPreferences.at(0) || "Super hero kids-friendly image",
      n: 1,
      size: "256x256",
    });
    const imgUrl = imgRes.data?.at(0)?.url;

    // Generate story.
    const storyRes = await openAI.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Based on the user's preferences: ${userPreferences.join(
            ", ",
          )}, generate a detailed story kids-friendly between 3-6 years that includes a creative and engaging title. Ensure the title clearly reflects the story's theme, and provide the story content after the title please. `,
        },
      ],
      max_tokens: 500,
    });
    const storyText = storyRes.choices?.at(0)?.message?.content?.trim();

    if (!storyText) {
      return NextResponse.json(
        { error: "Failed to generate a story" },
        { status: 500 },
      );
    }

    // Assuming the model generates a response like "Title: [title]\n\n[story]"
    const [title, ...contentParts] = storyText.split("\n\n");
    const story = {
      title: title.replace("Title: ", "").trim(),
      content: contentParts.join("\n\n").trim(),
    };

    // Create new story.
    const newStory = await createStory({
      author: resData?.user?.email,
      storyTitle: story.title,
      imgTitle: userPreferences?.at(0) || "",
      imgUrl: imgUrl || "",
      story: story.content,
    });

    revalidatePath("/");

    return NextResponse.json({ message: newStory }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Failed to generate story",
      },
      { status: 500 },
    );
  }
}
