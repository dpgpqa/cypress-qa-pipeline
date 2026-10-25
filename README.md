# Cypress QA Pipeline

[![CI](https://github.com/dpgpqa/cypress-qa-pipeline/actions/workflows/ci.yml/badge.svg)](https://github.com/dpgpqa/cypress-qa-pipeline/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A lean, production-ready QA automation template for SaaS web apps — **Cypress + TypeScript**, wired against [saucedemo.com](https://www.saucedemo.com) out of the box.

## Features

- **Page Object Model** — Clean, maintainable page objects for all saucedemo pages
- **TypeScript** — Full type safety with strict mode
- **API Testing** — Typed API clients for JSONPlaceholder and SauceDemo
- **Accessibility Testing** — Custom DOM-based a11y checks for WCAG 2.1 AA compliance
- **Visual Regression** — Pixel-perfect snapshot testing with cypress-image-diff-js
- **Test Data Factories** — Centralized test data with Faker-like generators
- **CI/CD Pipeline** — GitHub Actions with parallel job execution
- **Security Scanning** — Gitleaks, npm audit
- **Performance Budgets** — Lighthouse CI integration
- **Code Coverage** — @cypress/code-coverage with Istanbul
- **CTRF Reporting** — Common Test Report Format + GitHub Actions Job Summaries
- **Quality Observability Dashboard** — Bento Grid UI published to GitHub Pages

## Quick Start

```bash
# Clone and install
git clone https://github.com/dpgpqa/cypress-qa-pipeline.git
cd cypress-qa-pipeline
npm ci

# Copy env file and adjust if needed
cp .env.example .env.local

# Open Cypress UI
npm run test:open

# Run headless (CI mode)
npm run test
```

## Project Structure

```
cypress-qa-pipeline/
├── .github/workflows/     # CI/CD pipelines
├── cypress/
│   ├── e2e/              # Test specs by category
│   │   ├── smoke/        # Critical path tests
│   │   ├── regression/   # Full feature coverage
│   │   ├── api/          # API contract tests
│   │   ├── accessibility/# a11y tests
│   │   └── visual/       # Visual regression
│   ├── pages/            # Page Object Models
│   ├── components/       # Reusable UI components
│   ├── api/              # Typed API clients
│   ├── factories/        # Test data factories
│   ├── fixtures/         # Static test data
│   ├── utils/            # Helper functions
│   └── support/          # Commands, hooks, config
├── scripts/
│   ├── build-dashboard.mjs     # Quality Observability Dashboard builder
│   └── publish-ctrf-summary.mjs # CTRF GitHub Job Summary publisher
├── cypress.config.ts     # Cypress configuration
├── tsconfig.json         # TypeScript config
├── eslint.config.mjs     # ESLint config
├── .prettierrc           # Prettier config
├── .npmrc                # npm config (legacy-peer-deps)
└── package.json
```

## Test Categories

| Command                   | Description                     | Tags          |
| ------------------------- | ------------------------------- | ------------- |
| `npm run test:smoke`      | Critical path: login, inventory | `@smoke`      |
| `npm run test:regression` | Full checkout flows, edge cases | `@regression` |
| `npm run test:api`        | JSONPlaceholder API contracts   | `@api`        |
| `npm run test:a11y`       | WCAG 2.1 AA compliance          | `@a11y`       |
| `npm run test:visual`     | Pixel-perfect snapshots         | `@visual`     |

## Visual Regression

```bash
# Run visual tests
npm run test:visual

# Update baselines (after approved UI changes)
npm run test:visual:update
```

Baselines stored in `cypress/snapshots/`. Commit updated baselines after review.

## Environment Variables

| Variable                | Default                                | Description             |
| ----------------------- | -------------------------------------- | ----------------------- |
| `BASE_URL`              | `https://www.saucedemo.com`            | App under test          |
| `API_BASE_URL`          | `https://jsonplaceholder.typicode.com` | API test target         |
| `TEST_USER`             | `standard_user`                        | Login username          |
| `TEST_PASS`             | `secret_sauce`                         | Login password          |
| `CYPRESS_DISABLE_VIDEO` | `false`                                | Disable video recording |
| `UPDATE_SNAPSHOTS`      | `false`                                | Update visual baselines |

## CI/CD Pipeline

GitHub Actions workflow (`.github/workflows/ci.yml`) runs on every push/PR:

1. **Lint & Typecheck** — ESLint, TypeScript, Prettier
2. **Smoke Tests** — Fast critical path validation
3. **Regression Tests** — Full feature coverage
4. **API Tests** — Contract validation
5. **Accessibility Tests** — WCAG compliance
6. **Visual Regression** — Snapshot comparison
7. **Security Scan** — Gitleaks, npm audit
8. **Lighthouse CI** — Performance budgets
9. **Deploy Reports** — Quality Observability Dashboard to GitHub Pages

Jobs run in parallel where possible. Required jobs must pass before merge.

## Writing Tests

### Page Objects

```typescript
// cypress/pages/LoginPage.ts
export class LoginPage extends BasePage {
  login(username: string, password: string) {
    this.fillUsername(username);
    this.fillPassword(password);
    this.clickLogin();
    return this;
  }
}
```

### Test Spec

```typescript
// cypress/e2e/smoke/login.smoke.cy.ts
import { LoginPage } from '@pages/LoginPage';
import { validUsers } from '@fixtures/test-data';

describe('@smoke Login', () => {
  it('should login successfully', () => {
    const loginPage = new LoginPage();
    loginPage.visit();
    loginPage.login(validUsers.standard.username, validUsers.standard.password);
    // assertions...
  });
});
```

### API Tests

```typescript
// cypress/e2e/api/jsonplaceholder.api.cy.ts
import { jsonPlaceholderApi } from '@api/JsonPlaceholderApi';

it('should get all users', () => {
  jsonPlaceholderApi.getUsers().then((users) => {
    expect(users.length).to.be.greaterThan(0);
  });
});
```

### Accessibility

```typescript
it('should have no a11y violations', () => {
  cy.checkA11y(); // Full page
  cy.checkA11y('[data-test="header"]'); // Component
});
```

### Visual Regression

```typescript
it('should match baseline', () => {
  cy.compareSnapshot('login-page');
});
```

## Code Quality

```bash
# Lint
npm run lint
npm run lint:fix

# Typecheck
npm run typecheck

# Format
npm run format
npm run format:check
```

## Husky Git Hooks

Pre-commit runs lint-staged on changed files. Prepare commit message with conventional commits.

## Quality Observability Dashboard

The CI pipeline publishes an interactive Dark Mode dashboard to GitHub Pages with:

- **KPI Cards** — Total Tests, Pass Rate %, Failed, Flaky Tests, Security Alerts
- **Charts** — Tests per suite distribution, global status pie chart
- **Filterable Table** — Filter by suite and status (passed/failed/skipped)
- **Stack Traces** — Clean error details for failed tests
- **Security Section** — Link to OWASP ZAP report

Dashboard URL: `https://dpgpqa.github.io/cypress-qa-pipeline/`

_(Enable GitHub Pages in Settings → Pages, branch `gh-pages`, if the site returns 404)_

## Contributing

1. Fork the repo
2. Create feature branch
3. Write tests first (TDD)
4. Ensure all checks pass
5. Submit PR

## License

MIT
