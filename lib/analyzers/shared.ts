/**
 * Shared utilities for heuristic CV analysis.
 * Used by both English and German analyzers.
 */

import { LocaleConfig } from "../types";

/**
 * Normalize text: lowercase, remove special chars, collapse whitespace.
 * Config parameter is optional (currently unused but kept for future extensibility).
 */
export function normalize(text: string, config?: LocaleConfig): string {
  return text
    .toLowerCase()
    .replace(/[\u2013\u2014]/g, "-") // Unicode dashes to hyphen
    .replace(/[^a-zäöüß0-9+#./\-\s]/gi, " ") // Remove special chars, keep umlauts
    .replace(/\s+/g, " ") // Collapse whitespace
    .trim();
}

/**
 * Title case a string: capitalize first letter of each word.
 */
export function titleCase(str: string): string {
  return str.replace(
    /\b\w+/g,
    (match) => match.charAt(0).toUpperCase() + match.slice(1),
  );
}

/**
 * Remove bullet characters and leading whitespace from a line.
 */
export function cleanBullet(line: string): string {
  return line.replace(/^[-•●◆■►✓★\s]+/, "").trim();
}

/**
 * Check if CV contains any of the given section aliases.
 */
export function sectionPresent(cv: string, aliases: string[]): boolean {
  const lower = cv.toLowerCase();
  return aliases.some((alias) =>
    new RegExp(
      `\\b${alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
      "i",
    ).test(lower),
  );
}

/**
 * Check if CV contains quantified impact (numbers, metrics, percentages).
 */
export function hasQuantifiedImpact(cv: string, pattern: RegExp): boolean {
  return pattern.test(cv);
}

/**
 * Count how many strong action verbs appear in CV.
 */
export function scoreActionLanguage(cv: string, strongVerbs: string[]): number {
  const normalized = normalize(cv);
  return strongVerbs.filter((verb) => normalized.includes(verb.toLowerCase()))
    .length;
}

/**
 * Extract keywords from job description.
 * Combines multi-word phrases + top-frequency single words, filters stopwords.
 */
export function extractKeywords(
  jobText: string,
  config: LocaleConfig,
): string[] {
  const clean = normalize(jobText, config);
  const words = clean.split(" ");
  const freq = new Map<string, number>();

  // Count word frequencies
  for (const word of words) {
    if (word.length <= 2 || config.stopwords.has(word)) {
      continue;
    }
    freq.set(word, (freq.get(word) || 0) + 1);
  }

  // Extract phrases from patterns
  const phrases: string[] = [];
  for (const pattern of config.phrasePatterns) {
    const matches = clean.match(pattern);
    if (matches) {
      phrases.push(pattern.source.replace(/\\/g, "").replace(/\/gi?$/, ""));
    }
  }

  // Get top frequency words
  const topWords = [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 22)
    .map(([word]) => word);

  // Combine and deduplicate, limit to ~24 keywords
  return [...new Set([...phrases, ...topWords])].slice(0, 24);
}

/**
 * Count how many extracted keywords are matched vs. missing in CV.
 */
export function countMatches(
  cv: string,
  keywords: string[],
  config: LocaleConfig,
): { matched: string[]; missing: string[] } {
  const cvNormalized = normalize(cv, config);
  const matched: string[] = [];
  const missing: string[] = [];

  for (const keyword of keywords) {
    if (cvNormalized.includes(keyword.toLowerCase())) {
      matched.push(keyword);
    } else {
      missing.push(keyword);
    }
  }

  return { matched, missing };
}

/**
 * Detect ATS formatting risks in CV.
 */
export function detectAtsRisks(
  cv: string,
  patterns: Array<{ regex: RegExp; message: string }>,
): string[] {
  const risks: string[] = [];
  for (const rule of patterns) {
    if (rule.regex.test(cv)) {
      risks.push(rule.message);
    }
  }
  return risks;
}

/**
 * Extract relevant lines from CV for use in optimized output.
 */
export function extractRelevantBullets(
  cvText: string,
  maxLines: number = 18,
): string[] {
  return cvText
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => line.length > 30)
    .slice(0, maxLines);
}

/**
 * Find target role title from job description.
 */
export function findTargetTitle(jobText: string): string {
  const match = jobText.match(
    /(?:senior|lead|principal|head|manager|specialist|spezialist|ingenieur|ingenieurin|recruiter|referent|berater|consultant|analyst|koordinator|projektleiter|teamleiter)[^\n,.]{0,80}/i,
  );
  return match ? match[0].trim() : "Professional";
}

/**
 * Build optimized CV for English-speaking markets.
 */
export function buildOptimizedCvEn(
  cvText: string,
  jobText: string,
  keywords: string[],
  missing: string[],
): string {
  const headline = findTargetTitle(jobText);
  const topSkills = keywords.slice(0, 12).map(titleCase).join(" | ");
  const lines = extractRelevantBullets(cvText);
  const achievements = lines
    .filter(
      (line) =>
        /\d/.test(line) ||
        /led|managed|built|delivered|improved|optimized|launched|reduced|increased|developed/i.test(
          line,
        ),
    )
    .slice(0, 8);
  const responsibilities = lines.slice(0, 8);

  return [
    `Target Role: ${titleCase(headline)}`,
    "",
    "Professional Summary",
    `Results-oriented professional positioned for ${titleCase(headline)} roles, with experience aligned to the advertised priorities and a focus on delivering measurable business outcomes. Background highlights include cross-functional delivery, stakeholder communication, process improvement, and execution against role-specific objectives.`,
    "",
    "Core Skills",
    topSkills || "Add role-specific hard skills and tools from the advert.",
    "",
    "Selected Achievements",
    ...(achievements.length
      ? achievements.map((line) => `- ${cleanBullet(line)}`)
      : ["- Add quantified achievements tailored to the target role."]),
    "",
    "Experience Alignment Notes",
    ...(responsibilities.length
      ? responsibilities.map((line) => `- ${cleanBullet(line)}`)
      : [
          "- Reframe recent roles to mirror the target responsibilities and keywords.",
        ]),
    "",
    "ATS Optimization Additions",
    `- Integrate missing priority keywords naturally where accurate: ${missing.slice(0, 10).map(titleCase).join(", ") || "No major gaps detected."}`,
    "- Keep section headers simple: Professional Summary, Experience, Skills, Education, Certifications.",
    "- Use a single-column layout, standard fonts, and plain bullet points.",
    "- Ensure each recent role includes scope, tools, and measurable impact.",
  ].join("\n");
}

/**
 * Build optimized CV for German-speaking markets.
 */
export function buildOptimizedCvDe(
  cvText: string,
  jobText: string,
  keywords: string[],
  missing: string[],
): string {
  const title = titleCase(findTargetTitle(jobText));
  const lines = extractRelevantBullets(cvText);
  const achievementLines = lines
    .filter((line) =>
      /\d|gesteigert|reduziert|optimiert|geleitet|koordiniert|implementiert|entwickelt/i.test(
        line,
      ),
    )
    .slice(0, 6);
  const profileKeywords = keywords.slice(0, 10).map(titleCase).join(", ");

  return [
    `${title}`,
    "Hamburg, Deutschland | E-Mail | Telefon | LinkedIn",
    "",
    "KURZPROFIL",
    `Ergebnisorientierte Fachkraft mit relevanter Erfahrung für die Zielrolle ${title}. Nachweisbare Stärken in ${profileKeywords || "prozessnaher Umsetzung, Schnittstellenarbeit und strukturierter Projektarbeit"}. Fokus auf klaren Ergebnissen, belastbarer Kommunikation und einer ATS-konformen Darstellung für den deutschen Arbeitsmarkt.`,
    "",
    "KERNKOMPETENZEN",
    profileKeywords ||
      "Bitte passende Fachbegriffe aus der Stellenanzeige ergänzen.",
    "",
    "BERUFSERFAHRUNG",
    ...(achievementLines.length
      ? achievementLines.map((line) => `- ${cleanBullet(line)}`)
      : ["- Berufserfahrung mit messbaren Ergebnissen ergänzen."]),
    "",
    "OPTIMIERUNGSHINWEISE FÜR DIE FINALISIERUNG",
    "- Die finale Version sollte echte Positionsbezeichnungen, Arbeitgeber, Zeiträume und belastbare Ergebnisse enthalten.",
    `- Folgende Begriffe fehlen aktuell oder sind zu schwach vertreten: ${missing.slice(0, 10).map(titleCase).join(", ") || "Keine kritischen Keyword-Lücken erkannt."}`,
    "- Verwenden Sie Standardüberschriften wie Kurzprofil, Berufserfahrung, Ausbildung, Kenntnisse, Sprachen und Zertifikate.",
    "- Verwenden Sie ein einspaltiges Layout ohne Textboxen, Icons oder grafische Elemente mit Informationsgehalt.",
    "- Jede Station sollte Aufgaben, Verantwortungsumfang, Tools und messbare Resultate enthalten.",
  ].join("\n");
}
