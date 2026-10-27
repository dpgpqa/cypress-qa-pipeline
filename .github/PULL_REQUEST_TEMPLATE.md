# Pull Request Template

## Description

Briefly describe the changes in this PR.

## Type of change

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Refactoring (no functional changes)
- [ ] Test-related (adding/fixing tests)

## Test Plan

- [ ] `npm run typecheck` passes
- [ ] `npm run lint` passes
- [ ] `npm run test:smoke` passes locally
- [ ] Relevant test suite(s) pass

## Checklist

- [ ] Code follows the POM rules (locators private, no expect() in page objects)
- [ ] Selectors use `data-test` attributes where possible
- [ ] New tests are tagged appropriately (`@smoke`, `@regression`, `@api`, `@a11y`, `@visual`)
- [ ] README updated if project structure or scripts changed
- [ ] No secrets, passwords, or tokens committed

## Related Issues

Closes #
