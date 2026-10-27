# Cypress QA Pipeline

[![CI](https://github.com/dpgpqa/cypress-qa-pipeline/actions/workflows/ci.yml/badge.svg)](https://github.com/dpgpqa/cypress-qa-pipeline/actions/workflows/ci.yml) [![Cypress 13](https://img.shields.io/badge/Cypress-13-green)](https://docs.cypress.io/) [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE) [![Test Reports](https://img.shields.io/badge/Test_Reports-GitHub_Pages-2EAD33?logo=github)](https://dpgpqa.github.io/cypress-qa-pipeline/)

Enterprise-grade Cypress template for **UI testing (SauceDemo)** + **API testing (JSONPlaceholder)**.

Clone, point at your app, ship with confidence. E2E · API · Visual · Accessibility · Self-Healing — from a single toolchain.

The template ships **pre-wired against [saucedemo.com](https://www.saucedemo.com)** so it works the moment you clone it. Adopt it by swapping `BASE_URL` to your app and adapting the page objects.

---

## Contents

1. [Philosophy](#philosophy)
2. [What you get](#what-you-get)
3. [Quick Start](#quick-start)
4. [Project Layout](#project-layout)
5. [The Page Object Model](#the-page-object-model)
6. [Fixtures & Test Data](#fixtures--test-data)
9. [Tagging Strategy](#tagging-strategy)
10. [Cypress CLI Reference](#cypress-cli-reference)
11. [Best Practices & Guardrails](#best-practices--guardrails)
12. [Branch Protection & Merge Workflow](#branch-protection--merge-workflow)
13. [Security](#security)
14. [CI / CD](#ci--cd)
15. [Environment Variables](#environment-variables)
16. [Scripts](#scripts)
17. [Pre-commit Hooks](#pre-commit-hooks)
18. [Adapting to Your App](#adapting-to-your-app)
19. [Cypress Healer — Self-Healing](#cypress-healer--self-healing)
20. [Quarantine Workflow](#quarantine-workflow)
21. [Test Coverage](#test-coverage)
22. [Documentation](#documentation)

---

## Philosophy

- **One framework, all layers.** Cypress handles E2E, API, and visual testing natively. axe-core for a11y runs inside the same browser. No extra HTTP clients, no second runner.
- **Fast feedback first.** Smoke + API run on every push in under 2 minutes. Full regression runs on every push.
- **Enterprise defaults.** Page Object Model, worker-scoped patterns, typed fixtures, pre-commit hooks, sharded reports merged into a single dashboard.
- **Free by default.** GitHub Actions, Cypress, axe-core, Lighthouse CI — all free for public repos and generous on private.
- **You own it.** This is not a framework you import. Every file is yours to modify.
- **No `cy.task` in the Healer.** The self-healing mechanism uses `Cypress.on('fail')` and preserves the native retry-ability of `cy.get`.

---

## What you get

| Layer | Tool | Cost |
|---|---|---|
| E2E, API, visual | [Cypress](https://docs.cypress.io) 13 + TypeScript 5.9 | Free / OSS |
| Accessibility | [axe-core](https://github.com/dequelabs/axe-core) via custom commands | Free / OSS |
| Static analysis | TypeScript + ESLint | Free / OSS |
| Dependency review | GitHub Dependabot | Free on GitHub |
| Secret scanning | Gitleaks via security.yml | Free on GitHub |
| Pre-commit gates | husky 9 + lint-staged | Free / OSS |
| CI/CD | GitHub Actions | Free tier |
| Self-Healing | Cypress Healer (`Cypress.on('fail')`) | Custom / OSS |
| Dashboard | GitHub Pages + Tailwind + Chart.js | Free |

---

## Quick Start

```
# 1. Install
npm ci

# 2. Optional — point at your own app (defaults to saucedemo.com)
cp .env.example .env.local   # edit BASE_URL / credentials

# 3. Smoke test
npm run test:smoke

# 4. View the dashboard
# Open https://dpgpqa.github.io/cypress-qa-pipeline/ (deployed from CI)
```

You should see 16 smoke tests pass against saucedemo.com. Full suite (`npm test`) runs all suites.

---

## Project Layout

```
.
├── .github/
│   ├── workflows/
│   │   └── ci.yml              # Pipeline: lint, typecheck, 5 test suites, deploy
│   ├── CODEOWNERS              # Auto-assign reviewers per path
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── dependabot.yml
│
├── .husky/                     # pre-commit + pre-push hooks
│   ├── pre-commit              # lint + typecheck
│   └── pre-push                # typecheck + smoke tests
│
├── cypress/
│   ├── config.ts               # Cypress configuration
│   ├── e2e/
│   │   ├── smoke/              # @smoke — critical path (< 2 min total)
│   │   ├── regression/         # @regression — full coverage
│   │   ├── api/                # @api — contract + availability
│   │   ├── accessibility/      # @a11y — axe-core WCAG 2.1 AA
│   │   └── visual/             # @visual — screenshot diffs
│   ├── pages/                  # Page Object Model (one file per page)
│   │   ├── BasePage.ts         # Abstract base — visit(), waitForLoad(), shouldBeOn()
│   │   ├── LoginPage.ts
│   │   ├── InventoryPage.ts
│   │   ├── CartPage.ts
│   │   ├── CheckoutInfoPage.ts
│   │   ├── CheckoutOverviewPage.ts
│   │   └── CheckoutCompletePage.ts
│   ├── support/
│   │   ├── commands.ts         # Custom Cypress commands (login, checkA11y, etc.)
│   │   ├── e2e.ts              # Global e2e setup + imports
│   │   └── healer.ts           # Cypress Healer — self-healing selectors
│   └── fixtures/
│       └── test-data.ts        # Users and test data constants
│
├── scripts/
│   ├── cypress-healer.mjs      # CLI: diagnostic (heal) + auto-fix (heal:fix)
│   └── build-dashboard.mjs     # GitHub Pages dashboard generator
│
├── test-server/                # Local Express server with HTML fixtures
│   ├── server.js
│   ├── start.js
│   ├── run-tests.sh
│   └── fixtures/               # cart, checkout, inventory, login HTML
│
├── .env.example                # Environment variables template
├── .env.local                  # Local overrides (gitignored — never commit)
├── nyc.config.js               # Coverage configuration
├── package.json
├── tsconfig.json
├── .eslintrc.json
├── README.md
├── CONTRIBUTING.md             # PR + coding standards
├── SECURITY.md                 # Secret handling + threat model
└── index.html                  # Dashboard (built by CI, served on GitHub Pages)
```

---

## The Page Object Model

Every page follows the same shape. Locators are public readonly fields, methods are named for user intent, no `expect()` lives in a POM (assertions belong in tests).

### Base class — `cypress/pages/BasePage.ts`

```typescript
/// <reference types="cypress" />

export abstract class BasePage {
  constructor(protected readonly path: string = '/') {}

  visit() {
    cy.visit(this.path);
    return this;
  }

  abstract waitForLoad(): void;

  url() {
    return cy.url();
  }

  shouldBeOn(expectedUrl: string) {
    cy.url().should('include', expectedUrl);
    return this;
  }

  getPage() {
    return cy;
  }
}
```

### Page class — `cypress/pages/LoginPage.ts`

```typescript
/// <reference types="cypress" />

export class LoginPage {
  readonly url = '/';
  readonly username = '[data-test="username"], #user-name, input[name="username"]';
  readonly password = '[data-test="password"], #password, input[name="password"]';
  readonly loginButton = '[data-test="login-button"], #login-button, input[type="submit"]';
  readonly errorMessage = '[data-test="error"], .error-message-container, .error, h3[data-test="error"]';

  visit() {
    cy.visit(this.url);
    return this;
  }

  fillUsername(username: string) {
    cy.get(this.username).should('be.visible').clear().type(username);
    return this;
  }

  fillPassword(password: string) {
    cy.get(this.password).should('be.visible').clear().type(password);
    return this;
  }

  clickLogin() {
    cy.get(this.loginButton).should('be.visible').click();
    return this;
  }

  login(username: string, password: string) {
    return this.fillUsername(username).fillPassword(password).clickLogin();
  }

  loginAndWait(username: string, password: string) {
    this.fillUsername(username).fillPassword(password).clickLogin();
    cy.url().should('include', '/inventory.html');
    return this;
  }

  shouldShowError(message: string) {
    cy.get(this.errorMessage).should('be.visible').and('contain', message);
    return this;
  }

  shouldBeOnInventory() {
    cy.url().should('include', '/inventory.html');
    return this;
  }
}

export const loginPage = new LoginPage();
```

### POM Rules — non-negotiable

1. **Extend `BasePage`** for full pages. Components take `cy` directly.
2. **Locators are `readonly` fields**. Tests interact through methods, never raw locators.
3. **No `expect()` inside a POM.** Use `cy.get().should()` for readiness. Assertions belong in tests.
4. **Methods describe user intent.** `login()`, not `clickLoginButton()`.
5. **Named exports only.** No default exports.
6. **One file per page or major flow.** Don't extract a class for a single button.
7. **`waitForLoad()` is required.** Assert (via `should`, not `expect`) that the page is truly ready.

---

## Fixtures & Test Data

Test data lives in `cypress/fixtures/test-data.ts` and is imported by tests:

```typescript
export const USERS = {
  standard: { username: 'standard_user', password: 'secret_sauce' },
  locked:   { username: 'locked_out_user', password: 'secret_sauce' },
  problem:  { username: 'problem_user', password: 'secret_sauce' },
  invalid:  { username: 'invalid_user', password: 'wrong' },
};

export const PRODUCTS = {
  backpack: 'Sauce Labs Backpack',
  onesie:   'Sauce Labs Onesie',
  // ...
};
```

Tests reference fixtures instead of hardcoding values:

```typescript
import { USERS } from '../../fixtures/test-data';

loginPage.login(USERS.standard.username, USERS.standard.password);
```

---

## Tagging Strategy

Tests are organized by suite directory and tagged by intent:

| Directory | Tag | Purpose |
|---|---|---|
| `cypress/e2e/smoke/` | `@smoke` | Critical path — login, navigation, cart. Runs on every push. |
| `cypress/e2e/regression/` | `@regression` | Full checkout flow, edge cases. Runs on every push. |
| `cypress/e2e/api/` | `@api` | Contract + availability tests for JSONPlaceholder and SauceDemo API. |
| `cypress/e2e/accessibility/` | `@a11y` | axe-core WCAG 2.1 AA checks on key pages. |
| `cypress/e2e/visual/` | `@visual` | Screenshot diff comparisons. |

Filter by suite in CI:

```bash
npx cypress run --spec "cypress/e2e/smoke/**/*.cy.ts"
npx cypress run --spec "cypress/e2e/regression/**/*.cy.ts"
```

---

## Cypress CLI Reference

| Command | Description |
|---|---|
| `npm test` | Run all tests |
| `npm run test:smoke` | Smoke suite only |
| `npm run test:regression` | Regression suite only |
| `npm run test:api` | API suite only |
| `npm run test:a11y` | Accessibility suite only |
| `npm run test:visual` | Visual suite only |
| `npm run typecheck` | TypeScript strict check |
| `npm run lint` | ESLint check |
| `npm run heal` | Healer diagnostic (read CTRF report) |
| `npm run heal:fix` | Healer auto-fix (replace selectors + re-run) |

---

## Best Practices & Guardrails

1. **Selectors** — Prefer `data-test` attributes. Avoid brittle CSS classes or text-based selectors.
2. **Retries** — Cypress `retries.runMode: 2` handles flakiness automatically.
3. **Videos** — `video: true` records every test; videos uploaded as artifacts regardless of pass/fail.
4. **Screenshots** — Captured on failure for debugging.
5. **No hard waits** — Use `cy.url().should()` and `cy.get().should('be.visible')` instead of `cy.wait()`.
6. **Independent tests** — Each test logs in fresh; no shared state between tests.
7. **No secrets** — Test users are synthetic/demo accounts only.

---

## Branch Protection & Merge Workflow

1. **`main` is protected** — requires PR review + passing CI.
2. **CODEOWNERS** — auto-assigns reviewers based on changed paths.
3. **PR Template** — required checklist (typecheck, lint, tests, POM rules).
4. **Pre-commit hooks** — lint + typecheck block bad commits.
5. **Pre-push hooks** — typecheck + smoke tests block bad pushes.

---

## Security

- **Never commit secrets** — passwords, API keys, tokens go in `.env.local` (gitignored).
- **Gitleaks** — scans commit history for leaked secrets in CI.
- **Dependabot** — weekly dependency vulnerability alerts.
- **Synthetic data only** — all test users and data are demo/fixture values.
- See `SECURITY.md` for full policy and vulnerability reporting.

---

## CI / CD

The pipeline runs on every push to `main` and `develop`:

| Job | Purpose |
|---|---|
| Lint & Typecheck | ESLint + `tsc --noEmit` |
| Smoke Tests | Critical path tests |
| Regression Tests | Full checkout flow |
| API Tests | Contract + availability |
| Accessibility Tests | axe-core WCAG 2.1 AA |
| Visual Regression | Screenshot diffs |
| Deploy Videos | Upload videos to `gh-pages` |

Videos and screenshots upload as artifacts on every run (`if: always()`), even when tests pass.

---

## Environment Variables

Copy `.env.example` to `.env.local` and edit:

| Variable | Default | Description |
|---|---|---|
| `BASE_URL` | `https://www.saucedemo.com` | Application under test |
| `STANDARD_USER` | `standard_user` | Demo user |
| `STANDARD_PASSWORD` | `secret_sauce` | Demo password |
| `JSONPLACEHOLDER_BASE_URL` | `https://jsonplaceholder.typicode.com` | API test endpoint |
| `HEADLESS` | `true` | Run browser headless |
| `RETRIES` | `2` | Cypress retry count |
| `WORKERS` | `1` | Parallel workers |
| `VIDEO` | `true` | Record test videos |

Never commit `.env.local` — it is gitignored.

---

## Scripts

| Script | Purpose |
|---|---|
| `npm test` | Full Cypress run |
| `npm run test:smoke` | Smoke suite |
| `npm run test:regression` | Regression suite |
| `npm run test:api` | API suite |
| `npm run test:a11y` | Accessibility suite |
| `npm run test:visual` | Visual suite |
| `npm run typecheck` | TypeScript strict check |
| `npm run lint` | ESLint |
| `npm run heal` | Healer diagnostic |
| `npm run heal:fix` | Healer auto-fix selectors |

---

## Pre-commit Hooks

Managed by **husky 9**:

- **`pre-commit`** — runs `eslint` (max-warnings 0) + `tsc --noEmit`. Blocks commit on failure.
- **`pre-push`** — runs `tsc --noEmit` + smoke test suite. Blocks push on failure.

---

## Adapting to Your App

1. **Update `.env.local`** — set `BASE_URL` to your application.
2. **Update `cypress/pages/`** — create Page Objects matching your app's DOM. Use `data-test` attributes.
3. **Update `cypress/fixtures/test-data.ts`** — add your users and test data.
4. **Update `cypress/e2e/`** — write tests against your page objects, following the suite structure.
5. **Update `cypress.config.ts`** — adjust `baseUrl`, retries, video settings as needed.

---

## Cypress Healer — Self-Healing

The Healer lives in `cypress/support/healer.ts` and listens to `Cypress.on('fail')`:

- Detects selector failures (`Expected to find element:`, `Timed out retrying`)
- Inspects the current DOM (`Cypress.$('body')`) for interactive elements
- Calculates similarity between the broken selector and available candidates
- Embeds a `[HEALER_CONTEXT_START]...[HEALER_CONTEXT_END]` JSON block in the error message
- `cypress-ctrf-json-reporter` captures this block in `ctrf/ctrf-report.json`

**CLI:**
```bash
npm run heal      # Show broken selectors + suggested fixes
npm run heal:fix  # Auto-replace selectors in source + re-run tests
```

---

## Quarantine Workflow

When a test is flaky:

1. Tag it appropriately in its suite directory (do not create a separate quarantine folder).
2. Investigate root cause (selector, wait, mock, network).
3. Fix the root cause.
4. Remove any temporary skip/workaround.
5. Confirm the test passes consistently in CI.

Do not leave skipped tests in the codebase — they create false confidence.

---

## Test Coverage

Coverage is configured via `nyc.config.js` and measures test code quality:

| Metric | Threshold | Status |
|---|---|---|
| Statements | 40% | Aspirational |
| Functions | 40% | Aspirational |
| Branches | 25% | Aspirational |
| Lines | 40% | Aspirational |

Run locally:

```bash
npm run test:coverage      # HTML report in ./coverage
npm run test:coverage:ci   # CI mode (exit code based)
```

Coverage excludes page objects, fixtures, and support files — these are validated through E2E execution.

---

## Documentation

- `CONTRIBUTING.md` — PR process + coding standards
- `SECURITY.md` — Secret handling + threat model
- `README.md` — This file (you are here)

---

## License

[MIT](LICENSE).