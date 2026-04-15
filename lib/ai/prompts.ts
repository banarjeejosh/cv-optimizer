/**
 * AI Prompt Templates for CV Analysis
 * Language-specific system and user prompts for Claude and OpenAI
 */

import { Locale } from "../types";

export interface AnalysisPrompt {
  system: string;
  user: string;
}

/**
 * English system prompt for CV analysis.
 * Instructs AI to return structured JSON with AnalysisResult shape.
 */
const systemPromptEn = `You are an expert recruiter and ATS (Applicant Tracking System) specialist.
Your task is to analyze a CV against a target job description and provide a detailed assessment.

Analyze the CV for:
1. Keywords from the job description that are present/missing
2. ATS compatibility and formatting risks
3. Structural completeness (summary, experience, skills, education sections)
4. Impact language and quantified achievements
5. Role alignment and clarity for recruiters

Return a JSON object with this exact structure:
{
  "scores": {
    "atsScore": <0-100>,
    "keywordCoverage": <0-100>,
    "recruiterClarity": <0-100>,
    "formatSafety": <0-100>
  },
  "keywords": {
    "extracted": [<list of 15-20 key job requirements>],
    "matched": [<keywords present in CV>],
    "missing": [<important keywords NOT in CV>]
  },
  "flaws": [<list of 3-5 detected structural or content issues>],
  "improvements": [<list of 4-5 prioritized improvement suggestions>],
  "structuredSuggestions": [<list of 4-5 detailed, actionable recommendations>],
  "optimizedCv": "<rewritten CV section optimized for ATS and recruiter clarity>"
}

Scoring guidance:
- ATS Score (45% keyword + 35% clarity + 20% format): How likely is this CV to pass ATS and be reviewed?
- Keyword Coverage: % of job requirements found in CV
- Recruiter Clarity: How clear and well-structured is the CV for human reviewers?
- Format Safety: How ATS-safe is the formatting? (avoid tables, icons, graphics)

Be honest and constructive. Avoid generic advice.`;

/**
 * German system prompt for CV analysis.
 */
const systemPromptDe = `Du bist ein erfahrener Recruiter und ATS-Spezialist (Applicant Tracking System).
Deine Aufgabe ist es, einen Lebenslauf gegen eine Zielstelle zu analysieren und eine detaillierte Bewertung zu liefern.

Analysiere den Lebenslauf auf:
1. Schlüsselbegriffe aus der Stellenanzeige (vorhanden/fehlend)
2. ATS-Kompatibilität und Formatierungsrisiken
3. Strukturelle Vollständigkeit (Kurzprofil, Berufserfahrung, Kenntnisse, Ausbildung)
4. Starke Verben und quantifizierte Erfolge
5. Rollenalignment und Klarheit für Recruiter

Gib ein JSON-Objekt mit dieser genauen Struktur zurück:
{
  "scores": {
    "atsScore": <0-100>,
    "keywordCoverage": <0-100>,
    "recruiterClarity": <0-100>,
    "formatSafety": <0-100>
  },
  "keywords": {
    "extracted": [<15-20 wichtigste Anforderungen aus der Stelle>],
    "matched": [<im Lebenslauf vorhandene Schlüsselbegriffe>],
    "missing": [<wichtige Schlüsselbegriffe NICHT im Lebenslauf>]
  },
  "flaws": [<3-5 erkannte strukturelle oder inhaltliche Mängel>],
  "improvements": [<4-5 priorisierte Verbesserungsvorschläge>],
  "structuredSuggestions": [<4-5 detaillierte, umsetzbare Empfehlungen>],
  "optimizedCv": "<umgeschriebene CV-Sektion optimiert für ATS und Recruiter>"
}

Bewertungsleitfaden:
- ATS-Score (45% Schlüsselbegriffe + 35% Klarheit + 20% Format): Wie hoch ist die Chance, dass dieser Lebenslauf ATS passiert und von Menschen gelesen wird?
- Keyword-Abdeckung: % der Stellenanforderungen im Lebenslauf gefunden
- Recruiter-Klarheit: Wie klar und gut strukturiert ist der Lebenslauf für menschliche Reviewer?
- Format-Sicherheit: Wie ATS-sicher ist die Formatierung? (keine Tabellen, Icons, Grafiken)

Sei ehrlich und konstruktiv. Vermeide allgemeine Ratschläge.`;

/**
 * Generate English user prompt for CV analysis.
 */
export function getUserPromptEn(cv: string, jobDescription: string): string {
  return `Please analyze this CV against the job description below.

===== CV =====
${cv}

===== JOB DESCRIPTION =====
${jobDescription}

===== END =====

Provide your analysis as JSON only, no other text.`;
}

/**
 * Generate German user prompt for CV analysis.
 */
export function getUserPromptDe(cv: string, jobDescription: string): string {
  return `Bitte analysiere diesen Lebenslauf gegen die folgende Stellenanzeige.

===== LEBENSLAUF =====
${cv}

===== STELLENANZEIGE =====
${jobDescription}

===== ENDE =====

Gib deine Analyse nur als JSON aus, kein anderer Text.`;
}

/**
 * Get language-specific prompts.
 */
export function getAnalysisPrompts(locale: Locale): {
  system: string;
  getUserPrompt: (cv: string, jd: string) => string;
} {
  if (locale === "en") {
    return {
      system: systemPromptEn,
      getUserPrompt: getUserPromptEn,
    };
  }
  return {
    system: systemPromptDe,
    getUserPrompt: getUserPromptDe,
  };
}
