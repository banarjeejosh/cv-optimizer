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
 * Per-locale configuration for analysis behavior.
 * Controls language-specific rules, weights, and text processing.
 */
export interface LocaleConfig {
  // Text processing
  stopwords: Set<string>; // Words to ignore in keyword extraction
  phrasePatterns: RegExp[]; // Multi-word phrases to detect (e.g., "project management")

  // CV structure validation
  sectionAliases: Record<string, string[]>; // e.g., { summary: ['summary', 'profile', 'overview'] }
  requiredSections: string[]; // e.g., ['summary', 'experience', 'skills']

  // Language features
  strongVerbs: string[]; // Action verbs common in resumes
  quantifierPattern: RegExp; // Pattern for numbers/metrics indicative of quantified impact
  linkPattern: RegExp; // URLs and links
  astriskRiskPatterns: Array<{ regex: RegExp; message: string }>; // ATS formatting risks

  // Scoring
  scoringWeights: {
    keyword: number; // Weight for keyword coverage (e.g., 0.45)
    clarity: number; // Weight for recruiter clarity (e.g., 0.35)
    format: number; // Weight for format safety (e.g., 0.20)
  };

  // Sample data for demos
  sampleCv: string; // Example CV for "Load Sample" feature
  sampleJob: string; // Example job description for "Load Sample" feature

  // UI labels (for use in components, not in analyzer)
  // These are populated from lib/i18n.ts
  labels: Record<string, string>;
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
