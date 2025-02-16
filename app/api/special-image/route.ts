import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { OpenAI } from "openai";
const openAi = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const { storyText } = await req.json();

    if (!storyText) {
      return NextResponse.json(
        { error: "storyText is required!" },
        { status: 400 },
      );
    }

    // Image prompt.
    const prompt: string = `Based on this story text generate a very descriptive image that refelects this story text: ${storyText.slice(0, 900)} please.`;

    const image = await openAi.images.generate({
      prompt,
      n: 1,
      size: "512x512",
    });

    const imgUrl = image.data?.at(0)?.url;

    if (!imgUrl) {
      return NextResponse.json({ error: "Image url" }, { status: 500 });
    }

    return NextResponse.json({ imgUrl }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error generating image" },
      { status: 500 },
    );
  }
}
