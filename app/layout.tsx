import type { Metadata } from "next";
import { Instrument_Serif, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-serif",
  display: "swap",
});

const dmSans = DM_Sans({
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
  title: "TemperLLM — Red Team Your LLM in 30 Seconds",
  description:
    "Test your system prompt against 20 adversarial attacks. Find vulnerabilities before hackers do. Supports OpenAI, Anthropic, and Mistral.",
  openGraph: {
    title: "TemperLLM — Break Your AI Before Hackers Do",
    description:
      "Red team your LLM system prompts with 20 adversarial attacks across 6 categories.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TemperLLM — Red Team Your LLM",
    description:
      "Test your system prompt against 20 adversarial attacks. Find vulnerabilities before hackers do.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${instrumentSerif.variable} ${dmSans.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
