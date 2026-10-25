import { defineConfig } from 'cypress';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const isCI = !!process.env.CI;

export default defineConfig({
  e2e: {
    baseUrl: process.env.BASE_URL || 'https://www.saucedemo.com',
    specPattern: 'cypress/e2e/**/*.cy.{ts,tsx}',
    supportFile: 'cypress/support/e2e.ts',
    setupNodeEvents(on, config) {
      // Code coverage
      require('@cypress/code-coverage/task')(on, config);

      // Simple log task
      on('task', {
        log: (message) => {
          console.log(message);
          return null;
        },
      });

      // Check if a file exists (used for visual baseline detection)
      on('task', {
        fileExists: (filePath) => {
          const fs = require('fs');
          return fs.existsSync(filePath);
        },
      });

      // Write a base64-encoded file (used for creating visual baselines)
      on('task', {
        writeFileBase64: ({ filePath, data }) => {
          const fs = require('fs');
          fs.writeFileSync(filePath, Buffer.from(data, 'base64'));
          return null;
        },
      });

      // Image diff task for visual regression (safe wrapper, no Cypress global needed)
      on('task', {
        compareImages: (options) => {
          const { compareImages } = require('cypress-image-diff-js');
          return compareImages(options);
        },
        createImageDiff: (options) => {
          const { createImageDiff } = require('cypress-image-diff-js');
          return createImageDiff(options);
        },
      });

      // Update snapshots when env var is set
      if (process.env.UPDATE_SNAPSHOTS === 'true') {
        config.env.updateSnapshots = true;
      }

      return config;
    },
    video: !process.env.CYPRESS_DISABLE_VIDEO,
    screenshotOnRunFailure: true,
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
    defaultCommandTimeout: 10000,
    requestTimeout: 15000,
    responseTimeout: 15000,
    viewportWidth: 1280,
    viewportHeight: 720,
    retries: isCI ? 2 : 0,
  },

  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
    specPattern: 'cypress/component/**/*.cy.{ts,tsx}',
  },

  env: {
    apiBaseUrl: process.env.API_BASE_URL || 'https://jsonplaceholder.typicode.com',
    testUser: process.env.TEST_USER || 'standard_user',
    testPass: process.env.TEST_PASS || 'secret_sauce',
  },

  retries: {
    runMode: isCI ? 2 : 0,
    openMode: 0,
  },

  reporter: isCI ? 'junit' : 'spec',
  reporterOptions: {
    mochaFile: 'cypress/results/results-[hash].xml',
    toConsole: true,
  },

  watchForFileChanges: !isCI,
});
