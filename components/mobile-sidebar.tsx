"use client";

import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet";
import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";

import { useEffect, useState } from "react";

const MobileSidebar = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return(
        <Sheet>
            <SheetTrigger>
            <div className = "md:hidden">
                <Button variant ="ghost" size ="icon">
                    <Menu className="w-8 h-8" />
                </Button>
            </div>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
                <Sidebar />
            </SheetContent>
        </Sheet>
    );
}

export default MobileSidebar;
