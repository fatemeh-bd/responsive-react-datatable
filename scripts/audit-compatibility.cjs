/* Read-only compatibility probes. Uses the installed Vite/esbuild and React.
 * No installs, HTTP requests, effects, or tracked build outputs are involved.
 * This is an audit probe, not the future regression-test suite.
 */
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { createRequire } = require('node:module');
const { pathToFileURL } = require('node:url');
const React = require('react');
const { renderToString } = require('react-dom/server');
const { buildSync } = require('esbuild');

const root = path.resolve(__dirname, '..');
const scratch = fs.mkdtempSync(path.join(root, '.audit-runtime-'));
const localRequire = createRequire(path.join(scratch, 'probe.cjs'));
const observations = [];
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();

function probe(name, run) {
  try {
    observations.push({ name, result: run() });
  } catch (error) {
    observations.push({ name, error: error.message });
  }
}

function loadSource(relative) {
  const outfile = path.join(scratch, relative.replace(/[^a-z0-9]/gi, '_') + '.cjs');
  buildSync({
    absWorkingDir: root,
    entryPoints: [relative],
    outfile,
    bundle: true,
    platform: 'node',
    format: 'cjs',
    jsx: 'automatic',
    external: ['react', 'react-dom', 'axios', '@tanstack/react-query'],
    loader: { '.css': 'empty' },
    logLevel: 'silent',
  });
  return localRequire(outfile);
}

async function main() {
  observations.push({ node: process.version, react: React.version,
    main: git('rev-parse', 'main'), dev: git('rev-parse', 'dev') });
  probe('main/dev table source differences', () =>
    git('diff', 'main', 'dev', '--', 'src/components/table') || '(none)');

  const props = { mode: 'static', tableName: 'audit', columns: [], staticRows: [], totalItems: 0 };
  const table = loadSource('src/index.ts');
  probe('working tree runtime exports', () => Object.keys(table));
  probe('working tree Table SSR', () => renderToString(React.createElement(table.default, props)));
  const { ActionDropDown } = loadSource('src/components/table/tools/actionDropDown/ActionDropDown.tsx');
  probe('ActionDropDown SSR while closed', () =>
    renderToString(React.createElement(ActionDropDown, { options: [] })));

  const mainFile = path.join(scratch, 'main.mjs');
  fs.writeFileSync(mainFile, git('show', 'main:dist/index.mjs'));
  const publishedCandidate = await import(pathToFileURL(mainFile).href);
  probe('main committed bundle runtime exports', () => Object.keys(publishedCandidate));
  probe('main committed bundle Table SSR', () =>
    renderToString(React.createElement(publishedCandidate.default, props)));

  // Supply only location to reach the independent storage/provider failures.
  // This is deliberately not a browser or a hydration test.
  global.window = { location: { search: '' }, innerWidth: 1024 };
  const SearchBox = loadSource('src/components/table/tools/SearchBox.tsx').default;
  probe('saved-search render without storage', () => renderToString(React.createElement(SearchBox,
    { ...props, saveSearch: true, tableRows: [], mergedTexts: {}, theme: {} })));
  probe('internal mode without QueryClientProvider', () => renderToString(React.createElement(table.default,
    { mode: 'internal', tableName: 'audit', columns: [], internalApiConfig: { endpoint: '/audit' } })));

  const { useIsMobile } = loadSource('src/components/table/hooks/useIsMobile.ts');
  function BreakpointProbe() { return React.createElement('span', null, String(useIsMobile())); }
  delete global.window;
  const server = renderToString(React.createElement(BreakpointProbe));
  global.window = { innerWidth: 375 };
  const clientInitial = renderToString(React.createElement(BreakpointProbe));
  observations.push({ name: 'mobile initial-render parity (not actual hydration)', server, clientInitial });
  delete global.window;
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  probe('working tree declared output files', () => Object.fromEntries(
    ['main', 'module', 'types'].map(key => [manifest[key], fs.existsSync(path.join(root, manifest[key]))])));
}

main().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => {
  delete global.window;
  // Only remove this process's generated, direct-child temporary directory.
  if (path.dirname(scratch) !== root || !path.basename(scratch).startsWith('.audit-runtime-')) {
    throw new Error('Unexpected audit scratch path');
  }
  fs.rmSync(scratch, { recursive: true, force: true });
  console.log(JSON.stringify(observations, null, 2));
});
