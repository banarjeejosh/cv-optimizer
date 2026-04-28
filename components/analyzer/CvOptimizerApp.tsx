"use client";

import React, { useEffect, useState } from "react";
import { Locale } from "@/lib/types";
import { getSampleData } from "@/lib/config";
import { useLocale, useTheme, useAnalysis } from "@/lib/hooks";
import { Navbar } from "@/components/analyzer/Navbar";
import { InputPanel } from "@/components/analyzer/InputPanel";
import { ScoresSection } from "@/components/analyzer/ScoresSection";
import {
  FlawsCard,
  ImprovementsCard,
  KeywordsCard,
} from "@/components/analyzer/ResultsCards";
import { OutputPanel } from "@/components/analyzer/OutputPanel";
import {
  LoadingState,
  ErrorState,
  EmptyState,
} from "@/components/analyzer/States";

/**
 * Main CV Optimizer application component.
 * Orchestrates locale, theme, and analysis state.
 */
export function CvOptimizerApp() {
  const [locale, setLocale] = useLocale();
  const [theme, setTheme] = useTheme();
  const [selectedProvider, setSelectedProvider] = useState<"claude" | "openai">(
    "claude",
  );

  const analysis = useAnalysis(locale);

  // Handle analysis with selected provider
  const handleAnalyze = async () => {
    await analysis.analyze(
      analysis.cv,
      analysis.jobDescription,
      selectedProvider,
    );
  };

  // Load sample data
  const handleLoadSample = () => {
    const sample = getSampleData(locale);
    analysis.setCV(sample.cv);
    analysis.setJobDescription(sample.jobDescription);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Navbar */}
      <Navbar
        locale={locale}
        theme={theme}
        onLocaleChange={setLocale}
        onThemeChange={(newTheme) => setTheme(newTheme)}
      />

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Input */}
          <div className="lg:col-span-1">
            <InputPanel
              locale={locale}
              cv={analysis.cv}
              jobDescription={analysis.jobDescription}
              loading={analysis.loading}
              onCVChange={analysis.setCV}
              onJobDescriptionChange={analysis.setJobDescription}
              onAnalyze={handleAnalyze}
              onLoadSample={handleLoadSample}
              onClear={analysis.reset}
              selectedProvider={selectedProvider}
              onProviderChange={setSelectedProvider}
            />
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6 lg:col-span-2">
            {analysis.loading ? (
              <LoadingState locale={locale} provider={selectedProvider} />
            ) : analysis.error ? (
              <ErrorState locale={locale} error={analysis.error} />
            ) : !analysis.result ? (
              <EmptyState locale={locale} />
            ) : (
              <>
                {/* Scores */}
                <ScoresSection
                  locale={locale}
                  atsScore={analysis.result.scores.atsScore}
                  keywordCoverage={analysis.result.scores.keywordCoverage}
                  recruiterClarity={analysis.result.scores.recruiterClarity}
                  formatSafety={analysis.result.scores.formatSafety}
                  provider={analysis.result.metadata?.provider}
                  analysisTimeMs={analysis.result.metadata?.analysisTimeMs}
                />

                {/* Flaws and Improvements Grid */}
                <div className="grid gap-6 sm:grid-cols-2">
                  <FlawsCard locale={locale} flaws={analysis.result.flaws} />
                  <ImprovementsCard
                    locale={locale}
                    improvements={analysis.result.improvements}
                  />
                </div>

                {/* Keywords */}
                <KeywordsCard
                  locale={locale}
                  keywords={analysis.result.keywords}
                />

                {/* Output - Optimized CV and Suggestions */}
                <OutputPanel
                  locale={locale}
                  optimizedCv={analysis.result.optimizedCv}
                  suggestions={analysis.result.structuredSuggestions}
                />
              </>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            © 2024 CV Optimizer. Powered by Claude & OpenAI.
          </p>
        </div>
      </footer>
    </div>
  );
}
