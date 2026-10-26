#!/usr/bin/env node
/**
 * Cypress Healer CLI - Self-healing for flaky selectors
 * Modes: diagnose (default) and auto-fix (--write)
 */

import fs from 'fs';
import path from 'path';
import glob from 'glob';

const HEALER_CONTEXT_START = '[HEALER_CONTEXT_START]';
const HEALER_CONTEXT_END = '[HEALER_CONTEXT_END]';

function extractHealerContexts(ctrfPath) {
  const contexts = [];

  try {
    const content = fs.readFileSync(ctrfPath, 'utf-8');
    const report = JSON.parse(content);

    for (const result of report.results) {
      if (result.status === 'failed' && result.message) {
        const startIdx = result.message.indexOf(HEALER_CONTEXT_START);
        const endIdx = result.message.indexOf(HEALER_CONTEXT_END);

        if (startIdx !== -1 && endIdx !== -1) {
          const jsonStr = result.message.substring(
            startIdx + HEALER_CONTEXT_START.length,
            endIdx
          ).trim();

          try {
            const context = JSON.parse(jsonStr);
            contexts.push(context);
          } catch (e) {
            console.warn('Failed to parse healer context:', e);
          }
        }
      }
    }
  } catch (e) {
    console.error('Error reading CTRF report:', e);
  }

  return contexts;
}

function displayHealerReport(contexts) {
  console.log('\n╔══════════════════════════════════════════════════════════════════╗');
  console.log('║                    🩹 CYPRESS HEALER REPORT                       ║');
  console.log('╚═══════════════════════════════════════════════════════════════════╝\n');

  if (contexts.length === 0) {
    console.log('No healer contexts found. All tests passed or no selector failures detected.\n');
    return;
  }

  for (let i = 0; i < contexts.length; i++) {
    const ctx = contexts[i];
    console.log(`\n🔴 FAILURE ${i + 1}: ${ctx.testTitle}`);
    console.log(`   File: ${ctx.testFile}`);
    console.log(`   Broken Selector: ${ctx.brokenSelector}`);

    if (ctx.bestCandidateSelector) {
      console.log(`   ✅ Suggested Fix: ${ctx.bestCandidateSelector}`);
      console.log(`   Confidence: ${ctx.confidence}%`);
    } else {
      console.log(`   ❌ No candidate found`);
    }

    if (ctx.availableInteractiveSelectors.length > 0) {
      console.log(`   📋 Available Interactive Elements (top 15):`);
      ctx.availableInteractiveSelectors.forEach((item, idx) => {
        console.log(`      ${idx + 1}. ${item.selector}  →  ${item.text}`);
      });
    }
    console.log('─'.repeat(70));
  }
}

async function findAndReplaceSelectors(contexts, write = false) {
  let fixedCount = 0;

  for (const ctx of contexts) {
    if (!ctx.bestCandidateSelector || ctx.confidence < 50) continue;

    const files = await glob('cypress/**/*.ts');

    for (const file of files) {
      const content = fs.readFileSync(file, 'utf-8');

      if (content.includes(ctx.brokenSelector)) {
        const newContent = content.replace(
          new RegExp(ctx.brokenSelector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
          ctx.bestCandidateSelector
        );

        if (newContent !== content) {
          console.log(`\n📝 Found in: ${file}`);
          console.log(`   Replacing: ${ctx.brokenSelector}`);
          console.log(`   With:      ${ctx.bestCandidateSelector}`);

          if (write) {
            fs.writeFileSync(file, newContent, 'utf-8');
            console.log(`   ✅ Written to disk`);
          } else {
            console.log(`   🔍 Dry run - use --write to apply changes`);
          }
          fixedCount++;
        }
      }
    }
  }

  return fixedCount;
}

async function runHealer(writeMode = false) {
  const ctrfPath = path.join(process.cwd(), 'ctrf', 'ctrf-report.json');

  if (!fs.existsSync(ctrfPath)) {
    console.error('❌ CTRF report not found at:', ctrfPath);
    console.log('Run tests first: npx cypress run');
    process.exit(1);
  }

  console.log('🔍 Reading CTRF report...');
  const contexts = extractHealerContexts(ctrfPath);

  displayHealerReport(contexts);

  // Generate JSON report
  const reportPath = path.join(process.cwd(), 'cypress', 'reports', 'healer-report.json');
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify(contexts, null, 2));
  console.log(`\n📄 Healer report saved to: ${reportPath}`);

  if (writeMode) {
    console.log('\n🔧 Auto-fix mode enabled. Applying fixes...');
    const fixed = await findAndReplaceSelectors(contexts, true);
    console.log(`\n✅ Fixed ${fixed} selector(s) across test files`);

    if (fixed > 0) {
      console.log('\n🔄 Re-running tests to verify fixes...');
      console.log('Run: npx cypress run --spec <specFile> to verify');
    }
  } else {
    console.log('\n💡 Run with --write to auto-fix selectors:');
    console.log('   node scripts/cypress-healer.mjs --write');
  }
}

// Main execution
const args = process.argv.slice(2);
const writeMode = args.includes('--write');

await runHealer(writeMode);