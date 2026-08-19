"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type Theme = "light" | "dark";

type ColorMode =
  | "amber"
  | "blue"
  | "pink"
  | "rose"
  | "emerald"
  | "black";

type ThemeContextType = {
  theme: Theme;
  colorMode: ColorMode;
  setTheme: (theme: Theme) => void;
  setColorMode: (colorMode: ColorMode) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined,
);

export function ThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [colorMode, setColorModeState] =
    useState<ColorMode>("blue");

  useEffect(() => {
    const savedTheme = localStorage.getItem(
      "theme",
    ) as Theme | null;

    const savedColorMode = localStorage.getItem(
      "colorMode",
    ) as ColorMode | null;

    if (savedTheme) {
      setThemeState(savedTheme);
    }

    if (savedColorMode) {
      setColorModeState(savedColorMode);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      theme === "dark",
    );

    document.documentElement.setAttribute(
      "data-color-mode",
      colorMode,
    );
  }, [theme, colorMode]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const setColorMode = (newColorMode: ColorMode) => {
    setColorModeState(newColorMode);
    localStorage.setItem(
      "colorMode",
      newColorMode,
    );
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        colorMode,
        setTheme,
        setColorMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider",
    );
  }

  return context;
}