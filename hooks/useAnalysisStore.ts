import { create } from 'zustand';

interface AnalysisResult {
  classification: string;
  assessment: string;
  legal_obligations: string[];
}

interface AnalysisStore {
  isLoading: boolean;
  result: AnalysisResult | null;
  error: string | null;
  setLoading: (loading: boolean) => void;
  setResult: (result: AnalysisResult) => void;
  setError: (error: string) => void;
  reset: () => void;
}

export const useAnalysisStore = create<AnalysisStore>((set) => ({
  isLoading: false,
  result: null,
  error: null,
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  setResult: (result: AnalysisResult) => set({ result, isLoading: false, error: null }),
  setError: (error: string) => set({ error, isLoading: false }),
  reset: () => set({ isLoading: false, result: null, error: null }),
})); 