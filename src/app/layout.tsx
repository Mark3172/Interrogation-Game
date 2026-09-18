import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Interrogation Room | AI Detective Game",
  description: "Interrogate an AI suspect to solve a locked-room mystery. A browser-based detective game powered by Google Gemini.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#07070d] text-[#e0e0e0] antialiased">
        <div className="scanline-overlay" />
        {children}
      </body>
    </html>
  );
}
