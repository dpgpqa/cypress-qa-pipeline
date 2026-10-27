module.exports = {
  all: true,
  instrument: false,
  checkCoverage: false,
  lines: 40,
  functions: 40,
  branches: 25,
  statements: 40,
  exclude: [
    'cypress/e2e/**',          // Test specs — not source
    'cypress/support/**',      // Support files — tested via E2E
    'cypress/pages/**',        // Page Objects — tested via E2E
    'cypress/fixtures/**',     // Test data — tested via E2E
    'cypress.config.ts',       // Configuration
    'scripts/**',              // Build scripts
    'test-server/**',          // Test server fixtures
    '**/*.d.ts',
    '**/*.config.ts',
    '**/*.config.js',
    '**/*.mjs',
  ],
  reporter: ['text', 'html', 'lcov', 'json-summary'],
  reportsDir: './coverage',
};