"use client";

import React from "react";
import { Locale } from "@/lib/types";
import { i18n } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FlawsCardProps {
  locale: Locale;
  flaws: string[];
}

/**
 * Card displaying detected CV flaws/issues.
 */
export function FlawsCard({ locale, flaws }: FlawsCardProps) {
  const messages = i18n[locale];

  if (flaws.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{messages.flaws_heading}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-green-600 dark:text-green-400">
            {messages.no_flaws_message}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{messages.flaws_heading}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {flaws.map((flaw, index) => (
            <li key={index} className="flex space-x-3">
              <span className="flex-shrink-0 text-red-600 dark:text-red-400">
                ⚠️
              </span>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {flaw}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

interface ImprovementsCardProps {
  locale: Locale;
  improvements: string[];
}

/**
 * Card displaying suggested improvements.
 */
export function ImprovementsCard({
  locale,
  improvements,
}: ImprovementsCardProps) {
  const messages = i18n[locale];

  if (improvements.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{messages.improvements_heading}</CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="space-y-2">
          {improvements.map((improvement, index) => (
            <li key={index} className="flex space-x-3">
              <span className="flex-shrink-0 font-semibold text-blue-600 dark:text-blue-400">
                {index + 1}.
              </span>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {improvement}
              </span>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}

interface KeywordsCardProps {
  locale: Locale;
  keywords: {
    extracted: string[];
    matched: string[];
    missing: string[];
  };
}

/**
 * Card displaying keyword analysis (matched and missing).
 */
export function KeywordsCard({ locale, keywords }: KeywordsCardProps) {
  const messages = i18n[locale];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{messages.keywords_heading}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Matched Keywords */}
        <div>
          <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            {messages.matched_keywords} ({keywords.matched.length}/
            {keywords.extracted.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {keywords.matched.length === 0 ? (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {messages.no_matched}
              </span>
            ) : (
              keywords.matched.map((keyword) => (
                <span
                  key={keyword}
                  className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200"
                >
                  ✓ {keyword}
                </span>
              ))
            )}
          </div>
        </div>

        {/* Missing Keywords */}
        <div>
          <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            {messages.missing_keywords} ({keywords.missing.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {keywords.missing.length === 0 ? (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {messages.no_missing}
              </span>
            ) : (
              keywords.missing.map((keyword) => (
                <span
                  key={keyword}
                  className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-200"
                >
                  ✕ {keyword}
                </span>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
