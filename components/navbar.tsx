"use client";

import { UserButton } from "@clerk/nextjs";


import MobileSidebar from "@/components/mobile-sidebar";
import { getApiLimitCount } from "@/lib/api-limit";

const Navbar = async () => {
    const apiLimitCount = await getApiLimitCount();
    return (
            <div className = "flex items-center p-4">
                <MobileSidebar apiLimitCount={apiLimitCount}/>
                <div className ="flex w-full justify-end">
                    <UserButton afterSignOutUrl="localhost:3001" />
                </div>
            </div>
    );
}

export default Navbar;