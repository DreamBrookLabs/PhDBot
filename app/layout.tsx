import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider} from '@clerk/nextjs'
import { ModalProvider } from "@/components/modal-provider";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PhDBot",
  description: "Personalized PhD-Level AI-Agents",
  icons: {
    icon: '/PhDBot_Icon.png',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body className={inter.className}>
        <ModalProvider/>
        {children}</body>
    </html>
    </ClerkProvider>
  );
}
