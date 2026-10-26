import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.cy.{ts,tsx,js}',
    supportFile: 'cypress/support/e2e.ts',
    video: true,
    videoCompression: 32,
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
    defaultCommandTimeout: 10000,
    requestTimeout: 15000,
    responseTimeout: 15000,
    viewportWidth: 1280,
    viewportHeight: 720,
    retries: {
      runMode: 2,
      openMode: 0,
    },
  },
  // @ts-ignore - webServer is a valid Cypress config option
  webServer: {
    command: 'node test-server/server.js',
    port: 3000,
    timeout: 60000,
  },
});