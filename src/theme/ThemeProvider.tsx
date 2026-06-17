import React, { createContext, useState, useEffect } from "react";
import { colors } from "./colors";
import { ThemeTokens, theme as themeConfig } from "./theme";

export interface ThemeContextType {
  theme: "light" | "dark";
  themeMode: "light" | "dark" | "system";
  tokens: ThemeTokens;
  toggleTheme: () => void;
  setTheme: (newTheme: "light" | "dark") => void;
  setThemeMode: (mode: "light" | "dark" | "system") => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load saved preference or default to "light" for new users on first visit
  const [themeMode, setThemeModeState] = useState<"light" | "dark" | "system">(() => {
    const saved = localStorage.getItem("skillcollab_theme_mode");
    if (saved === "light" || saved === "dark" || saved === "system") {
      return saved;
    }
    // Also support fallback from old skillcollab_theme key
    const oldSaved = localStorage.getItem("skillcollab_theme");
    if (oldSaved === "light" || oldSaved === "dark") {
      return oldSaved;
    }
    return "light"; // Always default to light mode on first visit
  });

  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">(() => {
    if (themeMode === "system") {
      if (typeof window !== "undefined") {
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      }
      return "light";
    }
    return themeMode;
  });

  // Track system-wide dark/light preference adjustments
  useEffect(() => {
    if (themeMode !== "system") {
      setResolvedTheme(themeMode);
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      setResolvedTheme(mediaQuery.matches ? "dark" : "light");
    };

    setResolvedTheme(mediaQuery.matches ? "dark" : "light");
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [themeMode]);

  const tokens = themeConfig[resolvedTheme];

  // Apply theme class and CSS variables to documentElement
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(resolvedTheme);
    root.style.colorScheme = resolvedTheme;
    
    // Apply exact semantic tokens as CSS variables
    const activeTokens = themeConfig[resolvedTheme];
    Object.entries(activeTokens).forEach(([key, value]) => {
      // camelCase to kebab-case
      const cssKey = `--${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
      root.style.setProperty(cssKey, value as string);
    });
  }, [resolvedTheme]);

  const setThemeMode = (mode: "light" | "dark" | "system") => {
    setThemeModeState(mode);
    localStorage.setItem("skillcollab_theme_mode", mode);
  };

  const toggleTheme = () => {
    const nextMode = resolvedTheme === "light" ? "dark" : "light";
    setThemeMode(nextMode);
  };

  const setTheme = (newTheme: "light" | "dark") => {
    setThemeMode(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ 
      theme: resolvedTheme, 
      themeMode, 
      tokens, 
      toggleTheme, 
      setTheme,
      setThemeMode 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
