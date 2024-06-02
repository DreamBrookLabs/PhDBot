import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";


const instructionMessage: ChatCompletionMessageParam = {
    role: "system",
    content: "You are a code generator. You must answer only in markdown code snippets. Use code comments for explanations."
}

export async function POST(req: Request) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { messages, model } = body;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!messages) {
            return new NextResponse("Messages are required", { status: 400 });
        }

        let openai: OpenAI;
        let modelToUse: string;

        switch (model) {
            case "AkashChat":
                openai = new OpenAI({
                    apiKey: process.env.AKASHCHAT_API_KEY,
                    baseURL: process.env.AKASH_BASEURL,
                });
                modelToUse = "llama3-8b";
                break;
            case "OpenAI":
                openai = new OpenAI({
                    apiKey: process.env.OPENAI_API_KEY,
                    baseURL: process.env.FORWARDED_OPENAI_URL, // Adjust if necessary
                });
                modelToUse = "gpt-4o";
                break;
            case "PhDBot":
                openai = new OpenAI({
                    apiKey: process.env.PHDBOT_API_KEY,
                    baseURL: process.env.PHDBOT_BASEURL
                });
                modelToUse = "llama3-8b";
                break;
            case "Ollama":
                openai = new OpenAI({
                    apiKey: process.env.OLLAMA_API_KEY,
                    baseURL: process.env.OLLAMA_BASEURL, // Replace with the actual endpoint
                });
                modelToUse = "llama3-8b";
                break;
            default:
                return new NextResponse("Unsupported model specified", { status: 400 });
        }

        const response = await openai.chat.completions.create({
            model: modelToUse,
            messages: [instructionMessage, ...messages],
        });

        // Log the response for debugging
        console.log("Code response:", response.choices[0].message);

        return NextResponse.json(response.choices[0].message, { status: 200 });
    } catch (error) {
        console.log("CODE_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}