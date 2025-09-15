import React, { createContext, useContext, ReactNode } from "react";

const CSS_PREFIX = "fztable";

// تایپ‌های رنگ‌ها
interface SecondaryColors {
  100: string;
  200: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}

export interface FZTableThemeConfigType {
  blue: string;
  error: string;
  success: string;
  darkgreen: string;
  primary: string;
  white: string;
  background: string;
  secondary: SecondaryColors;
  black: string;
}

// تایپ دقیق برای cssVarNames
type CSSVarNames = {
  blue: string;
  error: string;
  success: string;
  darkgreen: string;
  primary: string;
  white: string;
  background: string;
  black: string;
  secondary100: string;
  secondary200: string;
  secondary400: string;
  secondary500: string;
  secondary600: string;
  secondary700: string;
  secondary800: string;
  secondary900: string;
};

interface FZTableThemeContextType {
  cssVarNames: CSSVarNames;
}

const FZTableThemeContext = createContext<FZTableThemeContextType | null>(null);

// کانفیگ پیش‌فرض
const defaultThemeConfig: FZTableThemeConfigType = {
  blue: "#427BD2",
  error: "#f43f5e",
  success: "#4adb96",
  darkgreen: "#25b973",
  primary: "#ffd61f",
  white: "#ffffff",
  background: "#f7f7f7",
  secondary: {
    100: "#f9f9f9",
    200: "#f5f5f5",
    400: "#e7e7e7",
    500: "#d9d9d9",
    600: "#AFAFAF",
    700: "#7A7A7A",
    800: "#3b3a3a",
    900: "#333333",
  },
  black: "#000000",
};

interface FZTableThemeProviderProps {
  children: ReactNode;
  config?: Partial<FZTableThemeConfigType>;
  cssPrefix?: string;
}

export const FZTableThemeProvider: React.FC<FZTableThemeProviderProps> = ({
  children,
  config = {},
  cssPrefix = CSS_PREFIX,
}) => {
  // ادغام کانفیگ پیش‌فرض با کانفیگ کاربر
  const mergedConfig: FZTableThemeConfigType = {
    ...defaultThemeConfig,
    ...config,
    secondary: {
      ...defaultThemeConfig.secondary,
      ...(config.secondary || {}),
    },
  };

  // نام‌های متغیرهای CSS
  const cssVarNames: CSSVarNames = {
    blue: `--${cssPrefix}-blue`,
    error: `--${cssPrefix}-error`,
    success: `--${cssPrefix}-success`,
    darkgreen: `--${cssPrefix}-darkgreen`,
    primary: `--${cssPrefix}-primary`,
    white: `--${cssPrefix}-white`,
    background: `--${cssPrefix}-background`,
    black: `--${cssPrefix}-black`,
    secondary100: `--${cssPrefix}-secondary-100`,
    secondary200: `--${cssPrefix}-secondary-200`,
    secondary400: `--${cssPrefix}-secondary-400`,
    secondary500: `--${cssPrefix}-secondary-500`,
    secondary600: `--${cssPrefix}-secondary-600`,
    secondary700: `--${cssPrefix}-secondary-700`,
    secondary800: `--${cssPrefix}-secondary-800`,
    secondary900: `--${cssPrefix}-secondary-900`,
  };

  // متغیرهای CSS
  const cssVariables = {
    [cssVarNames.blue]: mergedConfig.blue,
    [cssVarNames.error]: mergedConfig.error,
    [cssVarNames.success]: mergedConfig.success,
    [cssVarNames.darkgreen]: mergedConfig.darkgreen,
    [cssVarNames.primary]: mergedConfig.primary,
    [cssVarNames.white]: mergedConfig.white,
    [cssVarNames.background]: mergedConfig.background,
    [cssVarNames.black]: mergedConfig.black,
    [cssVarNames.secondary100]: mergedConfig.secondary[100],
    [cssVarNames.secondary200]: mergedConfig.secondary[200],
    [cssVarNames.secondary400]: mergedConfig.secondary[400],
    [cssVarNames.secondary500]: mergedConfig.secondary[500],
    [cssVarNames.secondary600]: mergedConfig.secondary[600],
    [cssVarNames.secondary700]: mergedConfig.secondary[700],
    [cssVarNames.secondary800]: mergedConfig.secondary[800],
    [cssVarNames.secondary900]: mergedConfig.secondary[900],
  } as React.CSSProperties;

  return (
    <FZTableThemeContext.Provider value={{ cssVarNames }}>
      <div style={cssVariables}>{children}</div>
    </FZTableThemeContext.Provider>
  );
};

// Hook برای دریافت نام متغیرهای CSS
export const useFZTableCSSVars = () => {
  const context = useContext(FZTableThemeContext);
  if (!context) {
    throw new Error(
      "useFZTableCSSVars must be used within a FZTableThemeProvider"
    );
  }
  return context.cssVarNames;
};

// Helper function برای دسترسی آسان به رنگ‌های secondary
export const useFZTableSecondaryVars = () => {
  const vars = useFZTableCSSVars();
  return {
    secondary100: vars.secondary100,
    secondary200: vars.secondary200,
    secondary400: vars.secondary400,
    secondary500: vars.secondary500,
    secondary600: vars.secondary600,
    secondary700: vars.secondary700,
    secondary800: vars.secondary800,
    secondary900: vars.secondary900,
  };
};
