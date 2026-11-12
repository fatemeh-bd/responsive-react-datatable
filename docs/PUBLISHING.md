# Publishing version 3

`main` is the release branch; `dev` receives development changes. Keep shared
library source/build settings in sync. Neither branch publishes automatically.
The npm lockfile is authoritative. `dist/` is generated library output;
`demo-dist/` is generated site output, and never belongs in the npm tarball.

## Before publishing

Use Node 20.19+ (22.12+ on the Node 22 line) and npm 10+. Check the changelog:
version 3 raises the React minimum to 18 and requires an explicit global CSS import.

```powershell
npm.cmd ci
npm.cmd test
npm.cmd run build
npm.cmd run test:package
npm.cmd run test:release
npm.cmd run build:demo
npm.cmd run test:docs
npm.cmd audit --omit=dev --registry=https://registry.npmjs.org/
```

The release matrix requires Playwright Chromium (`npx playwright install chromium`)
or an installed browser path in `RELEASE_CHROME_PATH`. It installs the real tarball
into isolated consumers and records exact versions/results in
`docs/release-verification.json`. All commands must succeed before continuing.

## Publish manually

Confirm npm authentication and that version 3.0.0 is still unused. Check every
command's result before running the next one. Never reuse an already published
version; if necessary, choose an appropriate new version and repeat verification.

```powershell
git switch main
npm.cmd view react-responsive-datatable-kit dist-tags --json --registry=https://registry.npmjs.org/
npm.cmd view react-responsive-datatable-kit@3.0.0 version --registry=https://registry.npmjs.org/
npm.cmd login --registry=https://registry.npmjs.org/
npm.cmd publish --dry-run
```

An E404 for the specific unused version is expected. The dry run must list
`dist/index.mjs`, `dist/index.d.ts` and `dist/styles.css`, plus README/license/
changelog, with no demo HTML or screenshots. `prepublishOnly` runs regression,
build and package-surface checks; prepack rebuilds the library as well.

Only when ready to make the release public:

```powershell
npm.cmd publish --access public --registry=https://registry.npmjs.org/
```

Complete the npm login/2FA prompt yourself. No npm publish, git push or release tag
is created by the preparation scripts. `npm run deploy` publishes the demo to
GitHub Pages and is separate from releasing the library.
