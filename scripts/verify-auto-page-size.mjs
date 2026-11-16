import { build } from "esbuild";
import { chromium } from "@playwright/test";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import assert from "node:assert/strict";

const bundle = await build({ stdin: { contents: `
  import React from 'react';
  import { createRoot } from 'react-dom/client';
  import Table from './dist/index.mjs';
  function App() {
    const [expanded, setExpanded] = React.useState(false);
    return React.createElement(Table, {
      mode: 'static', staticRows: Array.from({length:100}, (_,id)=>({id})),
      columns: [{data:'id',title:'ID'}], autoPageSizeConfig:{enabled:true},
      filters: React.createElement('div', null,
        React.createElement('button', {id:'toggle',onClick:()=>setExpanded(!expanded)}, 'Toggle filters'),
        expanded && React.createElement('div', {style:{height:140}}, 'Extra filters'))
    });
  }
  createRoot(document.getElementById('root')).render(React.createElement(App));
`, resolveDir: process.cwd() }, bundle: true, write: false, format: "iife", platform: "browser" });
const executablePath = process.env.RELEASE_CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const browser = await chromium.launch({ headless: true, ...(existsSync(executablePath) ? { executablePath } : {}) });
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.setContent('<style>body{margin:0;padding:24px} #root{margin-top:60px}</style><div id="root"></div>');
  await page.addStyleTag({ content: readFileSync("dist/styles.css", "utf8") });
  await page.addScriptTag({ content: bundle.outputFiles[0].text });
  const metrics = () => page.evaluate(() => ({
    count: document.querySelectorAll('.desktop-table-data-row').length,
    footerBottom: document.querySelector('.table-footer').getBoundingClientRect().bottom,
    viewport: innerHeight,
  }));
  await page.waitForFunction(() => document.querySelectorAll('.desktop-table-data-row').length > 5);
  // Wait for layout observers and state updates to settle.
  await page.waitForTimeout(300);
  const initial = await metrics();
  assert(initial.footerBottom <= initial.viewport + 1, JSON.stringify(initial));
  await page.locator('#toggle').click();
  await page.waitForFunction(count => document.querySelectorAll('.desktop-table-data-row').length < count, initial.count);
  await page.waitForTimeout(300);
  const filtered = await metrics();
  assert(filtered.footerBottom <= filtered.viewport + 1, JSON.stringify(filtered));
  await page.setViewportSize({ width: 1200, height: 650 });
  await page.waitForFunction(count => document.querySelectorAll('.desktop-table-data-row').length < count, filtered.count);
  await page.waitForTimeout(300);
  const resized = await metrics();
  assert(resized.footerBottom <= resized.viewport + 1, JSON.stringify(resized));
  assert.deepEqual(errors, []);
  const result = { date: new Date().toISOString().slice(0, 10), initial, filtered, resized,
    browser: await browser.version(), scope: "Local desktop Chrome layout; full release matrix not rerun" };
  writeFileSync("docs/auto-page-size-verification.json", JSON.stringify(result, null, 2) + "\n");
  console.log(JSON.stringify(result));
} finally { await browser.close(); }
