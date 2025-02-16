import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openAI = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const { details } = await req.json();

    if (!details) {
      return NextResponse.json(
        { error: "Details are required." },
        { status: 400 },
      );
    }

    // Updated prompt to enforce strict formatting
    const questionRes = await openAI.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Based on the following details: ${details}, generate a kid-friendly between 3-6 years with multiple-choice question. 
          Respond in this strict JSON format:
          {
            "question": "Your question text",
            "choices": ["Choice A", "Choice B", "Choice C", "Choice D"]
          }. Ensure JSON compliance.`,
        },
      ],
    });

    const rawResponse = questionRes.choices?.at(0)?.message?.content?.trim();

    if (!rawResponse) {
      return NextResponse.json(
        { error: "Failed to generate question" },
        { status: 500 },
      );
    }

    // Clean the raw response to ensure valid JSON
    let cleanedResponse = rawResponse.trim();

    // Remove backticks and language markers (e.g., ```json)
    if (cleanedResponse.startsWith("```")) {
      cleanedResponse = cleanedResponse.replace(/```(?:json)?/g, "").trim();
    }

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(cleanedResponse);
    } catch {
      console.error("Error parsing OpenAI response:", cleanedResponse);
      return NextResponse.json(
        { error: "Failed to parse OpenAI response." },
        { status: 500 },
      );
    }

    // Validate the parsed response
    const { question, choices } = parsedResponse;
    if (!question || !Array.isArray(choices) || choices.length === 0) {
      return NextResponse.json(
        { error: "Invalid response format from OpenAI." },
        { status: 500 },
      );
    }

    console.log({ question, choices });

    return NextResponse.json(
      { message: "Question generated successfully.", question, choices },
      { status: 200 },
    );
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Failed to generate question!",
      },
      { status: 500 },
    );
  }
}
