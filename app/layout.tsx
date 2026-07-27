import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "פוקדע",
  description: "Friendly Pokedex",
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png", sizes: "64x64" }],
    apple: [{ url: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" }],
  },
  openGraph: {
    title: "פוקדע",
    description: "Friendly Pokedex",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "פוקדע",
    description: "Friendly Pokedex",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he">
      <body>{children}</body>
    </html>
  );
}
