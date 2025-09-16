import React, { createContext, useContext, ReactNode } from "react";

const CSS_PREFIX = "fztable";

// تایپ‌های رنگ‌ها
export interface SecondaryColors {
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

// تایپ دقیق برای رنگ‌ها
export type ThemeColors = {
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

// مقادیر پیش‌فرض
export const defaultThemeConfig: FZTableThemeConfigType = {
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

interface FZTableThemeContextType {
  colors: ThemeColors;
}

const FZTableThemeContext = createContext<FZTableThemeContextType | null>(null);

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

  // تعریف رنگ‌ها (مقادیر هگز)
  const colors: ThemeColors = {
    blue: mergedConfig.blue,
    error: mergedConfig.error,
    success: mergedConfig.success,
    darkgreen: mergedConfig.darkgreen,
    primary: mergedConfig.primary,
    white: mergedConfig.white,
    background: mergedConfig.background,
    black: mergedConfig.black,
    secondary100: mergedConfig.secondary[100],
    secondary200: mergedConfig.secondary[200],
    secondary400: mergedConfig.secondary[400],
    secondary500: mergedConfig.secondary[500],
    secondary600: mergedConfig.secondary[600],
    secondary700: mergedConfig.secondary[700],
    secondary800: mergedConfig.secondary[800],
    secondary900: mergedConfig.secondary[900],
  };

  // متغیرهای CSS (برای سازگاری با کدهای قبلی که ممکن است از متغیرهای CSS استفاده کنند)
  const cssVariables = {
    [`--${cssPrefix}-blue`]: mergedConfig.blue,
    [`--${cssPrefix}-error`]: mergedConfig.error,
    [`--${cssPrefix}-success`]: mergedConfig.success,
    [`--${cssPrefix}-darkgreen`]: mergedConfig.darkgreen,
    [`--${cssPrefix}-primary`]: mergedConfig.primary,
    [`--${cssPrefix}-white`]: mergedConfig.white,
    [`--${cssPrefix}-background`]: mergedConfig.background,
    [`--${cssPrefix}-black`]: mergedConfig.black,
    [`--${cssPrefix}-secondary-100`]: mergedConfig.secondary[100],
    [`--${cssPrefix}-secondary-200`]: mergedConfig.secondary[200],
    [`--${cssPrefix}-secondary-400`]: mergedConfig.secondary[400],
    [`--${cssPrefix}-secondary-500`]: mergedConfig.secondary[500],
    [`--${cssPrefix}-secondary-600`]: mergedConfig.secondary[600],
    [`--${cssPrefix}-secondary-700`]: mergedConfig.secondary[700],
    [`--${cssPrefix}-secondary-800`]: mergedConfig.secondary[800],
    [`--${cssPrefix}-secondary-900`]: mergedConfig.secondary[900],
  } as React.CSSProperties;

  return (
    <FZTableThemeContext.Provider value={{ colors }}>
      <div style={cssVariables}>{children}</div>
    </FZTableThemeContext.Provider>
  );
};

// Hook برای دریافت رنگ‌ها
export const useFZTableColors = () => {
  const context = useContext(FZTableThemeContext);
  if (!context) {
    throw new Error(
      "useFZTableColors must be used within a FZTableThemeProvider"
    );
  }
  return context.colors;
};

export const withVar = (cssVar: string) => cssVar;

// Helper function برای دسترسی آسان به رنگ‌های secondary
export const useFZTableSecondaryColors = () => {
  const colors = useFZTableColors();
  return {
    secondary100: colors.secondary100,
    secondary200: colors.secondary200,
    secondary400: colors.secondary400,
    secondary500: colors.secondary500,
    secondary600: colors.secondary600,
    secondary700: colors.secondary700,
    secondary800: colors.secondary800,
    secondary900: colors.secondary900,
  };
};
