/**
 * Claude AI analyzer API route handler.
 * POST /api/analyze/claude
 *
 * Accepts: { cv: string, jobDescription: string, locale: 'en' | 'de' }
 * Returns: AnalysisResult
 * Falls back to heuristic analyzer on error.
 */

import { analyzeWithClaude } from "@/lib/ai/clients";
import { analyzeHeuristic } from "@/lib/analyzers";
import { AnalysisRequest, AnalysisResult, ApiResponse } from "@/lib/types";

export async function POST(request: Request): Promise<Response> {
  try {
    const body = (await request.json()) as AnalysisRequest;

    // Validate input
    if (!body.cv || !body.jobDescription) {
      return Response.json(
        {
          error: { message: "Missing required fields: cv and jobDescription" },
          timestamp: Date.now(),
        } as ApiResponse<null>,
        { status: 400 },
      );
    }

    if (!body.locale) {
      return Response.json(
        {
          error: { message: "Missing required field: locale (en or de)" },
          timestamp: Date.now(),
        } as ApiResponse<null>,
        { status: 400 },
      );
    }

    try {
      // Try Claude API
      const result: AnalysisResult = await analyzeWithClaude({
        cv: body.cv,
        jobDescription: body.jobDescription,
        locale: body.locale,
        provider: "claude",
      });

      return Response.json(
        {
          data: result,
          timestamp: Date.now(),
        } as ApiResponse<AnalysisResult>,
        { status: 200 },
      );
    } catch (claudeError: unknown) {
      // Log Claude error and fall back to heuristic
      const errorMessage =
        claudeError instanceof Error ? claudeError.message : "Unknown error";
      console.error(
        "[/api/analyze/claude] Claude error, falling back to heuristic:",
        errorMessage,
      );

      // Use heuristic analyzer as fallback
      const fallbackResult = analyzeHeuristic({
        cv: body.cv,
        jobDescription: body.jobDescription,
        locale: body.locale,
        provider: "heuristic",
      });

      // Mark result as fallback in status
      const fallbackResponse: AnalysisResult = {
        ...fallbackResult,
        status: `[Fallback] ${fallbackResult.status}`,
        metadata: {
          analysisTimeMs: fallbackResult.metadata?.analysisTimeMs ?? 0,
          provider: "heuristic",
          model: undefined,
          fallbackReason: errorMessage,
        },
      };

      return Response.json(
        {
          data: fallbackResponse,
          timestamp: Date.now(),
        } as ApiResponse<AnalysisResult>,
        { status: 200 }, // Return 200 even though we fell back
      );
    }
  } catch (error) {
    console.error("[/api/analyze/claude] Unexpected error:", error);
    return Response.json(
      {
        error: {
          message: "Internal server error during analysis",
          code: "ANALYSIS_ERROR",
        },
        timestamp: Date.now(),
      } as ApiResponse<null>,
      { status: 500 },
    );
  }
}
