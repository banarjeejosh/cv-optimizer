"use client";

import React from "react";
import { Locale } from "@/lib/types";
import { i18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  locale: Locale;
  theme: string;
  onLocaleChange: (locale: Locale) => void;
  onThemeChange: (theme: "light" | "dark") => void;
}

/**
 * Navigation bar with language toggle and theme switcher.
 */
export function Navbar({
  locale,
  theme,
  onLocaleChange,
  onThemeChange,
}: NavbarProps) {
  const messages = i18n[locale];

  return (
    <nav className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Title */}
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">
              CV
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {messages.app_title}
            </h1>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            {/* Language toggle */}
            <div className="flex space-x-1 rounded-lg border border-gray-300 bg-gray-100 p-1 dark:border-gray-700 dark:bg-gray-900">
              <button
                onClick={() => onLocaleChange("en")}
                className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${
                  locale === "en"
                    ? "bg-white text-gray-900 shadow-sm dark:bg-gray-800 dark:text-white"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                English
              </button>
              <button
                onClick={() => onLocaleChange("de")}
                className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${
                  locale === "de"
                    ? "bg-white text-gray-900 shadow-sm dark:bg-gray-800 dark:text-white"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                Deutsch
              </button>
            </div>

            {/* Dark mode toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                onThemeChange(theme === "light" ? "dark" : "light")
              }
              className="w-10 p-0"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <span className="text-lg">🌙</span>
              ) : (
                <span className="text-lg">☀️</span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
