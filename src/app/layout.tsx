import type { Metadata } from "next";
import { AppNav } from "@/components/AppNav";
import "./globals.css";

export const metadata: Metadata = {
  title: "Travel App",
  description: "Plan trips, track duration, and manage itineraries.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col text-foreground">
        <AppNav />
        {children}
      </body>
    </html>
  );
}
