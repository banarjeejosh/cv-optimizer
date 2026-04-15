"use client";

import React, { useState } from "react";
import { Locale } from "@/lib/types";
import { i18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OutputPanelProps {
  locale: Locale;
  optimizedCv: string;
  suggestions: string[];
}

/**
 * Output panel displaying optimized CV and structured suggestions.
 */
export function OutputPanel({
  locale,
  optimizedCv,
  suggestions,
}: OutputPanelProps) {
  const messages = i18n[locale];
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(optimizedCv);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="space-y-4">
      {/* Optimized CV Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{messages.optimized_cv_heading}</CardTitle>
            <Button variant="outline" size="sm" onClick={handleCopy}>
              {copied ? "✓ Copied" : messages.copy_button}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="max-h-96 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-4 font-mono text-xs dark:border-gray-700 dark:bg-gray-900">
            <pre className="whitespace-pre-wrap text-gray-900 dark:text-gray-100">
              {optimizedCv}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Suggestions Card */}
      {suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{messages.suggestions_heading}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="flex space-x-3">
                  <span className="flex-shrink-0 text-lg">💡</span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {suggestion}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
