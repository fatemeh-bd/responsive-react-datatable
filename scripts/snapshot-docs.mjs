import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
const root = new URL("../", import.meta.url);
const pkg = JSON.parse(readFileSync(new URL("package.json", root), "utf8"));
const version = process.argv[2] || pkg.version;
if (!/^\d+\.\d+\.\d+(?:-[\w.-]+)?$/.test(version) || version !== pkg.version) {
  throw new Error("Set package.json to the release version first, then run npm run docs:snapshot");
}
const directory = new URL("docs/versions/", root);
mkdirSync(directory, { recursive: true });
const guidePath = new URL(`${version}.md`, directory);
const changesPath = new URL(`${version}.changes.md`, directory);
const examplesPath = new URL(`${version}.examples.json`, directory);
if (existsSync(guidePath) || existsSync(changesPath) || existsSync(examplesPath)) throw new Error(`Documentation ${version} already exists; archived versions must not be overwritten.`);
const readme = readFileSync(new URL("README.md", root), "utf8");
const changelog = readFileSync(new URL("CHANGELOG.md", root), "utf8");
const section = changelog.split(/^## /m).find(text => text.split(/\r?\n/)[0].trim() === version);
if (!section) throw new Error(`CHANGELOG.md is missing a section for ${version}`);
const manifestPath = new URL("index.json", directory);
const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, "utf8")) : { current: version, versions: [] };
writeFileSync(guidePath, readme);
writeFileSync(changesPath, `## Changes in ${section.trim()}\n`);
writeFileSync(examplesPath, readFileSync(new URL("docs/examples.json", root), "utf8"));
manifest.current = version;
manifest.versions = [{ version }, ...manifest.versions.filter(entry => entry.version !== version)];
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
console.log(`Saved immutable guide and change notes for ${version}. Route: /document/${version}`);
