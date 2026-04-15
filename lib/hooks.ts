"use client";

import { useState, useCallback, useEffect, useSyncExternalStore } from "react";
import { AnalysisRequest, AnalysisResult, Locale } from "./types";

const localeListeners = new Set<() => void>();
const themeListeners = new Set<() => void>();

function getStoredLocale(): Locale {
  if (typeof window === "undefined") {
    return "en";
  }

  try {
    const stored = localStorage.getItem("cv-optimizer-locale");
    if (stored === "en" || stored === "de") {
      return stored;
    }
  } catch {
    // localStorage not available
  }

  return "en";
}

function subscribeLocale(onStoreChange: () => void) {
  localeListeners.add(onStoreChange);

  const handleStorage = (event: StorageEvent) => {
    if (event.key === "cv-optimizer-locale") {
      onStoreChange();
    }
  };

  window.addEventListener("storage", handleStorage);

  return () => {
    localeListeners.delete(onStoreChange);
    window.removeEventListener("storage", handleStorage);
  };
}

function notifyLocaleListeners() {
  localeListeners.forEach((listener) => listener());
}

function getStoredTheme(): "light" | "dark" {
  if (typeof window === "undefined") {
    return "light";
  }

  try {
    const stored = localStorage.getItem("cv-optimizer-theme");
    if (stored === "light" || stored === "dark") {
      return stored;
    }

    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
  } catch {
    // localStorage not available
  }

  return "light";
}

function subscribeTheme(onStoreChange: () => void) {
  themeListeners.add(onStoreChange);

  const handleStorage = (event: StorageEvent) => {
    if (event.key === "cv-optimizer-theme") {
      onStoreChange();
    }
  };

  window.addEventListener("storage", handleStorage);

  return () => {
    themeListeners.delete(onStoreChange);
    window.removeEventListener("storage", handleStorage);
  };
}

function notifyThemeListeners() {
  themeListeners.forEach((listener) => listener());
}

/**
 * Hook for managing locale state with localStorage persistence.
 * Uses initializer function to avoid setState in effect body.
 */
export function useLocale(): [Locale, (locale: Locale) => void] {
  const locale = useSyncExternalStore<Locale>(
    subscribeLocale,
    getStoredLocale,
    () => "en",
  );

  const setLocale = useCallback((newLocale: Locale) => {
    try {
      localStorage.setItem("cv-optimizer-locale", newLocale);
    } catch {
      // localStorage not available
    }
    notifyLocaleListeners();
  }, []);

  return [locale, setLocale];
}

/**
 * Hook for managing theme state with localStorage persistence.
 * Uses initializer function to avoid setState in effect body.
 */
export function useTheme(): [string, (theme: "light" | "dark") => void] {
  const theme = useSyncExternalStore(
    subscribeTheme,
    getStoredTheme,
    () => "light",
  );

  // Apply theme to DOM when it changes
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  const setTheme = useCallback((newTheme: "light" | "dark") => {
    try {
      localStorage.setItem("cv-optimizer-theme", newTheme);
    } catch {
      // localStorage not available
    }
    notifyThemeListeners();
  }, []);

  return [theme, setTheme];
}

export interface UseAnalysisState {
  cv: string;
  jobDescription: string;
  result: AnalysisResult | null;
  loading: boolean;
  error: string | null;
  provider: "claude" | "openai" | "heuristic";
}

/**
 * Hook for managing CV analysis state and API calls.
 */
export function useAnalysis(locale: Locale) {
  const [state, setState] = useState<UseAnalysisState>({
    cv: "",
    jobDescription: "",
    result: null,
    loading: false,
    error: null,
    provider: "claude",
  });

  const analyze = useCallback(
    async (
      cv: string,
      jobDescription: string,
      selectedProvider: "claude" | "openai" = "claude",
    ) => {
      // Validate input
      if (!cv.trim() || !jobDescription.trim()) {
        setState((prev) => ({
          ...prev,
          error: "Please provide both CV and job description",
        }));
        return;
      }

      setState((prev) => ({
        ...prev,
        cv,
        jobDescription,
        loading: true,
        error: null,
      }));

      try {
        const request: AnalysisRequest = {
          cv: cv.trim(),
          jobDescription: jobDescription.trim(),
          locale,
          provider: selectedProvider,
        };

        const endpoint =
          selectedProvider === "claude"
            ? "/api/analyze/claude"
            : "/api/analyze/openai";
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(request),
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error.message || "Analysis failed");
        }

        setState((prev) => ({
          ...prev,
          result: data.data,
          loading: false,
          provider: data.provider,
        }));
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setState((prev) => ({
          ...prev,
          error: message,
          loading: false,
        }));
      }
    },
    [locale],
  );

  const reset = useCallback(() => {
    setState({
      cv: "",
      jobDescription: "",
      result: null,
      loading: false,
      error: null,
      provider: "claude",
    });
  }, []);

  const setCV = useCallback((cv: string) => {
    setState((prev) => ({ ...prev, cv }));
  }, []);

  const setJobDescription = useCallback((jobDescription: string) => {
    setState((prev) => ({ ...prev, jobDescription }));
  }, []);

  return {
    ...state,
    analyze,
    reset,
    setCV,
    setJobDescription,
  };
}
