// Install the real tarball into isolated consumers; never changes the root install.
import { cpSync, existsSync, lstatSync, mkdirSync, readFileSync, realpathSync, rmSync, writeFileSync } from "node:fs";
import { spawn, execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import assert from "node:assert/strict";
import { createServer } from "node:net";
import { chromium } from "@playwright/test";
import { unzipSync, strFromU8 } from "fflate";
const root = fileURLToPath(new URL("../", import.meta.url));
const output = join(root, ".release-tests"); mkdirSync(output, { recursive: true });
const npmCli = process.env.npm_execpath;
if (!npmCli) throw new Error("Run via npm run test:release");
assert(existsSync(join(root, "dist/index.mjs")) && existsSync(join(root, "dist/index.d.ts")), "Run npm run build successfully first");
const run = (args, cwd, env = {}) => new Promise((resolveRun, reject) => {
  const child = spawn(process.execPath, args, { cwd, stdio: "inherit", env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1", ...env }, windowsHide: true });
  child.once("error", reject);
  child.once("exit", code => code === 0 ? resolveRun() : reject(new Error(`${args.join(" ")} exited ${code}`)));
});
const npm = (args, cwd) => run([npmCli, ...args, "--registry=https://registry.npmjs.org/", "--cache", join(root, ".npm-cache")], cwd);
const packed = JSON.parse(execFileSync(process.execPath, [npmCli, "pack", "--json", "--ignore-scripts", "--pack-destination", output], { cwd: root, encoding: "utf8" }))[0];
const uniqueTarball = join(output, packed.filename.replace(/\.tgz$/, `-${packed.shasum.slice(0, 12)}.tgz`));
cpSync(join(output, packed.filename), uniqueTarball);
const tarball = `file:${uniqueTarball.replaceAll("\\", "/")}`;
const cacheName = process.env.RELEASE_FIXTURE_CACHE || "consumers";
assert(/^[\w-]+$/.test(cacheName), "Fixture cache must be a directory name inside .release-tests");
const runRoot = join(output, cacheName); mkdirSync(runRoot, { recursive: true });
const results = [];
const tsconfig = { compilerOptions: { target: "ES2020", lib: ["dom", "esnext"], jsx: "react-jsx", strict: true,
  skipLibCheck: true, esModuleInterop: true, module: "ESNext", moduleResolution: "bundler", noEmit: true }, include: ["consumer.tsx"] };
function consumer(name, react, next) {
  const cwd = join(runRoot, name); mkdirSync(cwd, { recursive: true });
  writeFileSync(join(cwd, "package.json"), JSON.stringify({ name: `release-${name}`, private: true, type: "module",
    dependencies: { "react-responsive-datatable-kit": tarball, react, "react-dom": react, ...(next ? { next } : {}) },
    devDependencies: { typescript: "^5.9.3", "@types/react": react.startsWith("18") ? "^18" : "^19", "@types/react-dom": react.startsWith("18") ? "^18" : "^19", "@types/node": "^22",
      ...(!next ? { vitest: "^5.1.0", jsdom: "^26.1.0", "@testing-library/react": "^16.3.0", axios: "^1.21.0", fflate: "^0.8.2", jspdf: "^4.2.1", "jspdf-autotable": "^5.0.9" } : {}) } }, null, 2));
  cpSync(join(root, "tests/fixtures/consumer.tsx"), join(cwd, "consumer.tsx"));
  writeFileSync(join(cwd, "tsconfig.json"), JSON.stringify(tsconfig));
  return cwd;
}
for (const [name, react] of [["react18-min", "18.0.0"], ["react18", "18.3.1"], ["react19-min", "19.0.0"], ["react19", "19"]]) {
  const cwd = consumer(name, react);
  cpSync(join(root, "tests"), join(cwd, "tests"), { recursive: true });
  cpSync(join(root, "src"), join(cwd, "src"), { recursive: true });
  writeFileSync(join(cwd, "vitest.config.mjs"), 'import {defineConfig} from "vitest/config"; export default defineConfig({test:{server:{deps:{inline:["react-responsive-datatable-kit"]}},environment:"jsdom",include:["tests/**/*.test.{ts,tsx}"],setupFiles:["./tests/setup.ts"],restoreMocks:true}});');
  await npm(["install"], cwd);
  await run([join(cwd, "node_modules/typescript/bin/tsc"), "--noEmit"], cwd);
  await run([join(cwd, "node_modules/typescript/bin/tsc"), "--noEmit", "--module", "NodeNext", "--moduleResolution", "NodeNext"], cwd);
  await run([join(cwd, "node_modules/vitest/vitest.mjs"), "run"], cwd);
  const manifest = JSON.parse(readFileSync(join(cwd, "node_modules/react/package.json")));
  results.push({ name, react: manifest.version, tests: "passed", types: "bundler + NodeNext passed" });
}
let browser;
try {
  const systemChrome = process.env.RELEASE_CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";
  browser = await chromium.launch({ headless: true, ...(existsSync(systemChrome) ? { executablePath: systemChrome } : {}) });
  for (const [name, react, next, router] of [["next15-pages", "18.3.1", "15", "pages"], ["next15-app", "19", "15", "app"], ["next16-app", "19", "16", "app"]]) {
    const cwd = consumer(name, react, next);
    await npm(["install"], cwd);
    const pageSource = readFileSync(join(root, "tests/fixtures/next/app/page.tsx"), "utf8");
    cpSync(join(root, "tests/fixtures/next/Interactive.tsx"), join(cwd, "Interactive.tsx"));
    cpSync(join(root, "tests/fixtures/next/Features.tsx"), join(cwd, "Features.tsx"));
    mkdirSync(join(cwd, router), { recursive: true });
    writeFileSync(join(cwd, router, router === "app" ? "page.tsx" : "index.tsx"), pageSource);
    cpSync(join(root, `tests/fixtures/next/${router}/${router === "app" ? "layout.tsx" : "_app.tsx"}`), join(cwd, router, router === "app" ? "layout.tsx" : "_app.tsx"));
    cpSync(join(root, "tests/fixtures/next/next.config.mjs"), join(cwd, "next.config.mjs"));
    writeFileSync(join(cwd, "tsconfig.json"), JSON.stringify({ ...tsconfig, include: ["**/*.tsx", "next-env.d.ts", ".next/types/**/*.ts"], exclude: ["node_modules"] }));
    const nextOutput = resolve(cwd, ".next");
    if (existsSync(nextOutput)) {
      assert(dirname(nextOutput) === resolve(cwd) && !lstatSync(nextOutput).isSymbolicLink() && realpathSync(nextOutput).toLowerCase() === nextOutput.toLowerCase(), "Unexpected Next build output path");
      // Next may cache a prior local tarball with the same candidate version.
      rmSync(nextOutput, { recursive: true, force: true });
    }
    await run([join(cwd, "node_modules/next/dist/bin/next"), "build", ...(next === "16" ? ["--webpack"] : [])], cwd);
    const port = await new Promise(resolvePort => { const server = createServer(); server.listen(0, "127.0.0.1", () => { const port = server.address().port; server.close(() => resolvePort(port)); }); });
    const child = spawn(process.execPath, [join(cwd, "node_modules/next/dist/bin/next"), "start", "-p", String(port)], { cwd, stdio: ["ignore", "pipe", "pipe"], windowsHide: true, env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" } });
    let log = ""; child.stdout.on("data", data => { log += data; }); child.stderr.on("data", data => { log += data; });
    try {
      const url = `http://127.0.0.1:${port}`;
      let html = "";
      for (let attempt = 0; attempt < 100; attempt++) {
        if (child.exitCode !== null) throw new Error(log);
        try { const response = await fetch(url); if (response.ok) { html = await response.text(); break; } } catch {}
        await new Promise(resolveWait => setTimeout(resolveWait, 200));
      }
      assert(html.includes("Packed React"), `${name}: SSR rows missing`);
      for (const mobile of [false, true]) {
        const page = await browser.newPage({ viewport: { width: mobile ? 375 : 1280, height: 800 } });
        // The fixture has no favicon; its absence is unrelated to package assets.
        await page.route("**/favicon.ico", route => route.fulfill({ status: 204, body: "" }));
        let requestAttempts = 0;
        await page.route("**/api/retry-fixture*", route => route.fulfill({ status: 200, contentType: "application/json",
          body: JSON.stringify(++requestAttempts === 1 ? { data: "invalid" } :
            { data: [{ id: 7, name: "Recovered person" }], recordsFiltered: 1 }) }));
        const errors = []; page.on("pageerror", error => errors.push(error.message));
        page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
        await page.goto(url); await page.getByText("Packed React", { exact: true }).waitFor();
        const recovery = page.getByRole("region", { name: "Request recovery" });
        await recovery.getByRole("alert").waitFor();
        assert.equal(await recovery.getByRole("alert").evaluate(el => getComputedStyle(el).borderRadius), "12px");
        await recovery.getByRole("button", { name: "Try again" }).click();
        await recovery.getByText("Recovered person", { exact: true }).waitFor();
        assert.equal(requestAttempts, 2, "A failed request can be retried without notify or a host provider");
        assert(await page.locator(".interactive-person-row").count() > 0, "Custom row classes must survive responsive rendering");
        if (!mobile) {
          const stability = page.getByRole("region", { name: "Loading layout stability" });
          const beforeLoading = await stability.evaluate(async region => {
            const scroller = region.querySelector(".desktop-table-body-container");
            const widths = () => Array.from(region.querySelectorAll("th")).map(cell => cell.getBoundingClientRect().width);
            const initial = widths(); let overflow = 0; let scaled = false;
            const start = performance.now();
            while (performance.now() - start < 2200) {
              overflow = Math.max(overflow, scroller.scrollWidth - scroller.clientWidth);
              scaled ||= Array.from(region.querySelectorAll(".skleton-class")).some(el => getComputedStyle(el).transform !== "none");
              await new Promise(resolve => setTimeout(resolve, 40));
            }
            return { widths: initial, overflow, scaled, rowHeight: region.querySelector(".desktop-table-skeleton-row").getBoundingClientRect().height };
          });
          assert(beforeLoading.overflow <= 1 && !beforeLoading.scaled, "Skeleton animation must not cause horizontal overflow");
          await stability.getByRole("button", { name: "Toggle table loading" }).click();
          await stability.getByText("Roya", { exact: true }).waitFor();
          const afterLoading = await stability.evaluate(region => ({
            widths: Array.from(region.querySelectorAll("th")).map(cell => cell.getBoundingClientRect().width),
            rowHeight: region.querySelector(".desktop-table-data-row").getBoundingClientRect().height,
          }));
          assert(beforeLoading.widths.every((width, index) => Math.abs(width - afterLoading.widths[index]) <= 1), "Column widths must survive the loading transition");
          assert(Math.abs(beforeLoading.rowHeight - afterLoading.rowHeight) <= 1, "Loading and data row heights must match");
          const sortIcon = await page.locator(".desktop-table-sort-icons svg").first().boundingBox();
          assert(sortIcon && sortIcon.width <= 10 && sortIcon.height <= 7, "Sort indicators must stay compact");
          assert.equal(await page.locator(".desktop-table-container").first().evaluate(el => getComputedStyle(el).borderRadius), "12px");
          await page.locator(".table-container").first().getByRole("button", { name: "Next page", exact: true }).click();
          await page.getByText("Next consumer", { exact: true }).waitFor();
          assert(await page.getByText("Next consumer", { exact: true }).evaluate(el => {
            const cell = el.getBoundingClientRect(), scroller = el.closest(".desktop-table-body-container").getBoundingClientRect();
            return cell.top >= scroller.top && cell.bottom <= scroller.bottom + 1;
          }), "The data row must be visible below the sticky header");
        } else await page.locator(".mobile-table-card").first().waitFor();
        await page.getByRole("button", { name: "Actions", exact: true }).click();
        await page.getByRole("menuitem", { name: "Documentation" }).waitFor();
        await page.keyboard.press("Escape");
        await page.locator(".selectableCheckbox").first().click();
        assert(await page.locator(".table-search-icon").first().evaluate(el => el.getBoundingClientRect().width <= 32), "Search icon must fit the input without Tailwind");
        assert.equal(await page.getByLabel("Selected IDs").textContent(), "0");
        const checkMark = page.locator(".selectableCheckbox .checkbox-control").first();
        assert.equal(await checkMark.evaluate(el => getComputedStyle(el, "::after").content), '""');
        await page.waitForFunction(() => getComputedStyle(document.querySelector(".selectableCheckbox .checkbox-control"), "::after").opacity === "1");
        assert.equal(await page.locator('section[aria-label="Interactive client wrapper"] [dir="rtl"]').count(), 1);
        const features = page.getByRole("region", { name: "New table features", exact: true });
        await features.getByRole("button", { name: "Expand row", exact: true }).click();
        await features.getByRole("region", { name: "Row details", exact: true }).getByText("جزئیات ردیف اول").waitFor();
        await features.getByRole("button", { name: "Export", exact: true }).click();
        const exportDialog = page.getByRole("dialog", { name: "Export", exact: true });
        for (const format of ["csv", "xlsx", "pdf"]) {
          const downloadPromise = page.waitForEvent("download");
          await exportDialog.getByRole("button", { name: format === "xlsx" ? "Excel (.xlsx)" : format.toUpperCase(), exact: true }).click();
          const download = await downloadPromise;
          const path = join(cwd, `exports-${mobile ? "mobile" : "desktop"}.${format}`);
          await download.saveAs(path);
          const bytes = readFileSync(path);
          if (format === "csv") { assert(bytes.toString("utf8").includes("Roya")); assert(!bytes.toString("utf8").includes("@example.com")); }
          if (format === "xlsx") {
            const sheet = strFromU8(unzipSync(bytes)["xl/worksheets/sheet1.xml"]);
            assert(sheet.includes("Roya") && sheet.includes("سمیرا") && sheet.includes("<v>12.5</v>"));
          }
          if (format === "pdf") assert(bytes.toString("latin1").startsWith("%PDF-") && bytes.includes(Buffer.from("/FontFile2")));
        }
        await page.keyboard.press("Escape");
        await features.getByRole("button", { name: "Columns", exact: true }).click();
        await page.getByRole("dialog", { name: "Columns", exact: true }).getByRole("checkbox", { name: "Email", exact: true }).check();
        await page.keyboard.press("Escape");
        await features.getByText("samira@example.com", { exact: true }).waitFor();
        await features.getByRole("button", { name: "Toggle table theme" }).click();
        assert.equal(await features.locator(".fixture-features").getAttribute("data-theme"), "dark");
        await page.screenshot({ path: join(cwd, mobile ? "mobile.png" : "desktop.png"), fullPage: true });
        assert.deepEqual(errors, [], `${name} ${mobile ? "mobile" : "desktop"} browser errors`);
        await page.close();
      }
      results.push({ name, react: JSON.parse(readFileSync(join(cwd, "node_modules/react/package.json"))).version,
        next: JSON.parse(readFileSync(join(cwd, "node_modules/next/package.json"))).version, build: "passed", ssr: "passed", hydration: "desktop + mobile passed", css: "passed",
        requestRecovery: "desktop + mobile passed", rowClasses: "desktop + mobile passed",
        columnVisibility: "desktop + mobile passed", rowDetails: "desktop + mobile passed", themes: "desktop + mobile passed", exports: "CSV + XLSX + PDF downloads passed", skeletonLayout: "2.2s animation + loading transition passed" });
    } finally { child.kill(); }
  }
} finally { await browser?.close(); }
writeFileSync(join(root, "docs/release-verification.json"), JSON.stringify({ artifact: packed.filename, sha512: packed.integrity, results }, null, 2) + "\n");
console.log(JSON.stringify(results, null, 2));
