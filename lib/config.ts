/**
 * Locale-specific configuration for CV analysis.
 * Controls language rules, patterns, weights, and sample data.
 */

import { LocaleConfig, Locale } from "./types";
import { i18n } from "./i18n";

/**
 * English locale configuration.
 */
const enConfig: LocaleConfig = {
  stopwords: new Set([
    // Articles
    "the",
    "a",
    "an",
    // Conjunctions
    "and",
    "or",
    "but",
    "nor",
    "yet",
    "so",
    // Prepositions
    "for",
    "with",
    "that",
    "this",
    "from",
    "into",
    "to",
    "at",
    "on",
    "in",
    "by",
    "of",
    "over",
    "under",
    "across",
    "through",
    "before",
    "after",
    "during",
    "within",
    // Common verbs
    "is",
    "are",
    "was",
    "were",
    "be",
    "been",
    "being",
    "have",
    "has",
    "had",
    "do",
    "does",
    "did",
    "will",
    "would",
    "should",
    "could",
    "may",
    "might",
    "can",
    "must",
    // Pronouns
    "i",
    "you",
    "he",
    "she",
    "it",
    "we",
    "they",
    "me",
    "him",
    "her",
    "us",
    "them",
    "my",
    "your",
    "his",
    "their",
    "its",
    "our",
    // Common words
    "using",
    "used",
    "use",
    "your",
    "our",
    "are",
    "job",
    "role",
    "work",
    "team",
    "years",
    "year",
    "plus",
    "must",
    "high",
    "very",
    "such",
    "including",
    "as",
    "also",
    "more",
    "most",
    "some",
    "any",
    "all",
    "out",
    "off",
    "not",
    "who",
    "what",
    "when",
    "where",
    "why",
    "how",
    "etc",
    "per",
    "able",
    "required",
    "preferred",
    "need",
    "needs",
    "want",
    "wants",
    "help",
    // Resume-centric stopwords
    "experience",
    "strong",
    "skills",
    "skill",
    "candidate",
    "responsible",
    "responsibilities",
    "requirements",
    "about",
    "should",
    "could",
    "would",
  ]),

  phrasePatterns: [
    /project management/gi,
    /stakeholder management/gi,
    /cross functional/gi,
    /data analysis/gi,
    /business development/gi,
    /customer success/gi,
    /account management/gi,
    /process improvement/gi,
    /change management/gi,
    /product management/gi,
    /supply chain/gi,
    /quality assurance/gi,
    /risk management/gi,
    /financial planning/gi,
    /budget management/gi,
    /strategic planning/gi,
    /performance management/gi,
    /team leadership/gi,
    /technical excellence/gi,
    /digital transformation/gi,
    /sql/gi,
    /excel/gi,
    /power bi/gi,
    /tableau/gi,
    /sap/gi,
    /salesforce/gi,
    /python/gi,
    /jira/gi,
    /agile/gi,
    /scrum/gi,
    /recruitment/gi,
    /talent acquisition/gi,
    /sourcing/gi,
    /interviewing/gi,
    /compliance/gi,
    /forecasting/gi,
    /budgeting/gi,
    /ats management/gi,
    /candidate experience/gi,
    /employer branding/gi,
    /pipeline analytics/gi,
  ],

  sectionAliases: {
    summary: [
      "summary",
      "profile",
      "professional summary",
      "professional profile",
      "overview",
      "about me",
    ],
    experience: [
      "experience",
      "employment",
      "work history",
      "professional experience",
      "career history",
    ],
    skills: [
      "skills",
      "core skills",
      "technical skills",
      "key skills",
      "competencies",
      "abilities",
    ],
    education: [
      "education",
      "academic credentials",
      "schooling",
      "university",
      "college",
      "degree",
    ],
    certifications: [
      "certifications",
      "licenses",
      "certifications and licenses",
      "professional certifications",
    ],
    projects: ["projects", "notable projects", "key projects", "portfolio"],
  },

  requiredSections: ["summary", "experience", "skills", "education"],

  strongVerbs: [
    "led",
    "managed",
    "built",
    "created",
    "improved",
    "delivered",
    "developed",
    "launched",
    "increased",
    "reduced",
    "optimized",
    "implemented",
    "designed",
    "owned",
    "scaled",
    "analyzed",
    "coordinated",
    "negotiated",
    "drove",
    "transformed",
    "established",
    "accelerated",
    "enhanced",
    "streamlined",
    "spearheaded",
    "championed",
    "revolutionized",
    "pioneered",
    "orchestrated",
    "elevated",
    "fostered",
    "cultivated",
    "mentored",
    "architected",
    "engineered",
    "restructured",
    "consolidated",
    "revamped",
  ],

  quantifierPattern:
    /\b\d+%|\b\d+\+|\b\$\d+|\b€\d+|\b£\d+|\b\d+\s?(k|m|million|billion|\d+\s?(days|months|years|people|clients|hires|projects))\b/i,
  linkPattern: /https?:\/\/[^\s]+/gi,

  astriskRiskPatterns: [
    {
      regex: /\|/,
      message:
        "Possible table-style formatting detected. ATS systems often parse plain text layouts better.",
    },
    {
      regex: /[●◆■►✓★•]/,
      message:
        "Special symbols or decorative bullets may reduce parser consistency in some ATS systems.",
    },
    {
      regex: /https?:\/\//,
      message:
        "Links are present. Keep them short and plain text, ideally LinkedIn and portfolio only.",
    },
    {
      regex: /\b(text box|icon|graphic|infographic|two-column)\b/i,
      message:
        "The CV references design-heavy formatting. ATS-safe versions should use a single-column plain structure.",
    },
  ],

  scoringWeights: {
    keyword: 0.45,
    clarity: 0.35,
    format: 0.2,
  },

  sampleCv: `John Smith
john.smith@email.com | linkedin.com/in/johnsmith | 555-123-4567

PROFESSIONAL SUMMARY
Results-driven Senior Product Manager with 8+ years of experience leading cross-functional teams and delivering customer-focused solutions. Proven track record of increasing revenue by 45% and reducing time-to-market by 30%.

PROFESSIONAL EXPERIENCE

Senior Product Manager | TechCorp Inc. | Jan 2020 - Present
• Led product strategy for SaaS platform serving 500+ enterprise customers
• Increased user engagement by 65% through feature redesign and A/B testing
• Managed team of 5 engineers and coordinated with marketing and sales departments
• Reduced feature development cycle from 12 weeks to 6 weeks

Product Manager | InnovateLabs | May 2017 - Dec 2019
• Drove go-to-market strategy for 3 major product launches
• Analyzed market trends and competitive landscape to identify growth opportunities
• Collaborated with stakeholders to define product roadmap and prioritize features
• Improved customer retention rate from 78% to 92%

EDUCATION
MBA in Business Administration | State University | 2015
Bachelor of Science in Computer Science | Tech Institute | 2012

SKILLS
Product Management | Agile/Scrum | Data Analysis | SQL | Python | Tableau | Salesforce | Strategic Planning | Team Leadership | Business Development | Customer Success | Budget Management | User Research | Competitive Analysis
`,

  sampleJob: `Senior Product Manager - FinTech Solutions

About the Role:
We are seeking a Senior Product Manager to join our growing FinTech team. You will lead the development and go-to-market strategy for our flagship products serving institutional clients. This is a pivotal role that combines strategic vision with hands-on execution.

Responsibilities:
• Define and communicate product vision and strategy to stakeholders and cross-functional teams
• Conduct market research, competitive analysis, and user research to identify opportunities
• Own product roadmap development and prioritization of features and initiatives
• Collaborate with Engineering, Design, and Marketing teams to deliver exceptional products
• Analyze product metrics, KPIs, and user feedback to drive continuous improvement
• Build relationships with key customers and integrate their feedback into product development
• Present product strategy and progress to executive leadership and investors

Required Qualifications:
• 6+ years of product management or related experience in B2B SaaS
• Strong analytical and problem-solving skills with proficiency in SQL and data visualization tools
• Experience with Agile/Scrum methodologies
• Excellent communication and stakeholder management abilities
• MBA or equivalent professional experience
• Experience with financial services, payments, or fintech products
• Proven track record of successfully launching products and driving adoption

Preferred Qualifications:
• Experience with Salesforce or similar CRM platforms
• Background in financial markets or banking
• Knowledge of regulatory requirements in financial services
• Experience scaling teams and mentoring junior PMs

What We Offer:
• Competitive salary and equity package
• Comprehensive benefits including health insurance and 401(k)
• Professional development opportunities
• Flexible work environment
• Collaborative and fast-paced culture
`,

  labels: i18n.en,
};

