import type { Metadata } from "next";
import { Roboto, Vazirmatn } from "next/font/google";
import "./globals.scss";

const RobotoFont = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ["latin"],
});
const VazirmatnFont = Vazirmatn({
  subsets: ["arabic"],
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
    <html lang="en" data-theme="light">
      <body
        className={`${RobotoFont.className} ${VazirmatnFont.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
