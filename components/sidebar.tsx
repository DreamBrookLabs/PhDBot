"use client";

import Image from "next/image";
import Link from "next/link";
import { LayoutDashboard, Music, VideoIcon} from "lucide-react";
import { MessageSquare , ImageIcon, Code, Settings } from "lucide-react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";


const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-sky-500",
  },
  {
    label: "Chat with PhDBot",
    icon: MessageSquare,
    href: "/chat",
    color: "text-violet-500",
  },
  {
    label: "Code with PhDBot",
    icon: Code,
    href: "/code",
    color: "text-green-700",
  },
  {
    label: "Image Generation",
    icon: ImageIcon,
    href: "/image",
    color: "text-pink-700",
  },
  {
    label: "Video Generation",
    icon: VideoIcon,
    href: "/video",
    color: "text-orange-700",
  },
  {
    label: "Audio Generation",
    icon: Music,
    href: "/audio",
    color: "text-emerald-500",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
  },
]

const Sidebar = () => {
  const pathname = usePathname();
  return (
    <div className = "space-y-4 py-4 flex flex-col h-full bg-[#FBEED4] text-black">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14">
          <div className="relative w-60 h-16 mr-4">
            <Image 
              fill 
              alt="PhBot_logo" 
              src="/PhDBot_Long_Colored.png"/>
          </div>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link 
              href={route.href}
              key={route.href}
              className={cn("text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-black hover:bg-white/40",
              pathname === route.href ? "hover:text-black hover:bg-white/40" : "text-zinc-400"
              )}
            >
            <div className = "flex items-center flex-1">
              <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
              {route.label}
            </div>
            </Link>
          ))}
        </div>  
      </div>
    </div>
  );
}

export default Sidebar;