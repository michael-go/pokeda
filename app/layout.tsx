import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "פוקדע",
  description: "פוקדקס צבעוני ומהנה לילדים — גלו פוקימונים, כוחות ומסלולי התפתחות.",
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png", sizes: "64x64" }],
    apple: [{ url: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" }],
  },
  openGraph: {
    title: "פוקדע",
    description: "מגלים פוקימונים, כוחות ומסלולי התפתחות בדרך צבעונית ומהנה.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "פוקדע",
    description: "פוקדקס צבעוני ומהנה לילדים.",
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
