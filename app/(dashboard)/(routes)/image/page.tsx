"use client";

// Public Global here
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod"; // Control Validation for form
import { Download, ImageIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormControl, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Image from "next/image";

// Local here
import { Heading } from "@/components/heading";
import { amountOptions, formSchema, resolutionOptions } from "./constants";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";

const ImagePage = () => {
    const router = useRouter();
    const [images, setImages] = useState<string[]>([]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: "",
            amount: "1",
            resolution: "512x512",
        },
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setImages([]);

            console.log("Form values submitted: ", values);
            const response = await axios.post("/api/image", values);
            const urls = response.data.map((image: { url: string }) => image.url);
            setImages(urls);
            //form.reset();
            form.reset({ prompt: values.prompt }); // modify to print out the prompt instead of reset
        } catch (error: any) {
            if (error.code === "ETIMEDOUT") {
                console.log("Request timed out. Please try again.");
            } else {
                console.error("IMAGE_ERROR", error);
            }
        } finally {
            router.refresh();
        }
    };

    return (
        <div>
            <Heading
                title="PhDBot Image Generator"
                description="Image Illustration for your Science project."
                icon={ImageIcon}
                iconColor="text-pink-700"
                bgColor="bg-pink-700/10"
            />
            <div className="px-4 lg:px-8">
                <div>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
                        >
                            <FormField
                                name="prompt"
                                render={({ field }) => (
                                    <FormItem className="col-span-12 mt-4 lg:col-span-12">
                                        <FormLabel className="font-bold">Prompt</FormLabel>
                                        <FormControl className="m-0 p-0">
                                            <Input
                                                className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                                                disabled={isLoading}
                                                placeholder="A picture of a cute dog wearing an orange hoody sweater with a bitcoin logo."
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="amount"
                                render={({ field }) => (
                                    <FormItem className="col-span-12 lg:col-span-2">
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
                                                {amountOptions.map((option) => (
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
                                control={form.control}
                                name="resolution"
                                render={({ field }) => (
                                    <FormItem className="col-span-12 lg:col-span-2">
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
                                                {resolutionOptions.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                            <Button className="col-span-12 lg:col-span-2 w-full" disabled={isLoading}>
                                Generate
                            </Button>
                        </form>
                    </Form>
                </div>
                <div className="space-y-4 mt-4">
                    {isLoading && (
                        <div className="p-20">
                            <Loader />
                        </div>
                    )}

                    {images.length === 0 && !isLoading && (
                        <div>
                            <Empty label="No images generated" />
                        </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
                        {images.map((src) => (
                            <Card
                             key={src}
                             className="rounded-lg overflow-hidden"
                            >
                                <div className="relative aspect-square">
                                    <Image
                                    alt="Image"
                                    fill
                                    src={src}
                                    />
                                </div>
                                <CardFooter className="p-2">
                                    <Button 
                                    variant="secondary" 
                                    className="w-full"
                                    onClick={() => window.open(src)}>
                                        <Download className="h-4 w-4 mr-2"/>
                                        Download
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImagePage;
