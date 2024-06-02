import * as z from "zod";

export const formSchema = z.object({
    prompt: z.string().min(1, "Prompt is required"),
    llm_engine: z.enum(["AkashChat", "OpenAI", "PhDBot", "Ollama"], {
        required_error: "Model is required",
    }),
});
