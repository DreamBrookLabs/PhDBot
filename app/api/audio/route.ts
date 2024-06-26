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



        const response = await replicate.run(
            "riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05",
            {
              input: {
                alpha: 0.5,
                prompt_a: prompt,
                denoising: 0.75,
                seed_image_id: "vibes",
                num_inference_steps: 50
              }
            }
          );
          
        await increaseApiLimit();
       // Log the response for debugging
        console.log("Audio response:", response);

        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.log("AUDIO_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}