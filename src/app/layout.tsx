import { ThemeProvider } from "@vc/components/theme-provider";
import "@vc/styles/globals.css";
import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { Toaster } from "sonner";

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
            {children}
            <Toaster richColors closeButton />
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
