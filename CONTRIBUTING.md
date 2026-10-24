# Contributing

Thank you for contributing to Cypress QA Pipeline!

## Development Setup

```bash
# Fork and clone
git clone https://github.com/your-fork/cypress-qa-pipeline.git
cd cypress-qa-pipeline

# Install dependencies
npm ci

# Set up git hooks
npm run prepare

# Verify setup
npm run test:open
```

## Coding Standards

- **TypeScript strict mode** — No `any`, explicit types
- **ESLint + Prettier** — Run `npm run lint:fix` and `npm run format` before commit
- **Conventional Commits** — `feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`
- **Page Object Model** — All UI interactions in page objects
- **Test-first (TDD)** — Write failing test, make it pass, refactor

## Pull Request Checklist

- [ ] Tests pass locally (`npm run test`)
- [ ] Lint clean (`npm run lint`)
- [ ] Types valid (`npm run typecheck`)
- [ ] Format clean (`npm run format:check`)
- [ ] New tests for new features
- [ ] Updated documentation if needed
- [ ] Visual baselines updated if UI changed

## Branch Naming

- `feat/description` — New feature
- `fix/description` — Bug fix
- `chore/description` — Maintenance
- `docs/description` — Documentation
- `test/description` — Test improvements

## Test Guidelines

### Smoke Tests (`@smoke`)

- Critical user paths only
- Run on every PR
- Must complete in < 30 seconds
- No external dependencies beyond base URL

### Regression Tests (`@regression`)

- Full feature coverage
- Edge cases and error states
- Data-driven where possible
- Can run longer

### API Tests (`@api`)

- Contract validation
- Schema validation with Zod
- Mock external dependencies
- Test error responses

### Accessibility Tests (`@a11y`)

- WCAG 2.1 AA baseline
- Test each unique page template
- Include error states
- Component-level checks

### Visual Regression (`@visual`)

- One snapshot per unique view
- Include sort/filter variations
- Update baselines via `npm run test:visual:update`
- Review diffs before committing

## Adding New Pages

1. Create page object in `cypress/pages/`
2. Extend `BasePage`
3. Use `data-test` selectors
4. Add to exports if needed
5. Write smoke test first

## Adding New API Clients

1. Create types in `cypress/api/types.ts`
2. Create client in `cypress/api/`
3. Export singleton instance
4. Write contract tests

## Updating Visual Baselines

```bash
# Run with update flag
UPDATE_SNAPSHOTS=true npm run test:visual

# Or use the script
npm run test:visual:update

# Review changes in cypress/snapshots/
# Commit updated baselines
git add cypress/snapshots/
git commit -m "chore: update visual baselines for [feature]"
```

## Reporting Issues

- Use issue templates
- Include reproduction steps
- Attach screenshots/videos for visual issues
- Specify browser, OS, Cypress version

## Code Review

Reviewers check:

- Test coverage and quality
- Page object usage
- Type safety
- Performance implications
- Security considerations
- Documentation updates
