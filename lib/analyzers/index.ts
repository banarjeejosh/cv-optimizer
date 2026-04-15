/**
 * Unified heuristic analyzer export.
 * Routes analysis requests to the appropriate language-specific analyzer.
 */

import { AnalysisRequest, AnalysisResult, Locale } from "../types";
import { analyzeHeuristicEn } from "./heuristic-en";
import { analyzeHeuristicDe } from "./heuristic-de";

/**
 * Unified analyzer interface.
 * Routes to EN or DE analyzer based on locale in request.
 */
export function analyzeHeuristic(req: AnalysisRequest): AnalysisResult {
  return req.locale === "en"
    ? analyzeHeuristicEn(req)
    : analyzeHeuristicDe(req);
}

// Export individual analyzers for testing/flexibility
export { analyzeHeuristicEn } from "./heuristic-en";
export { analyzeHeuristicDe } from "./heuristic-de";

// Export shared utilities
export * from "./shared";
