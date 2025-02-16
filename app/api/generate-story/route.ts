import { createStory } from "@/lib/actions";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openAI = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const { details, imgUrl, imgTitle, answer1, answer2 } = await req.json();

    if (!details || !imgUrl || !imgTitle) {
      return NextResponse.json(
        { error: "Details and img are required." },
        { status: 400 },
      );
    }

    const titlePrompt = `Based on these details: ${details}, generate a storyTitle with 5 words maximum please.`;

    const storyTitleRes = await openAI.chat.completions.create({
      model: "gpt-4o",
      messages: [{ content: titlePrompt, role: "system" }],
      max_tokens: 50,
    });

    const prompt = `Based on these details: ${details}, generate a story please.Make it kids-friendly between 3-6 years.`;

    const storyRes = await openAI.chat.completions.create({
      model: "gpt-4o",
      messages: [{ content: prompt, role: "system" }],
      max_tokens: 500,
    });

    const userEmail = cookies().get("userEmail")?.value;

    if (!userEmail) {
      return NextResponse.json(
        { error: "User not authenticated." },
        { status: 401 },
      );
    }

    const storyTitle =
      storyTitleRes.choices?.at(0)?.message?.content?.trim() || "";
    const story = storyRes.choices?.at(0)?.message?.content?.trim() || "";

    if (!story) {
      return NextResponse.json(
        { error: "Failed to generate a story." },
        { status: 500 },
      );
    }

    const createStoryResponse = await createStory({
      author: userEmail,
      imgUrl,
      imgTitle,
      storyTitle,
      story,
      answer1,
      answer2,
    });

    if (createStoryResponse.status !== 201) {
      return NextResponse.json(
        { error: createStoryResponse.message },
        { status: createStoryResponse.status },
      );
    }

    return NextResponse.json({
      story,
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Failed to generate story",
      },
      { status: 500 },
    );
  }
}
