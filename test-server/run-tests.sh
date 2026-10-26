#!/usr/bin/env bash
set -e

SUITE=$1

# Start test server in background
node test-server/server.js &
SERVER_PID=$!

# Wait for server to be ready
for i in $(seq 1 30); do
  if curl -s http://localhost:3000/ > /dev/null 2>&1; then
    echo "Test server is ready on port 3000"
    break
  fi
  echo "Waiting for test server... ($i/30)"
  sleep 1
done

# Run Cypress tests
echo "Running $SUITE tests..."
npx cypress run --spec "cypress/e2e/${SUITE}/**/*.cy.ts" --browser chrome
TEST_EXIT_CODE=$?

# Stop test server
kill $SERVER_PID 2>/dev/null || true
wait $SERVER_PID 2>/dev/null || true

exit $TEST_EXIT_CODE