import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Replicate from "replicate";
import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!
});

// Repositories of Instruction messages 
// TO-DO in the future this suppose to be modifiable by user, or can be uploaded


export async function POST(req: Request) {


    try {
        const { userId } = auth();
        const body = await req.json();
        const { prompt } = body;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!prompt) {
            return new NextResponse("Prompt are required", { status: 400 });
        }

        const freeTrial = await checkApiLimit();

        if (!freeTrial){
            return new NextResponse("Dear User, your free trial credits has ended. Top-Up to continue.", { status: 403 });
        }


        const input = {
            fps: 24,
            width: 1024,
            height: 576,
            prompt: prompt,
            guidance_scale: 17.5,
            negative_prompt: "blur, distorted",
        };

        const response = await replicate.run("anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351", { input });
        // console.log(response)

        await increaseApiLimit();
        

        // Log the response for debugging
        console.log("Video response:", response);

        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.log("VIDEO_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}