/**
 * Claude AI analyzer API route handler.
 * POST /api/analyze/claude
 *
 * Accepts: { cv: string, jobDescription: string, locale: 'en' | 'de' }
 * Returns: AnalysisResult
 */

import { analyzeWithClaude } from "@/lib/ai/clients";
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
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("[/api/analyze/claude] Error:", errorMessage);
    return Response.json(
      {
        error: {
          message: `Claude analysis failed: ${errorMessage}`,
          code: "CLAUDE_ERROR",
        },
        timestamp: Date.now(),
      } as ApiResponse<null>,
      { status: 502 },
    );
  }
}
