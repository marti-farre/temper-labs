"use client";

import { useState, useEffect, useRef } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useTest } from "@/hooks/useTest";
import { ProviderName, getProvider } from "@/lib/providers";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import SocialProof from "@/components/sections/SocialProof";
import HowItWorks from "@/components/sections/HowItWorks";
import AttackCategories from "@/components/sections/AttackCategories";
import ApiConfig from "@/components/sections/ApiConfig";
import TestForm from "@/components/sections/TestForm";
import Results from "@/components/sections/Results";
import FAQ from "@/components/sections/FAQ";
import FinalCTA from "@/components/sections/FinalCTA";

export default function Home() {
  const [provider, setProvider] = useLocalStorage<ProviderName>(
    "temperllm-provider",
    "openai"
  );
  const [model, setModel] = useLocalStorage<string>(
    "temperllm-model",
    "gpt-4o"
  );
  const [apiKey, setApiKey] = useLocalStorage<string>(
    "temperllm-api-key",
    ""
  );
  const [systemPrompt, setSystemPrompt] = useState("");
  const test = useTest();
  const hasScrolledToResults = useRef(false);

  const handleProviderChange = (p: ProviderName) => {
    setProvider(p);
    const firstModel = getProvider(p).models[0];
    if (firstModel) setModel(firstModel.id);
  };

  const handleRunTest = () => {
    hasScrolledToResults.current = false;
    test.runTest({ provider, model, apiKey, systemPrompt });
  };

  // Auto-scroll to results when first result arrives
  useEffect(() => {
    if (
      test.status === "running" &&
      test.results.length === 1 &&
      !hasScrolledToResults.current
    ) {
      hasScrolledToResults.current = true;
      setTimeout(() => {
        document
          .querySelector("#results")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    }
  }, [test.status, test.results.length]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <SocialProof />
        <HowItWorks />
        <AttackCategories />
        <ApiConfig
          provider={provider}
          onProviderChange={handleProviderChange}
          model={model}
          onModelChange={setModel}
          apiKey={apiKey}
          onApiKeyChange={setApiKey}
          disabled={test.status === "running"}
        />
        <TestForm
          systemPrompt={systemPrompt}
          onSystemPromptChange={setSystemPrompt}
          onSubmit={handleRunTest}
          disabled={!apiKey.trim() || !systemPrompt.trim()}
          isRunning={test.status === "running"}
        />
        <Results
          status={test.status}
          results={test.results}
          progress={test.progress}
          error={test.error}
          expandedResults={test.expandedResults}
          onToggleResult={test.toggleResult}
          onExpandAll={test.expandAll}
          onCollapseAll={test.collapseAll}
          onReset={test.reset}
        />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
