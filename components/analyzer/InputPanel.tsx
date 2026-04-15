"use client";

import React from "react";
import { Locale } from "@/lib/types";
import { i18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface InputPanelProps {
  locale: Locale;
  cv: string;
  jobDescription: string;
  loading: boolean;
  onCVChange: (cv: string) => void;
  onJobDescriptionChange: (jobDescription: string) => void;
  onAnalyze: () => void;
  onLoadSample: () => void;
  onClear: () => void;
  selectedProvider: "claude" | "openai";
  onProviderChange: (provider: "claude" | "openai") => void;
}

/**
 * Input panel for CV and job description with action buttons.
 */
export function InputPanel({
  locale,
  cv,
  jobDescription,
  loading,
  onCVChange,
  onJobDescriptionChange,
  onAnalyze,
  onLoadSample,
  onClear,
  selectedProvider,
  onProviderChange,
}: InputPanelProps) {
  const messages = i18n[locale];

  const isValid = cv.trim().length > 0 && jobDescription.trim().length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{messages.input_header}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* AI Provider Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {messages.ai_provider || "AI Provider"}
          </label>
          <div className="flex space-x-2">
            <Button
              variant={selectedProvider === "claude" ? "default" : "outline"}
              size="sm"
              onClick={() => onProviderChange("claude")}
            >
              Claude
            </Button>
            <Button
              variant={selectedProvider === "openai" ? "default" : "outline"}
              size="sm"
              onClick={() => onProviderChange("openai")}
            >
              OpenAI
            </Button>
          </div>
        </div>

        {/* CV Input */}
        <div className="space-y-2">
          <label
            htmlFor="cv"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {messages.cv_input_label}
          </label>
          <Textarea
            id="cv"
            placeholder={messages.cv_input_placeholder}
            value={cv}
            onChange={(e) => onCVChange(e.target.value)}
            disabled={loading}
            className="font-mono text-xs"
          />
        </div>

        {/* Job Description Input */}
        <div className="space-y-2">
          <label
            htmlFor="job"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {messages.job_input_label}
          </label>
          <Textarea
            id="job"
            placeholder={messages.job_input_placeholder}
            value={jobDescription}
            onChange={(e) => onJobDescriptionChange(e.target.value)}
            disabled={loading}
            className="font-mono text-xs"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={onAnalyze}
            disabled={!isValid || loading}
            className="flex-1 sm:flex-initial"
          >
            {loading ? (
              <>
                <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                {messages.analyzing}
              </>
            ) : (
              messages.analyze_button
            )}
          </Button>
          <Button variant="outline" onClick={onLoadSample} disabled={loading}>
            {messages.load_sample}
          </Button>
          <Button variant="ghost" onClick={onClear} disabled={loading}>
            {messages.clear}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
