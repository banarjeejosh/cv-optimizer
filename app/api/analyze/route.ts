/**
 * Heuristic analyzer API route handler.
 * POST /api/analyze/heuristic
 *
 * Accepts: { cv: string, jobDescription: string, locale: 'en' | 'de' }
 * Returns: AnalysisResult
 */

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

    // Run heuristic analyzer
    const result: AnalysisResult = analyzeHeuristic({
      cv: body.cv,
      jobDescription: body.jobDescription,
      locale: body.locale,
      provider: "heuristic",
    });

    return Response.json(
      {
        data: result,
        timestamp: Date.now(),
      } as ApiResponse<AnalysisResult>,
      { status: 200 },
    );
  } catch (error) {
    console.error("[/api/analyze/heuristic] Error:", error);
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
