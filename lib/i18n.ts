/**
 * Internationalization (i18n) dictionary.
 * All UI strings for English and German languages.
 */

export type I18nKey = keyof typeof i18n.en;

export const i18n = {
  en: {
    // Page metadata & branding
    app_title: "CV Optimizer",
    appTitle: "CV ATS Optimizer",
    appDescription: "AI-powered CV analysis for ATS fit and recruiter clarity",

    // Navbar
    selectLanguage: "Select Language",
    toggleTheme: "Toggle theme",

    // Input panel
    input_header: "Input & Analysis",
    ai_provider: "AI Provider",
    cv_input_label: "Your CV",
    cv_input_placeholder:
      "Paste your full CV here. Include summary, experience, skills, education, certifications, tools, and achievements.",
    job_input_label: "Target Job Description",
    job_input_placeholder:
      "Paste the target job advert here. Include responsibilities, required skills, nice-to-haves, tools, and industry language.",
    analyze_button: "Analyze CV",
    load_sample: "Load Sample",
    clear: "Clear All",

    // Scores section
    scores_heading: "Analysis Results",
    analyzed_by: "Analyzed by",
    overall_score: "Overall Score",
    ats_score: "ATS Score",
    ats_description: "Keyword match and formatting",
    keyword_coverage: "Keyword Coverage",
    keyword_description: "% of important keywords found",
    recruiter_clarity: "Recruiter Clarity",
    clarity_description: "Structure and readability",
    format_safety: "Format Safety",
    format_description: "ATS-safe formatting",

    // Results cards
    flaws_heading: "Potential Issues",
    no_flaws_message: "No major issues detected!",
    improvements_heading: "Recommended Improvements",
    keywords_heading: "Keyword Analysis",
    matched_keywords: "Matched Keywords",
    no_matched: "No matching keywords yet",
    missing_keywords: "Missing Keywords",
    no_missing: "All keywords covered!",

    // Output panel
    optimized_cv_heading: "Optimized CV",
    copy_button: "Copy to Clipboard",
    suggestions_heading: "Structured Suggestions",

    // States
    analyzing: "Analyzing...",
    powered_by: "Powered by",
    error_title: "Analysis Error",
    empty_state: "Ready to analyze?",
    empty_state_desc: "Enter your CV and job description to get started.",
  },

  de: {
    // Page metadata & branding
    app_title: "Lebenslauf-Optimizer",
    appTitle: "Deutscher CV ATS Optimizer",
    appDescription:
      "KI-gestützte Lebenslauf-Analyse für ATS-Fit und Recruiter-Klarheit",

    // Navbar
    selectLanguage: "Sprache wählen",
    toggleTheme: "Farbschema wechseln",

    // Input panel
    input_header: "Eingabe & Analyse",
    ai_provider: "KI-Anbieter",
    cv_input_label: "Ihr Lebenslauf",
    cv_input_placeholder:
      "Fügen Sie hier Ihren deutschen Basis-Lebenslauf ein. Nutzen Sie alle relevanten Abschnitte wie Kurzprofil, Berufserfahrung, Kenntnisse, Sprachen und Ausbildung.",
    job_input_label: "Ziel-Stellenanzeige",
    job_input_placeholder:
      "Fügen Sie hier die deutsche Stellenanzeige ein. Je vollständiger die Anzeige, desto besser die Analyse.",
    analyze_button: "Lebenslauf analysieren",
    load_sample: "Beispiel laden",
    clear: "Alles löschen",

    // Scores section
    scores_heading: "Analyseergebnisse",
    analyzed_by: "Analysiert von",
    overall_score: "Gesamtbewertung",
    ats_score: "ATS-Score",
    ats_description: "Keyword-Übereinstimmung und Formatierung",
    keyword_coverage: "Keyword-Abdeckung",
    keyword_description: "% wichtiger Schlüsselbegriffe gefunden",
    recruiter_clarity: "Recruiter-Klarheit",
    clarity_description: "Struktur und Lesbarkeit",
    format_safety: "Format-Sicherheit",
    format_description: "ATS-sichere Formatierung",

    // Results cards
    flaws_heading: "Potenzielle Probleme",
    no_flaws_message: "Keine großen Probleme erkannt!",
    improvements_heading: "Empfohlene Verbesserungen",
    keywords_heading: "Keyword-Analyse",
    matched_keywords: "Übereinstimmende Keywords",
    no_matched: "Noch keine Keyword-Übereinstimmungen",
    missing_keywords: "Fehlende Keywords",
    no_missing: "Alle Keywords vorhanden!",

    // Output panel
    optimized_cv_heading: "Optimierter Lebenslauf",
    copy_button: "In Zwischenablage kopieren",
    suggestions_heading: "Strukturierte Empfehlungen",

    // States
    analyzing: "Wird analysiert...",
    powered_by: "Bereitgestellt von",
    error_title: "Analysefehler",
    empty_state: "Bereit zur Analyse?",
    empty_state_desc:
      "Geben Sie Ihren Lebenslauf und die Stellenanzeige ein, um zu beginnen.",

    noPriorityKeywordsDetected:
      "Die wichtigsten Schlüsselbegriffe sind bereits gut abgedeckt.",
    noMajorStructuralFlaws:
      "Keine gravierenden strukturellen Probleme erkannt. Feinschliff bleibt dennoch sinnvoll.",
  },
} as const;

/**
 * Helper to safely get i18n string by locale and key.
 */
export function t(locale: "en" | "de", key: I18nKey): string {
  return i18n[locale][key] || i18n.en[key]; // Fallback to English if key missing in locale
}
