/**
 * Unified AI client factory for Claude and OpenAI.
 * Routes requests to the appropriate API and handles responses.
 */

import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { AnalysisRequest, AnalysisResult, AIProvider } from "../types";
import { getAnalysisPrompts } from "./prompts";
import { parseClaudeResponse, parseOpenAiResponse } from "./parsers";

/**
 * Analyze CV using Claude API.
 */
export async function analyzeWithClaude(
  req: AnalysisRequest,
): Promise<AnalysisResult> {
  const startTime = Date.now();
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY environment variable not set");
  }

  const client = new Anthropic({ apiKey });
  const prompts = getAnalysisPrompts(req.locale);
  const userPrompt = prompts.getUserPrompt(req.cv, req.jobDescription);

  try {
    const message = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 6000,
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
      system: prompts.system,
    });

    // Extract text from response
    const responseText = message.content
      .filter((block) => block.type === "text")
      .map((block) => ("text" in block ? block.text : ""))
      .join("\n");

    // Parse and validate response
    const result = parseClaudeResponse(responseText, startTime);

    return result;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[analyzeWithClaude] Error:", message);
    throw new Error(`Claude API call failed: ${message}`);
  }
}

/**
 * Analyze CV using OpenAI API.
 */
export async function analyzeWithOpenAi(
  req: AnalysisRequest,
): Promise<AnalysisResult> {
  const startTime = Date.now();
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY environment variable not set");
  }

  const client = new OpenAI({ apiKey });
  const prompts = getAnalysisPrompts(req.locale);
  const userPrompt = prompts.getUserPrompt(req.cv, req.jobDescription);

  try {
    const message = await client.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: prompts.system,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 4096,
    });

    // Extract text from response
    const responseText = message.choices[0].message.content || "";

    // Parse and validate response
    const result = parseOpenAiResponse(responseText, message.model, startTime);

    return result;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[analyzeWithOpenAi] Error:", message);
    throw new Error(`OpenAI API call failed: ${message}`);
  }
}

/**
 * Unified AI analysis entry point.
 * Routes to Claude or OpenAI based on provider in request or environment variable.
 */
export async function analyzeWithAI(
  req: AnalysisRequest,
): Promise<AnalysisResult> {
  const provider = (req.provider ||
    (process.env.AI_PROVIDER as string | undefined) ||
    "claude") as AIProvider;

  if (provider === "claude") {
    return analyzeWithClaude(req);
  }

  if (provider === "openai") {
    return analyzeWithOpenAi(req);
  }

  throw new Error(`Unknown AI provider: ${provider}`);
}
