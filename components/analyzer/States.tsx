"use client";

import React, { useEffect } from "react";
import { Locale } from "@/lib/types";
import { i18n } from "@/lib/i18n";
import { Card, CardContent } from "@/components/ui/card";

interface LoadingStateProps {
  locale: Locale;
  provider: string;
}

/**
 * Loading state with animated spinner.
 */
export function LoadingState({ locale, provider }: LoadingStateProps) {
  const messages = i18n[locale];

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <CardContent className="flex flex-col items-center justify-center space-y-4 py-12">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600 dark:border-blue-800 dark:border-t-blue-400"></div>
        </div>
        <div className="text-center space-y-1">
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {messages.analyzing}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {messages.powered_by || "Powered by"}{" "}
            <span className="font-medium capitalize">{provider}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

interface ErrorStateProps {
  locale: Locale;
  error: string;
}

/**
 * Error state display.
 */
export function ErrorState({ locale, error }: ErrorStateProps) {
  const messages = i18n[locale];

  return (
    <Card className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
      <CardContent className="flex flex-col items-start space-y-3 py-6">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">❌</span>
          <p className="font-semibold text-red-900 dark:text-red-100">
            {messages.error_title || "Error"}
          </p>
        </div>
        <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
      </CardContent>
    </Card>
  );
}

interface EmptyStateProps {
  locale: Locale;
}

/**
 * Empty state when no analysis has been run yet.
 */
export function EmptyState({ locale }: EmptyStateProps) {
  const messages = i18n[locale];

  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center space-y-3 py-12">
        <span className="text-4xl">📄</span>
        <div className="text-center space-y-1">
          <p className="font-semibold text-gray-700 dark:text-gray-300">
            {messages.empty_state || "Ready to analyze?"}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {messages.empty_state_desc ||
              "Enter your CV and job description to get started."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
