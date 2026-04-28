/**
 * Unified type system for the bilingual CV optimizer.
 * Used across analyzers (heuristic, Claude, OpenAI) and UI components.
 */

export type Locale = "en" | "de";

export type AIProvider = "claude" | "openai" | "heuristic";

/**
 * Request shape for CV analysis.
 * Submitted from client → API route handler → analyzer function.
 */
export interface AnalysisRequest {
  cv: string;
  jobDescription: string;
  locale: Locale;
  provider?: AIProvider; // If not specified, uses env var AI_PROVIDER
}

/**
 * Unified result shape returned by any analyzer (heuristic, Claude, OpenAI).
 * Ensures consistent data structure regardless of analyzer used.
 */
export interface AnalysisResult {
  scores: {
    atsScore: number; // 0-100: Combined ATS fit score
    keywordCoverage: number; // 0-100: % of important keywords matched
    recruiterClarity: number; // 0-100: Clarity and structure score
    formatSafety: number; // 0-100: ATS-safe formatting score
  };
  keywords: {
    extracted: string[]; // All keywords extracted from job description
    matched: string[]; // Keywords that appear in CV
    missing: string[]; // Keywords that don't appear in CV
  };
  flaws: string[]; // Detected issues with CV (structure, formatting, language)
  improvements: string[]; // Prioritized suggestions for improvement
  structuredSuggestions: string[]; // Detailed, actionable recommendations
  optimizedCv: string; // Generated rewritten/restructured CV draft
  status: string; // User-facing status message (success, error, etc.)
  metadata?: {
    analysisTimeMs: number; // How long analysis took
    provider: AIProvider; // Which analyzer was used
    model?: string; // AI model name if applicable (e.g., "claude-3-sonnet-20240229")
    fallbackReason?: string; // Why fallback was used, if applicable
  };
}

/**
 * Form input validation schema shape.
 */
export interface AnalysisFormInput {
  cv: string;
  jobDescription: string;
}

/**
 * API response wrapper for consistency.
 */
export interface ApiResponse<T> {
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
  timestamp: number;
}
