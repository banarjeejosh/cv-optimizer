/**
 * German heuristic CV analyzer.
 * Ported from cv-optimizer-nextjs-de/lib/cv-analysis-de.js
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
  buildOptimizedCvDe,
} from "./shared";

export function analyzeHeuristicDe(req: AnalysisRequest): AnalysisResult {
  const startTime = Date.now();
  const { cv, jobDescription } = req;
  const config = getConfig("de");

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

  // Check for required German sections
  const sectionAliases = config.sectionAliases;
  if (!sectionPresent(cv, sectionAliases.kurzprofil || [])) {
    flaws.push(
      "Kein klares Kurzprofil im oberen Bereich erkannt. In Deutschland ist ein prägnantes Kurzprofil für Fach- und Senior-Rollen hilfreich.",
    );
  }
  if (!sectionPresent(cv, sectionAliases.berufserfahrung || [])) {
    flaws.push("Keine klar erkennbare Rubrik Berufserfahrung gefunden.");
  }
  if (!sectionPresent(cv, sectionAliases.ausbildung || [])) {
    flaws.push("Rubrik Ausbildung oder Studium fehlt.");
  }
  if (!sectionPresent(cv, sectionAliases.kenntnisse || [])) {
    flaws.push("Rubrik Kenntnisse oder Kompetenzen fehlt.");
  }
  if (!sectionPresent(cv, sectionAliases.sprachen || [])) {
    flaws.push(
      "Rubrik Sprachen fehlt. Für den deutschen Markt sollte Deutsch und Englisch sauber ausgewiesen sein.",
    );
  }

  // Check for quantified impact
  if (!hasQuantifiedImpact(cv, config.quantifierPattern)) {
    flaws.push(
      "Zu wenige quantifizierte Ergebnisse erkannt. Recruiter in Deutschland achten stark auf belastbare Resultate und Verantwortungsumfang.",
    );
  }

  // Check for action language
  const verbStrength = scoreActionLanguage(cv, config.strongVerbs);
  if (verbStrength < 4) {
    flaws.push(
      "Die Formulierungen wirken zu passiv. Nutzen Sie stärkere Verben wie geleitet, implementiert, optimiert oder verantwortet.",
    );
  }

  // Check for missing priority keywords
  if (missing.length > 0) {
    flaws.push(
      `Wichtige Begriffe aus der Stellenanzeige fehlen oder erscheinen zu selten: ${missing.slice(0, 8).join(", ")}.`,
    );
  }

  // Calculate recruiter clarity score
  let recruiterClarity = 42;
  if (sectionPresent(cv, sectionAliases.kurzprofil || []))
    recruiterClarity += 12;
  if (sectionPresent(cv, sectionAliases.berufserfahrung || []))
    recruiterClarity += 12;
  if (sectionPresent(cv, sectionAliases.kenntnisse || []))
    recruiterClarity += 10;
  if (sectionPresent(cv, sectionAliases.sprachen || [])) recruiterClarity += 6;
  if (hasQuantifiedImpact(cv, config.quantifierPattern)) recruiterClarity += 10;
  recruiterClarity += Math.min(verbStrength * 2, 10);
  recruiterClarity = Math.min(100, recruiterClarity);

  // Calculate format safety score
  let formatSafety = 100 - atsRisks.length * 9;
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
    "Berufsbezeichnung im Header exakt an die Zielstelle anlehnen, sofern fachlich korrekt.",
    "Kurzprofil auf 3 bis 4 Zeilen verdichten und mit den Schlüsselbegriffen der Stelle formulieren.",
    "Die letzten 2 bis 3 Stationen stärker auf Ergebnisse, Verantwortungsumfang und Fachbegriffe ausrichten.",
    "Kenntnisse sauber strukturieren: Fachkompetenzen, Software/Tools, Methoden, Sprachen.",
    "Einfaches tabellarisches, einspaltiges Layout ohne Icons, Tabellen und Textboxen verwenden.",
  ];

  if (!hasQuantifiedImpact(cv, config.quantifierPattern)) {
    improvements.unshift(
      "Add quantified results to at least 4 to 6 bullets, using percentages, revenue, volume, time saved, or team size.",
    );
  }

  // Generate structured suggestions
  const structuredSuggestions = [
    "Kurzprofil: Zielrolle, Erfahrungsschwerpunkt, Branchenkontext und 2 bis 3 harte Stärken nennen.",
    `Berufserfahrung: Fehlende Schlüsselbegriffe gezielt und wahrheitsgemäß einbauen, z. B. ${missing.slice(0, 6).join(", ") || "zentrale Fachbegriffe aus der Anzeige"}.`,
    "Erfolge: Pro Station mindestens 1 bis 2 konkrete Resultate mit Zahlen oder Größenordnungen ergänzen.",
    "Kenntnisse: Deutsche und englische Begriffe konsistent verwenden, wenn auch in der Anzeige beide Sprachformen vorkommen.",
    "ATS-Fit: Nur Standardüberschriften verwenden und Datumsformat durchgängig einheitlich halten, z. B. MM/JJJJ.",
  ];

  // Format missing keywords as display items
  const missingKeywordItems = missing.length
    ? missing.map(
        (item) => `Fehlt oder ist schwach ausgeprägt: ${titleCase(item)}`,
      )
    : ["Die wichtigsten Schlüsselbegriffe sind bereits gut abgedeckt."];

  // Build optimized CV
  const optimizedCv = buildOptimizedCvDe(cv, jobDescription, keywords, missing);

  // Determine final result
  const finalFlaws = flaws.length
    ? flaws
    : [
        "Keine gravierenden strukturellen Probleme erkannt. Feinschliff bleibt dennoch sinnvoll.",
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
    status: `Analyse abgeschlossen. Geschätzter ATS-Fit: ${atsScore}% bei ${missing.length} festgestellten Keyword-Lücken.`,
    metadata: {
      analysisTimeMs: Date.now() - startTime,
      provider: "heuristic",
    },
  };
}
