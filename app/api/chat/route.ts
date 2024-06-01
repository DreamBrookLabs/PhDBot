import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";


const openai = new OpenAI ({
    apiKey: process.env.OPENAI_API_KEY
})


export async function POST(req: Request) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { messages } = body;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!process.env.OPENAI_API_KEY) {
            return new NextResponse("PhDBot API Key not configured", { status: 500 });
        }

        if (!messages) {
            return new NextResponse("Messages are required", { status: 400 });
        }

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages,
        });

        return new NextResponse(JSON.stringify(response.choices[0].message), { status: 200 });

    } catch (error) {
        console.log("CHAT_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
