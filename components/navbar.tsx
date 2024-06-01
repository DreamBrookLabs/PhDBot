"use client";

import MobileSidebar from "@/components/mobile-sidebar";
import { UserButton } from "@clerk/nextjs";

const Navbar = () => {
    return (
            <div className = "flex items-center p-4">
                <MobileSidebar />
                <div className ="flex w-full justify-end">
                    <UserButton afterSignOutUrl="localhost:3001" />
                </div>
            </div>
    );
}

export default Navbar;