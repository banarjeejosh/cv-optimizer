"use client";

import React from "react";
import { Locale } from "@/lib/types";
import { i18n } from "@/lib/i18n";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface ScoreCardProps {
  label: string;
  value: number;
  description?: string;
}

/**
 * Individual score card component.
 */
function ScoreCard({ label, value, description }: ScoreCardProps) {
  const percentage = Math.round(value);
  const percentageClass =
    percentage >= 75
      ? "text-green-600 dark:text-green-400"
      : percentage >= 50
        ? "text-yellow-600 dark:text-yellow-400"
        : "text-red-600 dark:text-red-400";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </span>
        <span className={`text-2xl font-bold ${percentageClass}`}>
          {percentage}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className={`h-full transition-all ${
            percentage >= 75
              ? "bg-green-500"
              : percentage >= 50
                ? "bg-yellow-500"
                : "bg-red-500"
          }`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      {description && (
        <p className="text-xs text-gray-600 dark:text-gray-400">
          {description}
        </p>
      )}
    </div>
  );
}

interface ScoresSectionProps {
  locale: Locale;
  atsScore: number;
  keywordCoverage: number;
  recruiterClarity: number;
  formatSafety: number;
  provider?: string;
  analysisTimeMs?: number;
}

/**
 * Scores section displaying all four analysis scores.
 */
export function ScoresSection({
  locale,
  atsScore,
  keywordCoverage,
  recruiterClarity,
  formatSafety,
  provider,
  analysisTimeMs,
}: ScoresSectionProps) {
  const messages = i18n[locale];

  const overallScore = Math.round(
    (atsScore + keywordCoverage + recruiterClarity + formatSafety) / 4,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{messages.scores_heading}</CardTitle>
        {provider && (
          <CardDescription>
            {messages.analyzed_by || "Analyzed by"} {provider}
            {analysisTimeMs && ` (${(analysisTimeMs / 1000).toFixed(2)}s)`}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Score */}
        <div className="space-y-2 border-b pb-6 dark:border-gray-800">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {messages.overall_score}
            </p>
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
              {overallScore}
            </div>
          </div>
        </div>

        {/* Individual Scores */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <ScoreCard
            label={messages.ats_score}
            value={atsScore}
            description={messages.ats_description}
          />
          <ScoreCard
            label={messages.keyword_coverage}
            value={keywordCoverage}
            description={messages.keyword_description}
          />
          <ScoreCard
            label={messages.recruiter_clarity}
            value={recruiterClarity}
            description={messages.clarity_description}
          />
          <ScoreCard
            label={messages.format_safety}
            value={formatSafety}
            description={messages.format_description}
          />
        </div>
      </CardContent>
    </Card>
  );
}
