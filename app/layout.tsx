import type { Metadata } from "next";
import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Temper Labs — Security Testing for AI Agents and LLM Prompts",
  description:
    "Test your AI agents and system prompts against adversarial attacks. Find vulnerabilities before attackers do. Supports OpenAI, Anthropic, and Mistral.",
  keywords: [
    "AI security",
    "prompt injection",
    "AI agent testing",
    "LLM security",
    "red teaming",
  ],
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://temperlabs.dev",
    siteName: "Temper Labs",
    title: "Temper Labs — Is your AI agent secure?",
    description:
      "Test your AI agents for security vulnerabilities. Free, instant results.",
    images: [
      {
        url: "https://temperlabs.dev/og",
        width: 1200,
        height: 630,
        alt: "Temper Labs - Security testing for AI agents",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Temper Labs — Is your AI agent secure?",
    description:
      "Test your AI agents for security vulnerabilities. Free, instant results.",
    images: ["https://temperlabs.dev/og"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${instrumentSerif.variable} ${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
