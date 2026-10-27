# Contributing to Cypress QA Pipeline

Thank you for contributing! Please follow these guidelines.

## Getting Started

1. Fork the repository and create your branch from `main`.
2. Install dependencies: `npm ci`
3. Create a feature branch: `git checkout -b feature/your-feature-name`

## Development Workflow

1. Make your changes following the POM rules (see README).
2. Run typecheck: `npm run typecheck`
3. Run lint: `npm run lint`
4. Run relevant tests: `npm run test:smoke` (or the specific suite)
5. Commit your changes (pre-commit hooks will run lint + typecheck)
6. Push and open a Pull Request

## Pull Request Process

1. Open a PR against `main`.
2. Ensure all CI checks pass.
3. A maintainer will review your PR.
4. Once approved, a maintainer will merge.

## Code Standards

- **TypeScript strict mode** — no `any` where possible.
- **ESLint** — follow `.eslintrc.json` rules.
- **POM** — Page Object Model for all UI interactions.
- **Selectors** — prefer `data-test` attributes over classes/text.
- **No `cy.task`** in the Healer — preserves native retry-ability.

## Reporting Bugs

Open a GitHub issue with:
- Steps to reproduce
- Expected vs actual behavior
- Screenshots or videos if applicable
- Cypress version and browser
