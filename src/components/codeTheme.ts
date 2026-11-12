import type { CSSProperties } from "react";
export const monochromeCodeTheme: Record<string, CSSProperties> = {
  'code[class*="language-"]': { color: "#262626", background: "transparent", fontFamily: "ui-monospace,SFMono-Regular,Consolas,monospace", textAlign: "left", whiteSpace: "pre", lineHeight: 1.75 },
  'pre[class*="language-"]': { color: "#262626", background: "#f7f7f7", fontFamily: "ui-monospace,SFMono-Regular,Consolas,monospace", lineHeight: 1.75, overflow: "auto" },
  comment: { color: "#737373", fontStyle: "italic" },
  keyword: { color: "#111111", fontWeight: 650 },
  string: { color: "#404040" },
  function: { color: "#171717", fontWeight: 600 },
  tag: { color: "#171717", fontWeight: 600 },
  punctuation: { color: "#737373" },
};
