export interface AttackResult {
  index: number;
  id: string;
  name: string;
  category: string;
  description: string;
  passed: boolean;
  reason: string;
  response: string;
  error?: boolean;
}

export interface AppState {
  apiKey: string;
  rememberKey: boolean;
  systemPrompt: string;
  status: "idle" | "running" | "complete" | "error";
  results: AttackResult[];
  progress: number;
  error: string | null;
  expandedResults: Set<number>;
}

export type AppAction =
  | { type: "SET_API_KEY"; payload: string }
  | { type: "SET_REMEMBER_KEY"; payload: boolean }
  | { type: "SET_SYSTEM_PROMPT"; payload: string }
  | { type: "START_TEST" }
  | { type: "ADD_RESULT"; payload: AttackResult }
  | { type: "TEST_COMPLETE" }
  | { type: "TEST_ERROR"; payload: string }
  | { type: "TOGGLE_RESULT"; payload: number }
  | { type: "EXPAND_ALL" }
  | { type: "COLLAPSE_ALL" }
  | { type: "RESET" };

export const initialState: AppState = {
  apiKey: "",
  rememberKey: false,
  systemPrompt: "",
  status: "idle",
  results: [],
  progress: 0,
  error: null,
  expandedResults: new Set(),
};

export function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_API_KEY":
      return { ...state, apiKey: action.payload };
    case "SET_REMEMBER_KEY":
      return { ...state, rememberKey: action.payload };
    case "SET_SYSTEM_PROMPT":
      return { ...state, systemPrompt: action.payload };
    case "START_TEST":
      return {
        ...state,
        status: "running",
        results: [],
        progress: 0,
        error: null,
        expandedResults: new Set(),
      };
    case "ADD_RESULT":
      return {
        ...state,
        results: [...state.results, action.payload],
        progress: state.progress + 1,
      };
    case "TEST_COMPLETE":
      return { ...state, status: "complete" };
    case "TEST_ERROR":
      return { ...state, status: "error", error: action.payload };
    case "TOGGLE_RESULT": {
      const next = new Set(state.expandedResults);
      if (next.has(action.payload)) {
        next.delete(action.payload);
      } else {
        next.add(action.payload);
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
        ...initialState,
        apiKey: state.apiKey,
        rememberKey: state.rememberKey,
      };
    default:
      return state;
  }
}
