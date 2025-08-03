import { ThemeProvider } from "@vc/components/theme-provider";
import Toaster from "@vc/components/toaster";
import "@vc/styles/globals.css";
import { TRPCReactProvider } from "@vc/trpc/react";
import { type Metadata } from "next";
import { Geist } from "next/font/google";

export const metadata: Metadata = {
  title: "VirtualContacts",
  description:
    "A virtual contacts system that automatically shares contact information.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <html
        lang="en"
        suppressHydrationWarning
        className={`${geist.variable} min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c]`}
      >
        <head />
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TRPCReactProvider>{children}</TRPCReactProvider>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
