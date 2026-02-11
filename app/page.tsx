"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useTest } from "@/hooks/useTest";
import { useAgentTest } from "@/hooks/useAgentTest";
import { ProviderName, getProvider } from "@/lib/providers";
import {
  AgentCapability,
  getAttacksForCapabilities,
  getAgentCategoryStats,
  agentAttacks,
} from "@/lib/agent-attacks";
import { getAgentRecommendations } from "@/lib/agent-recommendations";
import { ModelMode } from "@/components/ui/ModelSelector";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroTest from "@/components/sections/HeroTest";
import HeroAgent from "@/components/sections/HeroAgent";
import Results from "@/components/sections/Results";
import AttackCategories from "@/components/sections/AttackCategories";
import FAQ from "@/components/sections/FAQ";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

type TabMode = "agent" | "prompt";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabMode>("agent");
  const [statsCount, setStatsCount] = useState<number | null>(null);
  const [modelMode, setModelMode] = useLocalStorage<ModelMode>(
    "temper-model-mode",
    "free"
  );

  const fetchStats = () => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((d) => setStatsCount(d.count ?? 0))
      .catch(() => setStatsCount(0));
  };

  // Fetch stats on mount
  useEffect(() => { fetchStats(); }, []);

  const [provider, setProvider] = useLocalStorage<ProviderName>(
    "temper-provider",
    "openai"
  );
  const [model, setModel] = useLocalStorage<string>("temper-model", "gpt-4o");
  const [apiKey, setApiKey] = useLocalStorage<string>("temper-api-key", "");

  // Prompt tab state
  const [systemPrompt, setSystemPrompt] = useState("");
  const test = useTest();

  // Agent tab state
  const [capabilities, setCapabilities] = useLocalStorage<AgentCapability[]>(
    "temper-capabilities",
    ["email", "calendar", "files"]
  );
  const [agentSystemPrompt, setAgentSystemPrompt] = useState("");
  const agentTest = useAgentTest();

  const hasScrolledToResults = useRef(false);

  const handleProviderChange = (p: ProviderName) => {
    setProvider(p);
    const firstModel = getProvider(p).models[0];
    if (firstModel) setModel(firstModel.id);
  };

  const handleRunTest = () => {
    hasScrolledToResults.current = false;
    test.runTest({
      mode: modelMode,
      provider,
      model,
      apiKey,
      systemPrompt,
    });
  };

  const handleRunAgentTest = () => {
    hasScrolledToResults.current = false;
    agentTest.runTest({
      mode: modelMode,
      provider,
      model,
      apiKey,
      capabilities,
      systemPrompt: agentSystemPrompt || undefined,
    });
  };

  // Disabled logic: free mode only needs capabilities/prompt, BYOK also needs apiKey
  const agentDisabled =
    capabilities.length === 0 ||
    (modelMode === "byok" && !apiKey.trim());

  const promptDisabled =
    !systemPrompt.trim() ||
    (modelMode === "byok" && !apiKey.trim());

  // Agent attack filtering + categories
  const filteredAgentAttacks = useMemo(
    () => getAttacksForCapabilities(capabilities),
    [capabilities]
  );

  const agentCategories = useMemo(
    () => getAgentCategoryStats(filteredAgentAttacks),
    [filteredAgentAttacks]
  );

  // Agent recommendations
  const agentVulnerableCategories = useMemo(() => {
    const cats = new Set(
      agentTest.results
        .filter((r) => r.verdict !== "BLOCKED")
        .map((r) => r.category)
    );
    return Array.from(cats);
  }, [agentTest.results]);

  const agentHasWarnings = useMemo(
    () => agentTest.results.some((r) => r.verdict === "WARNING"),
    [agentTest.results]
  );

  const agentRecommendations = useMemo(
    () =>
      getAgentRecommendations(
        agentVulnerableCategories,
        capabilities,
        agentHasWarnings
      ),
    [agentVulnerableCategories, capabilities, agentHasWarnings]
  );

  // Refetch stats when a test completes
  const agentStatus = agentTest.status;
  const promptStatus = test.status;
  useEffect(() => {
    if (agentStatus === "complete" || promptStatus === "complete") fetchStats();
  }, [agentStatus, promptStatus]);

  // Auto-scroll to results when first result arrives
  const agentResultsLen = agentTest.results.length;
  const promptResultsLen = test.results.length;

  useEffect(() => {
    const currentStatus = activeTab === "agent" ? agentStatus : promptStatus;
    const currentLen = activeTab === "agent" ? agentResultsLen : promptResultsLen;
    if (
      currentStatus === "running" &&
      currentLen === 1 &&
      !hasScrolledToResults.current
    ) {
      hasScrolledToResults.current = true;
      setTimeout(() => {
        document
          .querySelector("#results")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    }
  }, [activeTab, agentStatus, agentResultsLen, promptStatus, promptResultsLen]);

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <Header />
      <main className="flex-1">
        {/* Tab Switcher */}
        <div className="flex justify-center gap-1 pt-20 pb-0 relative z-20">
          <button
            onClick={() => setActiveTab("agent")}
            className={`px-4 py-2 text-sm rounded-full transition-colors ${
              activeTab === "agent"
                ? "bg-accent/10 text-accent font-medium"
                : "text-text-tertiary hover:text-text-secondary"
            }`}
          >
            Test AI Agent
          </button>
          <button
            onClick={() => setActiveTab("prompt")}
            className={`px-4 py-2 text-sm rounded-full transition-colors ${
              activeTab === "prompt"
                ? "bg-accent/10 text-accent font-medium"
                : "text-text-tertiary hover:text-text-secondary"
            }`}
          >
            Test Prompt
          </button>
        </div>

        {/* Hero Section */}
        {activeTab === "agent" ? (
          <HeroAgent
            modelMode={modelMode}
            onModelModeChange={setModelMode}
            provider={provider}
            onProviderChange={handleProviderChange}
            model={model}
            onModelChange={setModel}
            apiKey={apiKey}
            onApiKeyChange={setApiKey}
            capabilities={capabilities}
            onCapabilitiesChange={setCapabilities}
            systemPrompt={agentSystemPrompt}
            onSystemPromptChange={setAgentSystemPrompt}
            onSubmit={handleRunAgentTest}
            disabled={agentDisabled}
            isRunning={agentTest.status === "running"}
            progress={agentTest.progress}
            totalAttacks={filteredAgentAttacks.length}
            statsCount={statsCount}
          />
        ) : (
          <HeroTest
            modelMode={modelMode}
            onModelModeChange={setModelMode}
            provider={provider}
            onProviderChange={handleProviderChange}
            model={model}
            onModelChange={setModel}
            apiKey={apiKey}
            onApiKeyChange={setApiKey}
            systemPrompt={systemPrompt}
            onSystemPromptChange={setSystemPrompt}
            onSubmit={handleRunTest}
            disabled={promptDisabled}
            isRunning={test.status === "running"}
            progress={test.progress}
            statsCount={statsCount}
          />
        )}

        {/* Results Section */}
        {activeTab === "agent" ? (
          <Results
            status={agentTest.status}
            results={agentTest.results}
            progress={agentTest.progress}
            error={agentTest.error}
            expandedResults={agentTest.expandedResults}
            onToggleResult={agentTest.toggleResult}
            onExpandAll={agentTest.expandAll}
            onCollapseAll={agentTest.collapseAll}
            onReset={agentTest.reset}
            totalAttacks={filteredAgentAttacks.length}
            categories={agentCategories}
            attacksData={agentAttacks}
            externalRecommendations={agentRecommendations}
            reportTitle="Temper Labs Agent Security Report"
            recommendationsTitle="Strengthen your agent"
          />
        ) : (
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
        )}

        <AttackCategories
          key={activeTab}
          categories={activeTab === "agent" ? agentCategories : undefined}
        />
        <FAQ />
      </main>
      <Footer />

      {/* Error modal — shown over the screen for API key / pre-flight errors */}
      <Modal
        open={!!(test.error || agentTest.error)}
        onClose={() => {
          test.reset();
          agentTest.reset();
        }}
        title="Test failed"
      >
        <p className="mb-4">{test.error || agentTest.error}</p>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            test.reset();
            agentTest.reset();
          }}
        >
          Try again
        </Button>
      </Modal>
    </div>
  );
}
