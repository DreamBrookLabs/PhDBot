import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";

// TO-DO Repositories of image generation styles

export async function POST(req: Request) {


    try {
        const { userId } = auth();
        const body = await req.json();
        const { prompt, amount = 1, resolution = "512x512" } = body;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!prompt) {
            return new NextResponse("Prompts is required", { status: 400 });
        }

        if (!amount) {
            return new NextResponse("Amount is required", { status: 400 });
        }

        if (!resolution) {
            return new NextResponse("Resolution is required", { status: 400 });
        }

        const freeTrial = await checkApiLimit();

        if (!freeTrial){
            return new NextResponse("Dear User, your free trial credits has ended. Top-Up to continue.", { status: 403 });
        }


        let client: OpenAI;

        client = new OpenAI({
                        apiKey: process.env.OPENAI_API_KEY,
                        baseURL: process.env.FORWARDED_OPENAI_URL, // Adjust if necessary
                    });

        console.log("Sending to OpenAI", body);
        const response = await client.images.generate({
            prompt,
            n: parseInt(amount,10),
            size: resolution,
        });

        // Consider options to create variations too.
        await increaseApiLimit();

        // Log the entire response for debugging
        console.log("Entire response:", response);

        return NextResponse.json(response.data, { status: 200 });

    } catch (error) {
        console.log("IMAGE_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}