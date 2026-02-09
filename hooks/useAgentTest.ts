"use client";

import { useReducer, useCallback } from "react";
import { ProviderName } from "@/lib/providers";
import { Verdict } from "@/lib/types";
import { AgentCapability } from "@/lib/agent-attacks";

export interface AgentAttackResult {
  index: number;
  id: number;
  name: string;
  category: string;
  verdict: Verdict;
  reason: string;
  response: string;
  error?: boolean;
}

interface AgentTestState {
  status: "idle" | "running" | "complete" | "error";
  results: AgentAttackResult[];
  progress: number;
  error: string | null;
  expandedResults: Set<number>;
}

type AgentTestAction =
  | { type: "START" }
  | { type: "ADD_RESULT"; result: AgentAttackResult }
  | { type: "COMPLETE" }
  | { type: "ERROR"; error: string }
  | { type: "TOGGLE_RESULT"; index: number }
  | { type: "EXPAND_ALL" }
  | { type: "COLLAPSE_ALL" }
  | { type: "RESET" };

function agentTestReducer(
  state: AgentTestState,
  action: AgentTestAction
): AgentTestState {
  switch (action.type) {
    case "START":
      return {
        status: "running",
        results: [],
        progress: 0,
        error: null,
        expandedResults: new Set(),
      };
    case "ADD_RESULT":
      return {
        ...state,
        results: [...state.results, action.result],
        progress: state.results.length + 1,
      };
    case "COMPLETE":
      return { ...state, status: "complete" };
    case "ERROR":
      return { ...state, status: "error", error: action.error };
    case "TOGGLE_RESULT": {
      const next = new Set(state.expandedResults);
      if (next.has(action.index)) {
        next.delete(action.index);
      } else {
        next.add(action.index);
      }
      return { ...state, expandedResults: next };
    }
    case "EXPAND_ALL":
      return {
        ...state,
        expandedResults: new Set(state.results.map((_, i) => i)),
      };
    case "COLLAPSE_ALL":
      return { ...state, expandedResults: new Set() };
    case "RESET":
      return {
        status: "idle",
        results: [],
        progress: 0,
        error: null,
        expandedResults: new Set(),
      };
    default:
      return state;
  }
}

const initialState: AgentTestState = {
  status: "idle",
  results: [],
  progress: 0,
  error: null,
  expandedResults: new Set(),
};

export interface AgentTestConfig {
  provider: ProviderName;
  model: string;
  apiKey: string;
  capabilities: AgentCapability[];
  systemPrompt?: string;
}

export function useAgentTest() {
  const [state, dispatch] = useReducer(agentTestReducer, initialState);

  const runTest = useCallback(async (config: AgentTestConfig) => {
    dispatch({ type: "START" });

    try {
      const response = await fetch("/api/test-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        const text = await response.text();
        let errorMsg = "Test failed";
        try {
          errorMsg = JSON.parse(text).error || errorMsg;
        } catch {
          errorMsg = text || errorMsg;
        }
        dispatch({ type: "ERROR", error: errorMsg });
        return;
      }

      const reader = response.body?.getReader();
      if (!reader) {
        dispatch({ type: "ERROR", error: "Failed to read response stream" });
        return;
      }

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;

          try {
            const data = JSON.parse(trimmed);
            if (data.done) {
              dispatch({ type: "COMPLETE" });
            } else if (data.error && !data.name) {
              dispatch({
                type: "ERROR",
                error: data.message || "Unknown error",
              });
            } else {
              dispatch({
                type: "ADD_RESULT",
                result: data as AgentAttackResult,
              });
            }
          } catch {
            // Skip unparseable lines
          }
        }
      }

      if (buffer.trim()) {
        try {
          const data = JSON.parse(buffer.trim());
          if (data.done) {
            dispatch({ type: "COMPLETE" });
          }
        } catch {
          // Skip
        }
      }
    } catch (err) {
      dispatch({
        type: "ERROR",
        error: err instanceof Error ? err.message : "Network error",
      });
    }
  }, []);

  const toggleResult = useCallback((index: number) => {
    dispatch({ type: "TOGGLE_RESULT", index });
  }, []);

  const expandAll = useCallback(() => {
    dispatch({ type: "EXPAND_ALL" });
  }, []);

  const collapseAll = useCallback(() => {
    dispatch({ type: "COLLAPSE_ALL" });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  return {
    ...state,
    runTest,
    toggleResult,
    expandAll,
    collapseAll,
    reset,
  };
}
