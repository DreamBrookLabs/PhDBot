import * as z from "zod";

export const formSchema = z.object({
    prompt: z.string().min(1, "Prompt is required"),
    llm_engine:  z.string().min(1, "Model is required")
});

export const llm_engineOptions = [
    {
        value: "AkashChat",
        label: "AkashChat",
    },
    {
        value: "OpenAI",
        label: "OpenAI",
    },
    {
        value: "PhDBot",
        label: "PhDBot",
    },
    {
        value: "Ollama",
        label: "Ollama",
    },
];