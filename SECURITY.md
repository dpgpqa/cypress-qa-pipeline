# Security Policy

## Supported Versions

| Version | Supported          |
|---------|-------------------|
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly:

1. **Do not** open a public GitHub issue for security vulnerabilities.
2. Send details to the project maintainer via GitHub Security Advisories or email.
3. Include steps to reproduce, impact, and any suggested remediation.
4. Allow reasonable time for investigation and fix before public disclosure.

## Secret Handling

- Never commit passwords, API keys, tokens, or connection strings.
- Use environment variables (`.env.local`) for sensitive values.
- `.env.local` is gitignored and must never be committed.
- Gitleaks scans run in CI to detect leaked secrets.

## Dependency Scanning

- Dependabot is configured to alert on vulnerable dependencies.
- Gitleaks scans for secrets in commit history.

## Threat Model

- Tests run against external demo sites (SauceDemo, JSONPlaceholder).
- No production credentials are stored in the repository.
- All test data is synthetic and non-sensitive.
