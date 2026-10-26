const { execSync, spawn } = require('child_process');
const http = require('http');

const suite = process.argv[2] || 'smoke';

async function main() {
  console.log(`Starting test server for ${suite} suite...`);

  // Start server in background
  const server = spawn('node', ['test-server/server.js'], {
    detached: true,
    stdio: 'ignore',
  });
  server.unref();

  // Wait for server to be ready
  let serverReady = false;
  for (let i = 0; i < 30; i++) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.get('http://localhost:3000/', (res) => {
          serverReady = true;
          res.resume();
          resolve();
        });
        req.on('error', (e) => reject(e));
        req.setTimeout(1000, () => {
          req.destroy();
          reject(new Error('timeout'));
        });
      });
      if (serverReady) break;
    } catch (e) {
      console.log(`Waiting for server... (${i + 1}/30)`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  if (!serverReady) {
    console.error('Test server failed to start');
    process.exit(1);
  }

  console.log('Test server is ready. Running Cypress tests...');

  try {
    execSync(
      `npx cypress run --spec "cypress/e2e/${suite}/**/*.cy.ts"`,
      { stdio: 'inherit', timeout: 120000 }
    );
    console.log('Tests passed!');
    process.exit(0);
  } catch (error) {
    console.error('Tests failed!');
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});