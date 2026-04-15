/**
 * English heuristic CV analyzer.
 * Ported from cv-optimizer-nextjs/lib/cv-analysis.js
 * Uses config-driven rules and shared utilities.
 */

import { AnalysisRequest, AnalysisResult } from "../types";
import { getConfig } from "../config";
import {
  normalize,
  titleCase,
  sectionPresent,
  hasQuantifiedImpact,
  scoreActionLanguage,
  extractKeywords,
  countMatches,
  detectAtsRisks,
  buildOptimizedCvEn,
} from "./shared";

export function analyzeHeuristicEn(req: AnalysisRequest): AnalysisResult {
  const startTime = Date.now();
  const { cv, jobDescription } = req;
  const config = getConfig("en");

  // Extract and match keywords
  const keywords = extractKeywords(jobDescription, config);
  const { matched, missing } = countMatches(cv, keywords, config);
  const keywordCoverage = keywords.length
    ? Math.round((matched.length / keywords.length) * 100)
    : 0;

  // Detect ATS formatting risks
  const flaws: string[] = [];
  const atsRisks = detectAtsRisks(cv, config.astriskRiskPatterns);
  flaws.push(...atsRisks);

  // Check for required sections
  if (!sectionPresent(cv, config.sectionAliases.summary || [])) {
    flaws.push(
      "No clear summary or profile section detected near the top of the CV.",
    );
  }
  if (!sectionPresent(cv, config.sectionAliases.experience || [])) {
    flaws.push(
      "No obvious experience section detected. Use a standard Experience heading.",
    );
  }
  if (!sectionPresent(cv, config.sectionAliases.skills || [])) {
    flaws.push(
      "No dedicated skills section detected. ATS systems rely on explicit skills sections.",
    );
  }
  if (!sectionPresent(cv, config.sectionAliases.education || [])) {
    flaws.push("No education section detected. Include it even if brief.");
  }

  // Check for quantified impact
  if (cv.length < 1200) {
    flaws.push(
      "The CV looks short for senior-level hiring. Add more evidence, scope, and outcomes.",
    );
  }
  if (!hasQuantifiedImpact(cv, config.quantifierPattern)) {
    flaws.push(
      "Few measurable achievements detected. Senior CVs perform better with numbers, percentages, or scope.",
    );
  }

  // Check for action language
  const actionCount = scoreActionLanguage(cv, config.strongVerbs);
  if (actionCount < 5) {
    flaws.push(
      "Action language is weak. Start bullets with strong verbs such as led, built, improved, or delivered.",
    );
  }

  // Check for missing priority keywords
  if (missing.slice(0, 6).length > 0) {
    flaws.push(
      `Priority role terms are missing or underused: ${missing.slice(0, 6).join(", ")}.`,
    );
  }

  // Calculate recruiter clarity score
  let recruiterClarity = 45;
  if (sectionPresent(cv, config.sectionAliases.summary || []))
    recruiterClarity += 10;
  if (sectionPresent(cv, config.sectionAliases.experience || []))
    recruiterClarity += 10;
  if (sectionPresent(cv, config.sectionAliases.skills || []))
    recruiterClarity += 8;
  if (hasQuantifiedImpact(cv, config.quantifierPattern)) recruiterClarity += 12;
  recruiterClarity += Math.min(actionCount * 2, 15);
  recruiterClarity = Math.min(100, recruiterClarity);

  // Calculate format safety score
  let formatSafety = 100;
  for (const risk of atsRisks) {
    formatSafety -= 8;
  }
  if (cv.length > 9000) formatSafety -= 8;
  formatSafety = Math.max(40, Math.min(100, formatSafety));

  // Calculate final ATS score using weights from config
  const weights = config.scoringWeights;
  const atsScore = Math.round(
    keywordCoverage * weights.keyword +
      recruiterClarity * weights.clarity +
      formatSafety * weights.format,
  );

  // Generate improvement suggestions
  const improvements = [
    "Mirror the exact target job title or the closest accurate variant in the headline and summary.",
    "Move the most relevant tools, domain keywords, and qualifications into the top third of the CV.",
    "Rewrite recent bullet points to show outcome, scope, and business impact, not only responsibilities.",
    "Use standard section headers and a clean single-column layout for ATS-safe parsing.",
    "Repeat critical keywords naturally across summary, skills, and recent experience instead of keyword stuffing.",
  ];

  if (!hasQuantifiedImpact(cv, config.quantifierPattern)) {
    improvements.unshift(
      "Add quantified results to at least 4 to 6 bullets, using percentages, revenue, volume, time saved, or team size.",
    );
  }

  // Generate structured suggestions
  const structuredSuggestions = [
    "Summary: Align to the role, industry, and seniority in 3 to 4 lines.",
    `Skills: Add or strengthen these terms where truthful: ${missing.slice(0, 8).join(", ") || "Most priority terms already appear."}`,
    "Experience: Prioritize recent achievements that directly reflect the target responsibilities.",
    "Formatting: Avoid text boxes, heavy graphics, complex columns, and decorative icons.",
    "Tailoring: Create a version of the CV for each role instead of sending one generic document.",
  ];

  // Build optimized CV
  const optimizedCv = buildOptimizedCvEn(cv, jobDescription, keywords, missing);

  // Determine final result
  const finalFlaws = flaws.length
    ? flaws
    : [
        "No major structural flaws detected. Fine-tune wording and proofread carefully.",
      ];

  return {
    scores: {
      atsScore,
      keywordCoverage,
      recruiterClarity,
      formatSafety,
    },
    keywords: {
      extracted: keywords,
      matched,
      missing,
    },
    flaws: finalFlaws,
    improvements,
    structuredSuggestions,
    optimizedCv,
    status: `Analysis complete. Estimated ATS fit: ${atsScore}% with ${missing.length} keyword gaps detected.`,
    metadata: {
      analysisTimeMs: Date.now() - startTime,
      provider: "heuristic",
    },
  };
}
