import typescript from "@rollup/plugin-typescript";
import { dts } from "rollup-plugin-dts";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import postcss from "postcss";
const require = createRequire(import.meta.url);
const external = id => !id.startsWith(".") && !id.startsWith("/") && !/^[A-Za-z]:/.test(id);
const cssImport = id => id.endsWith(".css") || id.startsWith("swiper/css");
function styles() {
  const files = new Map();
  return {
    name: "library-styles",
    resolveId(id, importer) {
      if (!cssImport(id)) return;
      return id.startsWith(".") ? resolve(dirname(importer), id) : require.resolve(id);
    },
    load(id) {
      if (!id.endsWith(".css")) return;
      files.set(id, readFileSync(id, "utf8"));
      return "";
    },
    generateBundle() {
      const css = postcss.parse(Array.from(files.values()).join("\n"));
      const animationNames = new Map();
      css.walkAtRules(/keyframes$/, rule => {
        animationNames.set(rule.params, `rrdt-${rule.params}`);
        rule.params = `rrdt-${rule.params}`;
      });
      css.walkDecls(/^animation(?:-name)?$/, declaration => {
        for (const [name, scoped] of animationNames) declaration.value = declaration.value.replace(new RegExp(`\\b${name}\\b`, "g"), scoped);
      });
      css.walkRules(rule => {
        if (rule.parent.type === "atrule" && /keyframes$/i.test(rule.parent.name)) return;
        rule.selectors = rule.selectors.flatMap(original => {
          const selector = original.replace(/:root/g, ".rrdt");
          return [`:where(.rrdt) ${selector}`, ...(selector.startsWith(".") ? [`:where(.rrdt)${selector}`] : [])];
        });
      });
      this.emitFile({ type: "asset", fileName: "styles.css", source: css.toString() });
      this.emitFile({ type: "asset", fileName: "Vazirmatn-OFL.txt", source: readFileSync("src/components/table/export/Vazirmatn-OFL.txt", "utf8") });
    },
  };
}
export default [
  {
    input: "src/index.ts",
    output: { dir: "dist", entryFileNames: "index.mjs", chunkFileNames: "chunks/[name]-[hash].mjs", format: "esm", sourcemap: true, banner: '\"use client\";' },
    external: id => external(id) && !cssImport(id),
    plugins: [styles(), typescript({ tsconfig: "tsconfig.lib.json" })],
    onwarn(warning, warn) {
      if (warning.code === "MODULE_LEVEL_DIRECTIVE" && warning.message.includes("use client")) return;
      warn(warning);
    },
  },
  { input: "src/index.ts", output: { file: "dist/index.d.ts", format: "esm" },
    external: id => external(id) || cssImport(id), plugins: [dts()] },
];
