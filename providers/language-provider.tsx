"use client";

import { createContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { ar } from "@/locales/ar";
import { en } from "@/locales/en";

export type Language = "en" | "ar";
type WidenStrings<T> = T extends string ? string : { [K in keyof T]: WidenStrings<T[K]> };
type Dictionary = WidenStrings<typeof en>;

const LANGUAGE_KEY = "coach-faisal-padel-lab:language";

export const LanguageContext = createContext<{
  language: Language;
  direction: "ltr" | "rtl";
  t: Dictionary;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
}>({
  language: "en",
  direction: "ltr",
  t: en,
  setLanguage: () => undefined,
  toggleLanguage: () => undefined
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem(LANGUAGE_KEY);
    if (stored === "ar" || stored === "en") setLanguageState(stored);
  }, []);

  function setLanguage(next: Language) {
    setLanguageState(next);
    window.localStorage.setItem(LANGUAGE_KEY, next);
    document.documentElement.lang = next;
    document.documentElement.dir = next === "ar" ? "rtl" : "ltr";
  }

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  const value = useMemo(() => ({
    language,
    direction: language === "ar" ? "rtl" as const : "ltr" as const,
    t: language === "ar" ? ar : en,
    setLanguage,
    toggleLanguage: () => setLanguage(language === "ar" ? "en" : "ar")
  }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