/**
 * German locale configuration.
 */
const deConfig: LocaleConfig = {
  stopwords: new Set([
    // Articles & pronouns
    "der",
    "die",
    "das",
    "dem",
    "den",
    "des",
    "ein",
    "eine",
    "einen",
    "einem",
    "einer",
    "eines",
    "dieser",
    "dieses",
    "diesen",
    "diesem",
    "dieser",
    "jener",
    "jenes",
    "jenen",
    "jenem",
    "jener",
    "welcher",
    "welches",
    "welchen",
    "welchem",
    "welcher",
    // Personal pronouns
    "ich",
    "du",
    "er",
    "sie",
    "es",
    "wir",
    "ihr",
    "Sie",
    "mich",
    "dich",
    "ihn",
    "sie",
    "uns",
    "euch",
    "mein",
    "dein",
    "sein",
    "ihr",
    "unser",
    "euer",
    "meinem",
    "deinem",
    "seinem",
    "ihrem",
    // Conjunctions & prepositions
    "und",
    "oder",
    "aber",
    "doch",
    "sondern",
    "weil",
    "obwohl",
    "während",
    "bevor",
    "nachdem",
    "für",
    "von",
    "mit",
    "zu",
    "zum",
    "zur",
    "bei",
    "in",
    "im",
    "an",
    "am",
    "auf",
    "aus",
    "über",
    "unter",
    "neben",
    "zwischen",
    "durch",
    "nach",
    "vor",
    "seit",
    "längs",
    // Common verbs
    "ist",
    "sind",
    "war",
    "waren",
    "bin",
    "bist",
    "seid",
    "sein",
    "sein",
    "haben",
    "hat",
    "habe",
    "habt",
    "hattest",
    "hatte",
    "hatten",
    "werden",
    "wird",
    "werde",
    "werdet",
    "würde",
    "würden",
    "kann",
    "könnte",
    "konnte",
    "darf",
    "durfte",
    "mag",
    "muss",
    "musste",
    "soll",
    "sollte",
    // Common words
    "also",
    "auch",
    "als",
    "allein",
    "allein",
    "allerdings",
    "alles",
    "allgemein",
    "ander",
    "anderer",
    "anderes",
    "anderen",
    "anderem",
    "andere",
    "andren",
    "anderm",
    "andern",
    "mehr",
    "mehrere",
    "mehrerer",
    "mehrere",
    "mehrern",
    "einige",
    "einiger",
    "einiges",
    "einigen",
    "einigem",
    "einige",
    "einigen",
    "einigem",
    "ganze",
    "ganzer",
    "ganzes",
    "ganzen",
    "ganzem",
    "halbe",
    "halber",
    "halbes",
    "halben",
    "halbem",
    "manche",
    "mancher",
    "manches",
    "manchem",
    "manchem",
    "solche",
    "solcher",
    "solches",
    "solchen",
    "solchem",
    "gewisse",
    "gewisser",
    "gewisses",
    "gewissen",
    "gewissem",
    "viele",
    "vieler",
    "vieles",
    "vielen",
    "vielem",
    "wenige",
    "weniger",
    "weniges",
    "wenigen",
    "wenigen",
    "einzig",
    "einziger",
    "einziges",
    "einzigen",
    "einzigem",
    // Professional/resume-centric German stopwords
    "erfahrung",
    "berufserfahrung",
    "arbeitserfahrung",
    "kenntnisse",
    "kenntnisse",
    "fachkenntnisse",
    "kompetenzen",
    "fachkompetenzen",
    "aufgaben",
    "verantwortung",
    "verantwortungen",
    "unternehmen",
    "unternehmens",
    "unternehmensgruppe",
    "team",
    "teams",
    "abteilung",
    "bereich",
    "rolle",
    "position",
    "stelle",
    "stellen",
    "erfolg",
    "erfolge",
    "erfolgreiche",
    "projekt",
    "projekte",
    "projekte",
    "tätigkeitsbereich",
    "arbeit",
    "arbeiten",
    "qualifiziert",
    "qualifizierung",
    "anforderung",
    "anforderungen",
    "voraussetzung",
    "voraussetzungen",
    "ideal",
    "idealerweise",
    "idealfall",
    "bevorzugt",
    "bevorzugte",
    "wünschenswert",
    "notwendig",
    "erforderlich",
    "erforderliche",
    "vorteil",
    "vorteilhaft",
    "weitere",
    "m/w/d",
    "wmd",
    "dich",
    "sie",
    "ihnen",
    "ihr",
    "ihre",
    "ihren",
    "wir",
    "uns",
    "unser",
    "unsere",
    "dein",
    "deine",
    "deinen",
    "eigenständig",
    "selbstständig",
    "hohe",
    "hoher",
    "sicherer",
    "gute",
    "guten",
    "sehr",
    "gut",
    "sollten",
    "soll",
    "kann",
    "können",
    "muss",
    "müssen",
  ]),

  phrasePatterns: [
    /projektmanagement/gi,
    /stakeholdermanagement/gi,
    /prozessoptimierung/gi,
    /datenanalyse/gi,
    /reporting/gi,
    /schnittstellenmanagement/gi,
    /change management/gi,
    /compliance/gi,
    /sap/gi,
    /sap ewm/gi,
    /sap mm/gi,
    /power bi/gi,
    /excel/gi,
    /python/gi,
    /sql/gi,
    /jira/gi,
    /scrum/gi,
    /agil/gi,
    /lieferantenmanagement/gi,
    /qualitätsmanagement/gi,
    /kundenbetreuung/gi,
    /talent acquisition/gi,
    /recruiting/gi,
    /bewerbermanagement/gi,
    /interviewführung/gi,
    /arbeitsrecht/gi,
    /deutsch/gi,
    /englisch/gi,
    /anlagenbau/gi,
    /energiewirtschaft/gi,
    /projektabwicklung/gi,
    /instandhaltung/gi,
    /controlling/gi,
    /budgetplanung/gi,
    /terminplanung/gi,
    /risikomanagement/gi,
    /kundenverhältnis/gi,
    /vertrieb/gi,
    /verkauf/gi,
    /logistik/gi,
    /lagerwirtschaft/gi,
  ],

  sectionAliases: {
    kurzprofil: [
      "kurzprofil",
      "profil",
      "persönliches profil",
      "berufliches profil",
      "zusammenfassung",
      "übersicht",
    ],
    berufserfahrung: [
      "berufserfahrung",
      "beruflicher werdegang",
      "praktische erfahrung",
      "erfahrung",
      "arbeitserfahrung",
    ],
    ausbildung: [
      "ausbildung",
      "studium",
      "hochschulbildung",
      "akademische ausbildung",
      "schulung",
    ],
    kenntnisse: [
      "kenntnisse",
      "fachkenntnisse",
      "kompetenzen",
      "schlüsselkompetenzen",
      "it-kenntnisse",
      "sprachen",
    ],
    sprachen: ["sprachen", "sprachkenntnisse", "sprache"],
    zertifikate: [
      "zertifikate",
      "zertifizierungen",
      "lizenzierungen",
      "weiterbildung",
    ],
  },

  requiredSections: [
    "kurzprofil",
    "berufserfahrung",
    "ausbildung",
    "kenntnisse",
  ],

  strongVerbs: [
    "geleitet",
    "gesteuert",
    "koordiniert",
    "verantwortet",
    "realisiert",
    "implementiert",
    "optimiert",
    "analysiert",
    "entwickelt",
    "aufgebaut",
    "eingeführt",
    "reduziert",
    "gesteigert",
    "verhandelt",
    "überwacht",
    "begleitet",
    "dokumentiert",
    "durchgeführt",
    "konzipiert",
    "skaliert",
    "verwaltet",
    "verwaltete",
    "erweitert",
    "verbessert",
    "modernisiert",
    "transformiert",
    "reorganisiert",
    "zentralisiert",
    "dezentralisiert",
    "etabliert",
    "gegründet",
    "gegründete",
    "aufgebaut",
    "strukturiert",
    "automatisiert",
    "digitalisiert",
    "modularisiert",
    "integriert",
    "konsolidiert",
    "vereinheitlicht",
    "standardisiert",
    "optimierte",
  ],

  quantifierPattern:
    /\b\d+%|\b\d+\+|\b€\s?\d+|\b\d+\s?(Mio|Mrd|Tsd|Jahre|Monate|Tage|Mitarbeitende|Mitarbeiter|Projekte|Standorte|Bewerbungen|Kandidaten|Anlagen|MW|kV)\b/i,
  linkPattern: /https?:\/\/[^\s]+/gi,

  astriskRiskPatterns: [
    {
      regex: /\|/,
      message:
        "Tabellenähnliche Trennzeichen erkannt. Für ATS besser auf einfache Textstruktur setzen.",
    },
    {
      regex: /[●◆■►✓★]/,
      message:
        "Sonderzeichen erkannt. Verwenden Sie besser einfache Bindestriche als Aufzählungszeichen.",
    },
    {
      regex:
        /\b(icon|grafik|infografik|textbox|zweispaltig|zweispaltiges layout)\b/i,
      message:
        "Hinweis auf designlastiges Layout erkannt. Für ATS ist ein einspaltiges Layout sicherer.",
    },
    {
      regex: /(kopfzeile|fußzeile)/i,
      message: "Wichtige Informationen gehören nicht in Kopf- oder Fußzeilen.",
    },
  ],

  scoringWeights: {
    keyword: 0.48,
    clarity: 0.32,
    format: 0.2,
  },

  sampleCv: `Max Müller
max.mueller@email.de | linkedin.com/in/maxmueller | +49 123 456 789

BERUFLICHES PROFIL
Erfahrener Produktmanager mit 8+ Jahren Erfolgsbilanz in der Führung von Cross-funktionalen Teams und der Entwicklung kundenorientierter Lösungen. Nachgewiesener Erfolg bei der Steigerung des Umsatzes um 45% und der Reduzierung der Time-to-Market um 30%.

BERUFSERFAHRUNG

Senior Produktmanager | TechCorp Deutschland GmbH | Januar 2020 - Heute
• Leitung der Produktstrategie für SaaS-Plattform mit über 500 Unternehmenskunden
• Steigerung der Benutzereinbindung um 65% durch Feature-Redesign und A/B-Tests
• Verwaltung eines Teams von 5 Ingenieuren und Koordination mit Marketing und Vertrieb
• Reduzierung des Feature-Entwicklungszyklus von 12 auf 6 Wochen

Produktmanager | InnovateLabs | Mai 2017 - Dezember 2019
• Strategie für Go-to-Market bei 3 großen Produkteinführungen
• Analyse von Markttrends und Wettbewerbslandschaft zur Identifikation von Wachstumschancen
• Zusammenarbeit mit Stakeholdern zur Definition der Produkt-Roadmap
• Verbesserung der Kundenretention von 78% auf 92%

AUSBILDUNG
MBA in Betriebswirtschaft | Universität München | 2015
Diplom in Informatik | Technische Hochschule | 2012

KOMPETENZEN
Produktmanagement | Agile/Scrum | Datenanalyse | SQL | Python | Tableau | Salesforce | Strategische Planung | Teamleitung | Geschäftsentwicklung | Customer Success | Budgetmanagement | Nutzerforschung | Wettbewerbsanalyse
`,

  sampleJob: `Senior Produktmanager - FinTech-Lösungen

Über die Rolle:
Wir suchen einen erfahrenen Produktmanager für unser wachsendes FinTech-Team. Sie werden die Entwicklung und Go-to-Market-Strategie für unsere Flagship-Produkte für institutionelle Kunden leiten. Dies ist eine Schlüsselposition, die strategische Vision mit praktischer Umsetzung verbindet.

Aufgaben:
• Definition und Kommunikation der Produktvision und -strategie an Stakeholder und funktionsübergreifende Teams
• Durchführung von Marktforschung, Wettbewerbsanalyse und Nutzerforschung zur Identifikation von Möglichkeiten
• Eigentümerschaft der Produkt-Roadmap-Entwicklung und Priorisierung von Features
• Zusammenarbeit mit Engineering-, Design- und Marketing-Teams zur Lieferung außergewöhnlicher Produkte
• Analyse von Produktmetriken und KPIs zur Förderung kontinuierlicher Verbesserungen
• Aufbau von Beziehungen zu Schlüsselkunden und Integration von Feedback

Erforderliche Qualifikationen:
• 6+ Jahre Erfahrung im Produktmanagement oder verwandten Bereichen in B2B SaaS
• Starke analytische Fähigkeiten und Vertrautheit mit SQL und Datenvisualisierungstools
• Erfahrung mit Agile/Scrum-Methoden
• Hervorragende Kommunikations- und Stakeholder-Management-Fähigkeiten
• MBA oder gleichwerti ge berufliche Erfahrung
• Erfahrung mit Finanzdienstleistungen oder FinTech-Produkten
• Nachweisliche Erfolgsbilanz bei Produkteinführungen

Bevorzugte Qualifikationen:
• Erfahrung mit Salesforce oder ähnlichen CRM-Plattformen
• Hintergrund in Finanzdienstleistungen oder Banking
• Kenntnisse regelungstechnischer Anforderungen
• Erfahrung im Aufbau und in der Mentorierung von Teams

Angebot:
• Wettbewerbsfähiges Gehalt und Aktienpakete
• Umfassende Leistungen inklusive Krankenversicherung
• Möglichkeiten zur beruflichen Entwicklung
• Flexible Arbeitsumgebung
• Zusammenarbeit in einer schnelllebigen Kultur
`,

  labels: i18n.de,
};

