import { NextResponse } from "next/server";
import OpenAI from "openai";

const openAI = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY!,
});

export async function GET() {
  try {
    // Generate a random question for kids.
    const questionResponse = await openAI.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "Generate a fun and engaging question for kids to help them choose their favorite heroes.",
        },
      ],
      max_tokens: 50,
    });

    const question =
      questionResponse.choices?.at(0)?.message?.content?.trim() ||
      "Which hero would you chose?";

    // Generate 4 random kid-friendly her.o prompts for images.
    const imagesPromptsReq = await openAI.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            'Generate 4 random kid-friendly hero prompts as an array of strings. Respond in this exact format: ["Prompt 1", "Prompt 2", "Prompt 3", "Prompt 4"].',
        },
      ],
      max_tokens: 150,
    });

    const imagesPrompts: string[] = JSON.parse(
      imagesPromptsReq.choices?.at(0)?.message.content || "[]",
    );

    const images = await Promise.all(
      imagesPrompts.map(async (prompt) => {
        const imgRes = await openAI.images.generate({
          prompt,
          n: 1,
          size: "256x256",
        });

        return {
          title: prompt,
          url: imgRes.data?.at(0)?.url,
        };
      }),
    );

    return NextResponse.json({
      question,
      images,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error generating images" },
      { status: 500 },
    );
  }
}
