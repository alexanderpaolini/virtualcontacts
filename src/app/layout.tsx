import "@vc/styles/globals.css";

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
    <html
      lang="en"
      className={`min-h-screen ${geist.variable} bg-gradient-to-b from-[#2e026d] to-[#15162c]`}
    >
      <body>{children}</body>
    </html>
  );
}
