"use client"

// Public Global here
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod"; // Control Validation for form
import { MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormControl, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ReactMarkdown from "react-markdown";


// Local here
import { Heading } from "@/components/heading";
import { formSchema, llm_engineOptions } from "./constants";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/user-avatar";
import { BotAvatar } from "@/components/bot-avatar";

const ChatPage = () => {
    const router = useRouter();
    const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([]);
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            llm_engine: "PhDBot", // Default value for model
            prompt: "",
        }
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const userMessage: ChatCompletionMessageParam = {
                role: "user",
                content: values.prompt,
            };
            const newMessages = [...messages, userMessage];

            const response = await axios.post("/api/chat", {
                messages: newMessages,
                model: values.llm_engine,
            });

            

            setMessages((current) => [...current, userMessage, response.data]);
            form.reset({ prompt: "", llm_engine: values.llm_engine }); // Preserve selected LLM engine
        } catch (error: any) {
            if (error.code === 'ETIMEDOUT') {
                console.log('Request timed out. Please try again.');
            } else {
                console.error("CHAT_ERROR", error);
            }
        } finally {
            router.refresh();
        }
    };

    return (
        <div>
            <Heading
                title="PhDBot Chat Interface"
                description="Your PhDBot live here, train and talk through here."
                icon={MessageSquare}
                iconColor="text-violet-500"
                bgColor="bg-violet-500/10"
            />
            <div className="px-4 lg:px-8">
                <div>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
                        >
                             <FormField
                                control={form.control}
                                name="llm_engine"
                                render={({ field }) => (
                                    <FormItem className="col-span-12 lg:col-span-12 w-full">
                                        <FormLabel className="font-bold">LLM Engine</FormLabel>
                                        <Select
                                            disabled={isLoading}
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue defaultValue={field.value} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {llm_engineOptions.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="prompt"
                                render={({ field }) => (
                                    <FormItem className="col-span-12 mt-4 ">
                                        <FormLabel className="font-bold" >Prompt</FormLabel>
                                        <FormControl className="m-0 p-0">
                                            <Input
                                                className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                                                disabled={isLoading}
                                                placeholder="Your Question: e.g. What's the latest breakthrough in Green Computing?"
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <Button
                                className="col-span-12 lg:col-span-2 w-full"
                                disabled={isLoading}
                            >
                                Ask PhDBot
                            </Button>
                        </form>
                    </Form>
                </div>
                <div className="space-y-4 mt-4">
                    {isLoading && (
                        <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
                            <Loader />
                        </div>
                    )}

                    {messages.length === 0 && !isLoading && (
                        <div>
                            <Empty label="No Discussion yet with PhDBot by DreamBrook Labs" />
                        </div>
                    )}
                    <div className="flex flex-col-reverse gap-y-4">
                        {messages.map((message) => (
                            <div
                                key={message.content}
                                className={cn("p-8 w-full flex items-start gap-x-8 rounded-lg", 
                                    message.role === "user" ? "bg-white border border-black/10" : "bg-muted"
                                )}
                            >
                                {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                                <ReactMarkdown
                                components={{
                                    pre: ({node, ...props}) => (
                                        <div className="overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg">
                                            <pre {...props}/>
                                        </div>
                                    ),
                                    code: ({node, ...props}) => (
                                        <code className="bg-black/10 rounded-lg p-1" {...props}/>
                                    ),
                                }}
                                className="text-sm overflow-hidden leading-7"
                                >
                                    {message.content || ""}
                                </ReactMarkdown>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChatPage;
