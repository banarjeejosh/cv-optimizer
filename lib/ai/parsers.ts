/**
 * Parse AI responses into AnalysisResult format.
 * Handles JSON extraction, validation, and error cases.
 */

import { AnalysisResult, AIProvider } from "../types";

/**
 * Extract JSON from AI response (Claude/OpenAI may include markdown or text).
 * Tries to find a JSON block in the response text.
 */
function extractJsonFromResponse(text: string): string {
  // Try to find JSON block in ```json ... ``` format
  const jsonBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (jsonBlockMatch && jsonBlockMatch[1]) {
    return jsonBlockMatch[1].trim();
  }

  // Try to find bare JSON (object or array)
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return jsonMatch[0];
  }

  throw new Error("No JSON found in AI response");
}

/**
 * Validate and coerce AI response to AnalysisResult shape.
 * Lenient validation—fill in defaults for missing fields.
 */
function validateAnalysisResult(data: Record<string, unknown>): AnalysisResult {
  // Ensure scores object with defaults
  const scores = (data.scores as Record<string, unknown>) || {};

  // Ensure keywords object
  const keywords = (data.keywords as Record<string, unknown>) || {};

  // Return typed result with defaults
  return {
    scores: {
      atsScore:
        typeof scores.atsScore === "number"
          ? Math.min(100, Math.max(0, scores.atsScore))
          : 50,
      keywordCoverage:
        typeof scores.keywordCoverage === "number"
          ? Math.min(100, Math.max(0, scores.keywordCoverage))
          : 50,
      recruiterClarity:
        typeof scores.recruiterClarity === "number"
          ? Math.min(100, Math.max(0, scores.recruiterClarity))
          : 50,
      formatSafety:
        typeof scores.formatSafety === "number"
          ? Math.min(100, Math.max(0, scores.formatSafety))
          : 50,
    },
    keywords: {
      extracted: Array.isArray(keywords.extracted) ? keywords.extracted : [],
      matched: Array.isArray(keywords.matched) ? keywords.matched : [],
      missing: Array.isArray(keywords.missing) ? keywords.missing : [],
    },
    flaws: Array.isArray(data.flaws) ? data.flaws.slice(0, 10) : [],
    improvements: Array.isArray(data.improvements)
      ? data.improvements.slice(0, 10)
      : [],
    structuredSuggestions: Array.isArray(data.structuredSuggestions)
      ? data.structuredSuggestions.slice(0, 10)
      : [],
    optimizedCv: typeof data.optimizedCv === "string" ? data.optimizedCv : "",
    status: typeof data.status === "string" ? data.status : "Analysis complete",
    metadata: {
      analysisTimeMs:
        typeof (data.metadata as Record<string, unknown>)?.analysisTimeMs ===
        "number"
          ? ((data.metadata as Record<string, unknown>)
              ?.analysisTimeMs as number)
          : 0,
      provider:
        ((data.metadata as Record<string, unknown>)?.provider as
          | AIProvider
          | undefined) || "heuristic",
      model: (data.metadata as Record<string, unknown>)?.model as
        | string
        | undefined,
    },
  };
}

/**
 * Parse Claude response into AnalysisResult.
 * Handles text extraction, JSON parsing, and validation.
 */
export function parseClaudeResponse(
  responseText: string,
  startTime: number,
): AnalysisResult {
  try {
    const jsonStr = extractJsonFromResponse(responseText);
    const parsed = JSON.parse(jsonStr) as Record<string, unknown>;
    const result = validateAnalysisResult(parsed);

    return {
      ...result,
      metadata: {
        ...result.metadata,
        analysisTimeMs: Date.now() - startTime,
        provider: "claude",
      },
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[parseClaudeResponse] Parse error:", message);
    throw new Error(`Failed to parse Claude response: ${message}`);
  }
}

/**
 * Parse OpenAI response into AnalysisResult.
 * OpenAI returns message.content as string, similar to Claude.
 */
export function parseOpenAiResponse(
  responseText: string,
  model: string,
  startTime: number,
): AnalysisResult {
  try {
    const jsonStr = extractJsonFromResponse(responseText);
    const parsed = JSON.parse(jsonStr) as Record<string, unknown>;
    const result = validateAnalysisResult(parsed);

    return {
      ...result,
      metadata: {
        ...result.metadata,
        analysisTimeMs: Date.now() - startTime,
        provider: "openai",
        model,
      },
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[parseOpenAiResponse] Parse error:", message);
    throw new Error(`Failed to parse OpenAI response: ${message}`);
  }
}

/**
 * Type guard: check if object looks like AnalysisResult.
 */
export function isAnalysisResult(obj: unknown): obj is AnalysisResult {
  if (!obj || typeof obj !== "object") {
    return false;
  }

  const record = obj as Record<string, unknown>;

  if (
    !record.scores ||
    typeof record.scores !== "object" ||
    !Array.isArray(record.flaws) ||
    !Array.isArray(record.improvements) ||
    typeof record.optimizedCv !== "string"
  ) {
    return false;
  }

  const scores = record.scores as Record<string, unknown>;
  return typeof scores.atsScore === "number";
}
