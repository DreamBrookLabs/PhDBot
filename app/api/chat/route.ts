import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";


// Repositories of Instruction messages 
// TO-DO in the future this suppose to be modifiable by user, or can be uploaded
const OpenAI_instructionMessage: ChatCompletionMessageParam = {
    role: "system",
    content: `You're OpenAI AI-Assistant. You are using gpt-4o as your LLM engine. 
    You are helpful and knowledgable about most things in general.
    You are not opiniated in your view and can be creative when helping users answers their questions, or resolving issues.`
}


const AkashChat_instructionMessage: ChatCompletionMessageParam = {
    role: "system",
    content: `You're AkashChat. You are using llama3-8b as your LLM engine. You are helpful and knowledgable about akash network. 
    Akash is an open network that lets users buy and sell computing resources securely and efficiently. 
    Purpose-built for public utility. When user say you're not knowledgable enough, 
    be humble and state your knowledge base is still under development`
}


const PhDBot_instructionMessage: ChatCompletionMessageParam = {
    role: "system",
    content: `You're PhDBot. A PhD-Level Personalized AI-Agents developed by DreamBrook Labs. 
    You're still under development so are not working as good as it may become. But you're very smart and intelligible in subject matter 
    being discussed without ever being too obsessed with detail unless user ask for it. You will have access to specific domain knowledge, 
    though some of this action tools are not available just yet.`
}


const Ollama_instructionMessage: ChatCompletionMessageParam = {
    role: "system",
    content: `You're Ollama powered AI Agent. You can be using any of the LLM-Engine accessible through the ollama server.
    This also means you can have access to all other Hugging Face model by nature. You are helpful and humble in your language,
    polite and answer questions in precise but friendly manner `
}
let instructionMessage;


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


        const freeTrial = await checkApiLimit();

        if (!freeTrial){
            return new NextResponse("Dear User, your free trial credits has ended. Top-Up to continue.", { status: 403 });
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
                instructionMessage = AkashChat_instructionMessage;
                break;
            case "OpenAI":
                openai = new OpenAI({
                    apiKey: process.env.OPENAI_API_KEY,
                    baseURL: process.env.FORWARDED_OPENAI_URL, // Adjust if necessary
                });
                modelToUse = "gpt-4o";
                instructionMessage = OpenAI_instructionMessage;
                break;
            case "PhDBot":
                openai = new OpenAI({
                    apiKey: process.env.PHDBOT_API_KEY,
                    baseURL: process.env.PHDBOT_BASEURL
                });
                modelToUse = "llama3-8b";
                instructionMessage = PhDBot_instructionMessage;
                break;
            case "Ollama":
                openai = new OpenAI({
                    apiKey: process.env.OLLAMA_API_KEY,
                    baseURL: process.env.OLLAMA_BASEURL, // Replace with the actual endpoint
                });
                modelToUse = "llama3-8b";
                instructionMessage = Ollama_instructionMessage;
                break;
            default:
                return new NextResponse("Unsupported model specified", { status: 400 });
        }

        const response = await openai.chat.completions.create({
            model: modelToUse,
            messages: [instructionMessage, ...messages],
        });

        await increaseApiLimit();

        // Log the response for debugging
        console.log("Chat response:", response.choices[0].message);

        return NextResponse.json(response.choices[0].message, { status: 200 });
    } catch (error) {
        console.log("CHAT_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}