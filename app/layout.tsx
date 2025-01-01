import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const RobotoFont = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Twitch Chat App",
  description: "Twitch Chat App overlay to show twitch chats",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${RobotoFont.className} antialiased`}>{children}</body>
    </html>
  );
}
