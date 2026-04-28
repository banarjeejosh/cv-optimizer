/**
 * Sample CV and Job Description for each locale.
 */

import { Locale } from "./types";

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
 * Helper to get sample data by locale.
 */
export function getSampleData(locale: Locale) {
  return sampleData[locale];
}
