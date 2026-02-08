"use client";

import { useReducer, useEffect, useRef, useCallback } from "react";
import { reducer, initialState, AttackResult } from "@/lib/reducer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ApiKeyInput from "@/components/ApiKeyInput";
import SecurityExplanation from "@/components/SecurityExplanation";
import TestForm from "@/components/TestForm";
import ScoreDisplay from "@/components/ScoreDisplay";
import Results from "@/components/Results";
import Footer from "@/components/Footer";

const STORAGE_KEY = "temperllm-api-key";

export default function Home() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const resultsRef = useRef<HTMLDivElement>(null);
  const hasScrolled = useRef(false);

  // Load API key from localStorage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem(STORAGE_KEY);
    if (savedKey) {
      dispatch({ type: "SET_API_KEY", payload: savedKey });
      dispatch({ type: "SET_REMEMBER_KEY", payload: true });
    }
  }, []);

  // Persist API key to localStorage
  useEffect(() => {
    if (state.rememberKey && state.apiKey) {
      localStorage.setItem(STORAGE_KEY, state.apiKey);
    } else if (!state.rememberKey) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [state.rememberKey, state.apiKey]);

  // Auto-scroll to results when first result arrives
  useEffect(() => {
    if (state.results.length === 1 && !hasScrolled.current) {
      hasScrolled.current = true;
      resultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [state.results.length]);

  const handleRunTest = useCallback(async () => {
    dispatch({ type: "START_TEST" });
    hasScrolled.current = false;

    try {
      const response = await fetch("/api/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey: state.apiKey,
          systemPrompt: state.systemPrompt,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const message =
          errorData?.error ||
          (response.status === 429
            ? "Too many tests. Please wait 60 seconds."
            : `Request failed (${response.status})`);
        dispatch({ type: "TEST_ERROR", payload: message });
        return;
      }

      if (!response.body) {
        dispatch({
          type: "TEST_ERROR",
          payload: "No response body received",
        });
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const data = JSON.parse(line);
            if (data.done) {
              dispatch({ type: "TEST_COMPLETE" });
            } else {
              const result: AttackResult = {
                index: data.index,
                id: data.id,
                name: data.name,
                category: data.category,
                description: data.description,
                passed: data.passed,
                reason: data.reason,
                response: data.response,
                error: data.error,
              };
              dispatch({ type: "ADD_RESULT", payload: result });
            }
          } catch {
            // Skip malformed lines
          }
        }
      }

      // Handle any remaining buffer
      if (buffer.trim()) {
        try {
          const data = JSON.parse(buffer);
          if (data.done) {
            dispatch({ type: "TEST_COMPLETE" });
          }
        } catch {
          // Ignore
        }
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Network error. Please check your connection.";
      dispatch({ type: "TEST_ERROR", payload: message });
    }
  }, [state.apiKey, state.systemPrompt]);

  const score = state.results.filter((r) => r.passed).length;
  const isDisabled = !state.apiKey.trim() || !state.systemPrompt.trim();
  const isRunning = state.status === "running";

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <div className="max-w-content mx-auto px-4 space-y-8 pb-16">
          <ApiKeyInput
            apiKey={state.apiKey}
            rememberKey={state.rememberKey}
            onApiKeyChange={(key) =>
              dispatch({ type: "SET_API_KEY", payload: key })
            }
            onRememberChange={(remember) =>
              dispatch({ type: "SET_REMEMBER_KEY", payload: remember })
            }
            disabled={isRunning}
          />
          <SecurityExplanation />
          <TestForm
            systemPrompt={state.systemPrompt}
            onSystemPromptChange={(prompt) =>
              dispatch({ type: "SET_SYSTEM_PROMPT", payload: prompt })
            }
            onSubmit={handleRunTest}
            disabled={isDisabled}
            isRunning={isRunning}
          />

          {state.error && (
            <div className="bg-surface border border-fail/30 rounded-md p-4 text-sm text-fail">
              {state.error}
            </div>
          )}

          <div ref={resultsRef}>
            <ScoreDisplay
              score={score}
              total={15}
              progress={state.progress}
              status={state.status}
            />
          </div>

          <Results
            results={state.results}
            expandedResults={state.expandedResults}
            onToggleResult={(i) =>
              dispatch({ type: "TOGGLE_RESULT", payload: i })
            }
            onExpandAll={() => dispatch({ type: "EXPAND_ALL" })}
            onCollapseAll={() => dispatch({ type: "COLLAPSE_ALL" })}
            status={state.status}
            score={score}
            total={15}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
