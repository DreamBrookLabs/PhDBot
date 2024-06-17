"use client"

// Public Global here
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod"; // Control Validation for form
import { MusicIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormControl, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";



// Local here
import { Heading } from "@/components/heading";
import { formSchema, llm_engineOptions } from "./constants";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import { useProModal } from "@/hooks/use-pro-modal";


const AudioPage = () => {
    const proModal = useProModal();
    const router = useRouter();
    const [audio, setAudio] = useState<string>();
    
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
            setAudio(undefined);
           
            const response = await axios.post("/api/audio",values);

            //setAudio("https://replicate.delivery/czjl/vcgPGrfLjqRAcSZ1SvnMuELbLfmLxBoo6UOB3WZK8vXHWd8SA/out.mp3")
            setAudio(response.data.audio)
            
            form.reset({ prompt: "", llm_engine: values.llm_engine }); // Preserve selected LLM engine
        } catch (error: any) {
            if (error?.response?.status  === 403){
                proModal.onOpen();
            }

            if (error.code === 'ETIMEDOUT') {
                console.log('Request timed out. Please try again.');
            } else {
                console.error("AUDIO_ERROR", error);
            }
        } finally {
            router.refresh();
        }
    };

    return (
        <div>
            <Heading
                title="PhDBot Audio Interface"
                description="Interact with PhDBot through audio."
                icon={MusicIcon}
                iconColor="text-emerald-500"
                bgColor="bg-emerald-500/10"
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
                                                placeholder="Let PhDBot generate some audio or music for you"
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

                    {!audio && !isLoading && (
                        <div>
                            <Empty label="No Audio Generated" />
                        </div>
                    )}
                    {audio  && (
                        <audio controls className="w-full mt-8">
                            <source src={audio} type="audio/mpeg" />
                        </audio>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AudioPage;
