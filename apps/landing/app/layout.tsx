import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | CollabIQ",
    default: "CollabIQ",
  },
  description: "Collaborative interview platform without sharing screen",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <html lang="en" className="m-0 p-0 box-border">
        <body className={`${inter.className} text-lg`}>
          <main>{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
