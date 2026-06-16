import React, { createContext, useState, useEffect } from "react";
import { colors } from "./colors";
import { ThemeTokens, theme as themeConfig } from "./theme";

export interface ThemeContextType {
  theme: "light" | "dark";
  tokens: ThemeTokens;
  toggleTheme: () => void;
  setTheme: (newTheme: "light" | "dark") => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load saved preference or default to "light" for new users on first visit
  const [themeName, setThemeName] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("skillcollab_theme");
    if (saved === "light" || saved === "dark") {
      return saved;
    }
    return "light"; // Always default to light mode
  });

  const tokens = themeConfig[themeName];

  // Apply theme class and CSS variables to documentElement
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(themeName);
    root.style.colorScheme = themeName;
    
    // Persist to local storage
    localStorage.setItem("skillcollab_theme", themeName);

    // Apply exact semantic tokens as CSS variables
    const activeTokens = themeConfig[themeName];
    Object.entries(activeTokens).forEach(([key, value]) => {
      // camelCase to kebab-case
      const cssKey = `--${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
      root.style.setProperty(cssKey, value as string);
    });
  }, [themeName]);

  const toggleTheme = () => {
    setThemeName((prev) => (prev === "light" ? "dark" : "light"));
  };

  const setTheme = (newTheme: "light" | "dark") => {
    setThemeName(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme: themeName, tokens, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
