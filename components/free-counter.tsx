"use client";

import {useState, useEffect} from "react";
import { Zap } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { MAX_FREE_COUNTS } from "@/constants";
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button";

interface FreeCounterProps {
    apiLimitCount: number;
};


export const FreeCounter = ({
    apiLimitCount = 0
}: FreeCounterProps) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return(
        <div className = "px-3">
            <Card className="bg-black border-0">
                <CardContent className="py-6">
                    <div className = "text-center text-sm text-white mb-4">
                        <p>
                        {apiLimitCount} /  {MAX_FREE_COUNTS} Free Usages
                        </p>
                        <Progress 
                        className="h-3"
                        value={(apiLimitCount/MAX_FREE_COUNTS) * 100}/>
                    </div>
                    <Button className="w-full" variant="pro">
                        Upgrade to PhDBot Pro
                        <Zap  className="w-4 h-4 ml-2 fill-white"/>
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}

