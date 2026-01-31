import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const lineSeed = localFont({
  src: [
    {
      path: "../../public/fonts/LINE_Seed_Sans_V1.003/Web/WOFF2/LINESeedSans_W_Th.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../public/fonts/LINE_Seed_Sans_V1.003/Web/WOFF2/LINESeedSans_W_Rg.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/LINE_Seed_Sans_V1.003/Web/WOFF2/LINESeedSans_W_Bd.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/LINE_Seed_Sans_V1.003/Web/WOFF2/LINESeedSans_W_XBd.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "../../public/fonts/LINE_Seed_Sans_V1.003/Web/WOFF2/LINESeedSans_W_He.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-line-seed",
});

export const metadata: Metadata = {
  title: "Lnky",
  description: "Create your personalized link-in-bio page in seconds",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${lineSeed.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
