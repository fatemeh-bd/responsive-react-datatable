import { readFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
for (const file of [pkg.main, pkg.module, pkg.types, pkg.exports["./styles.css"]]) {
  assert(existsSync(file), `Missing package target: ${file}`);
}
const js = readFileSync(pkg.module, "utf8");
assert(js.startsWith('"use client";'), "Client boundary must survive bundling");
assert(!/from ['"](?:.*\.css|swiper\/css[^'"]*)['"]/.test(js), "JS must not import browser CSS on the server");
const exports = await import(new URL("../dist/index.mjs", import.meta.url));
for (const name of ["default", "Table", "rowRenderer", "ActionDropDown"]) assert(exports[name], `Missing export ${name}`);
assert.equal(exports.default, exports.Table);
const html = renderToString(createElement(exports.Table, { mode: "static", columns: [{ title: "Name", data: "name" }], staticRows: [{ id: 0, name: "Package SSR" }], saveSearch: true, tableName: "ssr" }));
assert(html.includes("Package SSR"));
assert(renderToString(createElement(exports.ActionDropDown, { options: [] })).includes("Actions"));
const files = JSON.parse(execFileSync(process.execPath, [process.env.npm_execpath, "pack", "--dry-run", "--ignore-scripts", "--json"], { encoding: "utf8" }))[0].files.map(file => file.path);
for (const file of files) assert(!/^dist\/(?:assets\/|index\.html|.*\.(?:gif|png))/.test(file), `Demo leaked into package: ${file}`);
assert(files.includes("LICENSE"));
console.log(`Package surface and Node SSR verified (${files.length} packed files).`);
