import type { ColorTheme, TableTheme } from "./types";
import { darkColorTheme, lightColorTheme } from "./tableConfigs";

function rgb(color: string): number[] | null {
  const value = color.replace(/^#/, "");
  const hex = /^[0-9a-f]{3}$/i.test(value) ? value.split("").map(character => character + character).join("") : value;
  return /^[0-9a-f]{6}$/i.test(hex) ? [0, 2, 4].map(index => parseInt(hex.slice(index, index + 2), 16)) : null;
}
const hex = (values: number[]) => "#" + values.map(value => Math.round(value).toString(16).padStart(2, "0")).join("");
const mix = (values: number[], target: number, ratio: number) => hex(values.map(value => value * (1 - ratio) + target * ratio));
export function contrastColor(color?: string) {
  const values = rgb(color || "");
  if (!values) return "#171717";
  const linear = values.map(value => { const channel = value / 255; return channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4; });
  const luminance = linear[0] * .2126 + linear[1] * .7152 + linear[2] * .0722;
  return luminance > .179 ? "#171717" : "#ffffff";
}
export function resolveTheme(theme: TableTheme = "light", overrides?: ColorTheme): ColorTheme {
  let colors = theme === "dark" ? darkColorTheme : lightColorTheme;
  const base = theme.startsWith("#") ? rgb(theme) : null;
  if (base) {
    const dark = contrastColor(theme) === "#ffffff";
    colors = {
      backgroundColor: hex(base), headerBackgroundColor: mix(base, dark ? 255 : 0, dark ? .09 : .05),
      borderColor: mix(base, dark ? 255 : 0, dark ? .28 : .2),
      headerTextColor: dark ? "#ffffff" : "#171717", cellTextColor: dark ? "#f5f5f5" : "#262626",
      primaryColor: mix(base, dark ? 255 : 0, .82),
    };
  }
  const merged = { ...colors, ...overrides };
  return { ...merged, primaryTextColor: overrides?.primaryTextColor || contrastColor(merged.primaryColor) };
}
