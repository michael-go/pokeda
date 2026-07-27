import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  const imageUrl = `${protocol}://${host}/og.png`;

  return {
    title: "פוקדה | Pokeda",
    description: "פוקדקס צבעוני ומהנה לילדים — גלו פוקימונים, כוחות ומסלולי התפתחות.",
    openGraph: {
      title: "פוקדה | Pokeda",
      description: "מגלים פוקימונים, כוחות ומסלולי התפתחות — בעברית ובאנגלית.",
      type: "website",
      images: [{ url: imageUrl, width: 1536, height: 909, alt: "Pokeda — Explore, Learn, Evolve" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "פוקדה | Pokeda",
      description: "פוקדקס צבעוני ומהנה לילדים.",
      images: [imageUrl],
    },
  };
}

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