/**
 * Master locale configuration map.
 */
export const localeConfigs: Record<Locale, LocaleConfig> = {
  en: enConfig,
  de: deConfig,
};

/**
 * Sample CV and Job Description for each locale.
 */
export const sampleData = {
  en: {
    cv: `Leonard Peris
Hamburg, Germany | leonard@email.com | linkedin.com/in/leonard

Professional Summary
Recruitment and operations professional with experience supporting hiring, stakeholder coordination, process improvement, and candidate management across fast-paced environments.

Experience
Talent Acquisition Specialist | Example Company | 2022-Present
- Managed end-to-end recruitment across sales and operations roles.
- Coordinated interviews with hiring managers and external partners.
- Improved scheduling process and reduced delays by 20%.
- Built candidate pipelines through sourcing, outreach, and screening.

Operations Coordinator | Example Group | 2020-2022
- Supported reporting, documentation, and cross-functional communication.
- Helped improve onboarding workflows and internal process compliance.

Skills
Recruitment, sourcing, stakeholder communication, interview coordination, onboarding, process improvement, Excel, CRM

Education
BSc Business Management`,

    jobDescription: `Senior Recruiter
We are seeking a Senior Recruiter to lead full-cycle hiring across commercial and corporate functions. The role requires talent acquisition strategy, stakeholder management, sourcing, interview design, pipeline analytics, employer branding, ATS management, and data-driven reporting. Experience with recruitment KPIs, process improvement, hiring manager advisory, compliance, and candidate experience is essential. Knowledge of LinkedIn Recruiter, Excel, dashboard reporting, and cross-functional collaboration is preferred.`,
  },

  de: {
    cv: `Leonard Sunny Peris
Hamburg, Deutschland | leonard@email.com | LinkedIn

KURZPROFIL
Ingenieur- und Projektkoordinationsprofil mit Erfahrung in technischen Projekten, Abstimmung mit Stakeholdern, Prozessverbesserung und strukturierter Dokumentation in internationalen Umfeldern.

BERUFSERFAHRUNG
Projektkoordinator | Beispielunternehmen | 05/2022-heute
- Koordination technischer Arbeitspakete mit internen und externen Schnittstellen.
- Erstellung von Statusberichten, Terminverfolgung und Abstimmung mit Projektbeteiligten.
- Optimierung von Abläufen und Reduzierung von Verzögerungen um 15%.

Ingenieur / Operations Support | Beispielgruppe | 03/2020-04/2022
- Unterstützung bei Dokumentation, Reporting und technischen Abstimmungen.
- Mitwirkung an Prozessverbesserungen und Qualitätsmaßnahmen.

KENNTNISSE
Projektmanagement, Reporting, Excel, Stakeholder-Kommunikation, Prozessoptimierung, technische Dokumentation

SPRACHEN
Deutsch - B2
Englisch - C2

AUSBILDUNG
Master / Bachelor Beispielstudiengang`,

    jobDescription: `Projektmanager Energietechnik (m/w/d)
Für unseren Standort suchen wir einen Projektmanager mit Erfahrung in Projektmanagement, Schnittstellenmanagement, Terminplanung, Budgetplanung, Reporting und Stakeholdermanagement. Idealerweise bringen Sie Kenntnisse in der Energiewirtschaft, technischen Dokumentation, SAP, Excel, Risikomanagement und Prozessoptimierung mit. Sie koordinieren interne und externe Beteiligte, überwachen Projektfortschritte, erstellen Statusberichte und sichern die Einhaltung von Qualität, Kosten und Terminen.`,
  },
};

/**
 * Helper to get config by locale.
 */
export function getConfig(locale: Locale): LocaleConfig {
  return localeConfigs[locale];
}

/**
 * Helper to get sample data by locale.
 */
export function getSampleData(locale: Locale) {
  return sampleData[locale];
}
