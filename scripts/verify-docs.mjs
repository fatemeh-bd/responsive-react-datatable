import { preview } from "vite";
import { chromium } from "@playwright/test";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import assert from "node:assert/strict";
const output = join(process.cwd(), ".release-tests/docs"); mkdirSync(output, { recursive: true });
const manifest = JSON.parse(readFileSync("docs/versions/index.json", "utf8"));
const pkg = JSON.parse(readFileSync("package.json", "utf8"));
assert.equal(manifest.current, pkg.version, "Create documentation for the release version before verifying");
for (const { version } of manifest.versions) {
  for (const suffix of [".md", ".changes.md", ".examples.json"]) assert(existsSync(`docs/versions/${version}${suffix}`), `Missing documentation ${version}${suffix}`);
}
const snapshot = readFileSync(`docs/versions/${manifest.current}.md`, "utf8");
assert.throws(() => execFileSync(process.execPath, ["scripts/snapshot-docs.mjs"], { stdio: "pipe" }), /already exists/);
assert.equal(readFileSync(`docs/versions/${manifest.current}.md`, "utf8"), snapshot, "Existing snapshots must not be overwritten");
const server = await preview({ preview: { host: "127.0.0.1", port: 0, open: false } });
const address = server.httpServer.address();
const base = `http://127.0.0.1:${address.port}/responsive-react-datatable/`;
const executablePath = process.env.RELEASE_CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";
let browser;
try {
  browser = await chromium.launch({ headless: true, ...(existsSync(executablePath) ? { executablePath } : {}) });
  for (const mobile of [false, true]) {
    const page = await browser.newPage({ viewport: { width: mobile ? 390 : 1440, height: 1000 } });
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
    await page.goto(base);
    await page.getByRole("heading", { name: "A table that fits your application." }).waitFor();
    assert.equal(await page.evaluate(() => getComputedStyle(document.body).backgroundColor), "rgb(255, 255, 255)");
    await page.locator(".site-home-logo").evaluate(image => image.decode());
    const faviconHref = await page.locator('link[rel="icon"]').getAttribute("href");
    const favicon = await page.request.get(new URL(faviconHref, base).href);
    assert((await favicon.body()).equals(readFileSync("public/favicon.ico")), "The supplied favicon must be served");
    await page.screenshot({ path: join(output, mobile ? "mobile-home.png" : "desktop-home.png"), fullPage: true });
    await page.getByRole("link", { name: /Read the documentation/ }).click();
    await page.getByRole("heading", { name: "Documentation", exact: true }).waitFor();
    const gif = page.getByAltText("Animated table preview showing search, sorting and pagination");
    await gif.evaluate(image => image.decode());
    assert(await gif.evaluate(image => image.complete && image.naturalWidth > 0), "Original GIF must load locally");
    assert.equal(await page.getByLabel("Version", { exact: true }).inputValue(), manifest.current);
    const navigation = page.getByRole("navigation", { name: "Documentation examples" });
    await navigation.getByRole("button", { name: "All features", exact: true }).click();
    const stage = page.getByRole("region", { name: "Live table example" });
    assert.equal(await page.locator(".people-table").evaluate(el => getComputedStyle(el).backgroundColor), "rgb(255, 255, 255)");
    await page.getByRole("button", { name: "Black", exact: true }).click();
    assert.equal(await page.locator(".people-table").evaluate(el => getComputedStyle(el).backgroundColor), "rgb(0, 0, 0)");
    await stage.getByRole("button", { name: "Columns", exact: true }).click();
    await page.getByRole("checkbox", { name: "Email", exact: true }).check();
    await page.keyboard.press("Escape");
    await stage.getByText("mina@example.com", { exact: true }).waitFor();
    await stage.getByRole("button", { name: "Expand row", exact: true }).first().click();
    await stage.getByRole("region", { name: "Row details", exact: true }).waitFor();
    assert.equal(await stage.locator(".table-expand-chevron.is-expanded svg").count(), 1);
    const search = stage.getByRole("searchbox");
    await search.fill("Mina");
    await stage.getByRole("button", { name: "Clear search", exact: true }).waitFor();
    assert.equal(await stage.getByRole("button", { name: "Clear search", exact: true }).count(), 1);
    await page.waitForFunction(() => document.querySelector(".people-table")?.querySelectorAll(".desktop-table-data-row,.mobile-table-card").length === 1);
    await stage.screenshot({ path: join(output, mobile ? "mobile-search.png" : "desktop-search.png") });
    await stage.getByRole("button", { name: "Clear search", exact: true }).click();
    assert.equal(await search.inputValue(), "");
    await page.getByRole("button", { name: "Code", exact: true }).click();
    await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.locator(".docs-example-code .docs-code").first().getByRole("button", { name: "Copy code" }).click();
    assert((await page.evaluate(() => navigator.clipboard.readText())).includes("columnVisibility"));
    await navigation.getByRole("button", { name: "Loading & skeletons", exact: true }).click();
    await page.getByRole("button", { name: "Show data", exact: true }).click();
    await page.getByRole("region", { name: "Live table example" }).getByText("Mina Rahimi", { exact: true }).waitFor();
    await page.getByRole("button", { name: "Show loading", exact: true }).click();
    const guideSearch = page.getByRole("searchbox", { name: "Search examples" });
    await guideSearch.fill("expandableRows");
    await navigation.getByRole("button", { name: "Expandable details", exact: true }).click();
    await page.getByRole("heading", { name: "Expandable details", exact: true }).waitFor();
    await guideSearch.fill("no-such-feature-987"); await page.getByRole("heading", { name: "No matching examples" }).waitFor();
    await page.getByRole("button", { name: "Clear search", exact: true }).click();
    await page.getByRole("button", { name: "What's changed?", exact: true }).click();
    await page.getByRole("heading", { name: `What's new in ${manifest.current}` }).waitFor();
    await page.getByRole("button", { name: "Back to examples" }).click();
    await navigation.getByRole("button", { name: "Quick start", exact: true }).click();
    await page.getByRole("button", { name: "Code", exact: true }).click();
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), "Documentation must not overflow the viewport");
    assert(await page.locator(".docs-recipe-heading p").evaluate(el => parseFloat(getComputedStyle(el).fontSize) >= 16), "Guide text must be readable");
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: join(output, mobile ? "mobile.png" : "desktop.png"), fullPage: true });
    await page.locator(".docs-intro").screenshot({ path: join(output, mobile ? "mobile-hero.png" : "desktop-hero.png") });
    await page.goto(`${base}#/example/staticAutoPageSize`);
    await page.getByRole("button", { name: "Actions", exact: true }).first().waitFor();
    assert.equal(await page.locator(".table-container").evaluate(el => getComputedStyle(el).backgroundColor), "rgb(255, 255, 255)");
    assert.notEqual(await page.getByRole("button", { name: "Actions", exact: true }).first().evaluate(el => getComputedStyle(el).color), "rgb(255, 255, 255)");
    await page.screenshot({ path: join(output, mobile ? "mobile-auto-table.png" : "desktop-auto-table.png"), fullPage: false });
    await page.route("https://dummyjson.com/**", route => route.fulfill({ status: 200, contentType: "application/json", headers: { "access-control-allow-origin": "*" }, body: JSON.stringify({
      products: [{ id: 7, title: "Filter preview", price: 12.5, rating: 4.5, category: "beauty", brand: "Essence", images: [new URL("logo.png", base).href] }], total: 1,
    }) }));
    await page.goto(`${base}#/example/filters`);
    await page.getByText("Filter preview", { exact: true }).waitFor();
    if (mobile) await page.getByRole("button", { name: "filter", exact: true }).click();
    const filters = page.locator(".demo-filter-select");
    assert.equal(await filters.count(), 4);
    for (const control of await filters.all()) {
      assert.equal(await control.evaluate(el => getComputedStyle(el).backgroundColor), "rgb(255, 255, 255)");
      assert.equal(await control.evaluate(el => getComputedStyle(el).color), "rgb(38, 38, 38)");
    }
    await filters.first().selectOption("beauty");
    if (mobile) {
      await page.getByRole("button", { name: "delete filters", exact: true }).click();
      await page.getByRole("button", { name: "filter", exact: true }).click();
      assert.equal(await page.locator(".demo-filter-select").first().inputValue(), "");
    }
    await page.screenshot({ path: join(output, mobile ? "mobile-filters.png" : "desktop-filters.png"), fullPage: false });
    await page.goto(`${base}#/document/0.0.0-unknown`);
    await page.getByRole("heading", { name: "This version has no guide here." }).waitFor();
    assert.equal(await page.getByRole("region", { name: "Live table example" }).count(), 0);
    await page.getByLabel("Version", { exact: true }).selectOption(manifest.current);
    await page.getByRole("heading", { name: "Quick start", exact: true }).waitFor();
    assert.deepEqual(errors, [], "Documentation console and runtime must be clean");
    await page.close();
  }
  writeFileSync("docs/documentation-verification.json", JSON.stringify({ version: manifest.current, language: "en", browser: "Chrome", layouts: ["desktop 1440", "mobile 390"],
    examples: "passed", siteTheme: "light monochrome", logoAndFavicon: "passed", lightTableDefault: "passed", autoSizeExample: "passed", filterControls: "desktop + mobile passed",
    versionRouting: "passed", snapshotProtection: "passed", search: "passed", originalGif: "passed", hexTheme: "passed", singleClearButton: "passed", rowChevron: "passed", clipboard: "passed", overflow: "passed" }, null, 2) + "\n");
  console.log("Versioned English documentation, examples, GIF and desktop/mobile layouts passed.");
} finally { await browser?.close(); await new Promise(resolve => server.httpServer.close(resolve)); }
