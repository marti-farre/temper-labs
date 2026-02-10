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
    "Test your AI agents and system prompts against adversarial attacks. Find vulnerabilities before hackers do. Supports OpenAI, Anthropic, and Mistral.",
  openGraph: {
    title: "Temper Labs — Break Your AI Before Hackers Do",
    description:
      "Security testing for AI agents and LLM prompts with adversarial attacks.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Temper Labs — Security Testing for AI",
    description:
      "Test your AI agents and system prompts against adversarial attacks. Find vulnerabilities before hackers do.",
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
