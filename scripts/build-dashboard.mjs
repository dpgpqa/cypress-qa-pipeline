#!/usr/bin/env node
/**
 * Dashboard Builder with Healer Integration
 * Generates a Quality Observability Dashboard for GitHub Pages
 * with Self-Healing suggestions from CTRF reports
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

async function parseTestSuites() {
  const suites = [
    { name: 'smoke', total: 0, passed: 0, failed: 0, skipped: 0, duration: 0, healerContexts: [] },
    { name: 'regression', total: 0, passed: 0, failed: 0, skipped: 0, duration: 0, healerContexts: [] },
    { name: 'api', total: 0, passed: 0, failed: 0, skipped: 0, duration: 0, healerContexts: [] },
    { name: 'accessibility', total: 0, passed: 0, failed: 0, skipped: 0, duration: 0, healerContexts: [] },
    { name: 'visual', total: 0, passed: 0, failed: 0, skipped: 0, duration: 0, healerContexts: [] },
  ];

  const ctrfDir = path.join(process.cwd(), 'ctrf');
  if (!fs.existsSync(ctrfDir)) return suites;

  for (const suite of suites) {
    const suiteDir = path.join(ctrfDir, suite.name);
    if (!fs.existsSync(suiteDir)) continue;

    const files = fs.readdirSync(suiteDir).filter(f => f.endsWith('.json'));

    for (const file of files) {
      try {
        const content = fs.readFileSync(path.join(suiteDir, file), 'utf-8');
        const report = JSON.parse(content);

        for (const result of report.results) {
          suite.total++;
          suite.duration += result.duration || 0;

          if (result.status === 'passed') suite.passed++;
          else if (result.status === 'failed') suite.failed++;
          else if (result.status === 'skipped') suite.skipped++;
        }
      } catch (e) {
        console.warn(`Failed to parse ${suite.name}/${file}:`, e);
      }
    }
  }

  return suites;
}

function getSuiteColor(name) {
  const colors = {
    smoke: 'blue',
    regression: 'purple',
    api: 'cyan',
    accessibility: 'green',
    visual: 'orange',
  };
  return colors[name] || 'slate';
}

function getSuiteIcon(name) {
  const icons = {
    smoke: 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664zM21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    regression: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    api: 'M13 10V3L4 14h7v7l9-11h-7z',
    accessibility: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    visual: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
  };
  return icons[name] || 'M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
}

async function buildDashboard() {
  const ctrfPath = path.join(process.cwd(), 'ctrf', 'ctrf-report.json');
  const healerContexts = extractHealerContexts(ctrfPath);
  const suites = await parseTestSuites();

  // Associate healer contexts with suites
  for (const suite of suites) {
    suite.healerContexts = healerContexts.filter(ctx =>
      ctx.testFile?.toLowerCase().includes(suite.name.toLowerCase()) ||
      ctx.testTitle?.toLowerCase().includes(suite.name.toLowerCase())
    );
  }

  const totalTests = suites.reduce((sum, s) => sum + s.total, 0);
  const totalPassed = suites.reduce((sum, s) => sum + s.passed, 0);
  const totalFailed = suites.reduce((sum, s) => sum + s.failed, 0);
  const totalSkipped = suites.reduce((sum, s) => sum + s.skipped, 0);
  const passRate = totalTests > 0 ? ((totalPassed / totalTests) * 100).toFixed(1) : '0.0';

  const suiteData = suites.map(s => ({
    name: s.name,
    passed: s.passed,
    failed: s.failed,
    skipped: s.skipped,
    total: s.total,
    passRate: s.total > 0 ? ((s.passed / s.total) * 100).toFixed(1) : '0.0',
    healerCount: s.healerContexts.length,
  }));

  const html = generateDashboardHtml(suites, suiteData, totalTests, totalPassed, totalFailed, totalSkipped, passRate, healerContexts.length);

  const outputPath = path.join(process.cwd(), 'index.html');
  fs.writeFileSync(outputPath, html);
  console.log('✅ Dashboard generated at:', outputPath);
}

function generateDashboardHtml(
  suites,
  suiteData,
  totalTests,
  totalPassed,
  totalFailed,
  totalSkipped,
  passRate,
  totalHealerCount
) {
  const healerContexts = suites.flatMap(s => s.healerContexts);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Quality Observability — Cypress QA Pipeline</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; background: #0f172a; color: #e2e8f0; }
    .mono { font-family: 'JetBrains Mono', monospace; }
    .glass { background: rgba(30, 41, 59, 0.6); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.06); box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37); }
    .glass-card { background: linear-gradient(145deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01)); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; transition: all 0.3s ease; }
    .glass-card:hover { border-color: rgba(59, 130, 246, 0.4); box-shadow: 0 12px 40px -5px rgba(59, 130, 246, 0.15); transform: translateY(-2px); }
    .stat-number { font-variant-numeric: tabular-nums; }
    .badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; }
    .badge-passed { background: rgba(34, 197, 94, 0.15); color: #86efac; border: 1px solid rgba(34, 197, 94, 0.3); }
    .badge-failed { background: rgba(239, 68, 68, 0.15); color: #fca5a5; border: 1px solid rgba(239, 68, 68, 0.3); }
    .badge-skipped { background: rgba(245, 158, 11, 0.15); color: #fcd34d; border: 1px solid rgba(245, 158, 11, 0.3); }
    .status-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; margin-right: 6px; }
    .dot-passed { background: #22d3ee; box-shadow: 0 0 12px #22d3ee; }
    .dot-failed { background: #ef4444; box-shadow: 0 0 12px #ef4444; }
    .dot-skipped { background: #f59e0b; box-shadow: 0 0 12px #f59e0b; }
    .chart-container { position: relative; height: 260px; width: 100%; }
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: #0f172a; }
    ::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
    ::-webkit-scrollbar-thumb:hover { background: #475569; }
    .healer-card { background: linear-gradient(145deg, rgba(255,255,255,0.02), rgba(255,255,255,0)); border: 1px solid rgba(251, 191, 36, 0.3); border-radius: 12px; }
    .healer-card:hover { border-color: rgba(251, 191, 36, 0.6); box-shadow: 0 8px 32px -4px rgba(251, 191, 36, 0.15); }
  </style>
</head>
<body class="min-h-screen antialiased selection:bg-blue-500 selection:text-white">
  <div class="fixed inset-0 -z-10 bg-[#0f172a]">
    <div class="absolute top-[-10%] left-[-10%] w-[30%] h-[30%] rounded-full bg-blue-600/10 blur-[120px]"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-purple-600/10 blur-[120px]"></div>
    <div class="absolute top-[20%] right-[-5%] w-[20%] h-[20%] rounded-full bg-pink-600/10 blur-[100px]"></div>
  </div>

  <div class="max-w-7xl mx-auto p-4 md:p-6">
    <header class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-3 mb-2">
          <div class="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
            <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v1m-6 9h1.264a1 1 0 000.632 0h1.264a1 1 0 000.632 0H17a1 1 0 011 1v1a1 1 0 01-1 1H6a1 1 0 01-1-1v-1a1 1 0 011-1z"></path></svg>
          </div>
          <h1 class="text-2xl font-bold text-white tracking-tight">Quality Observability</h1>
        </div>
        <p class="text-slate-400 text-sm">Dashboard de calidad — <span class="mono text-xs font-bold text-white">CI</span> • Cypress 13 • CTRF + Self-Healing</p>
      </div>
      <div class="flex gap-2">
        <span class="px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-medium"><span class="w-2 h-2 rounded-full bg-green-400 inline-block mr-1.5"></span>Cypress 13</span>
        <span class="px-3 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-medium">CTRF JSON</span>
        <span class="px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-medium">Self-Healing</span>
      </div>
    </header>

    <!-- KPI Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      <div class="glass-card p-5 rounded-2xl fade-in stagger-1">
        <div class="flex items-end justify-between mb-2">
          <p class="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Tests</p>
          <div class="flex items-baseline gap-1"><span class="stat-number text-3xl font-bold text-white">${totalTests}</span><span class="text-sm text-slate-500 font-medium">tests</span></div>
        </div>
        <div class="h-0.5 w-full bg-gradient-to-r from-transparent via-blue-500/40 to-transparent mt-3"></div>
      </div>
      <div class="glass-card p-5 rounded-2xl fade-in stagger-2">
        <div class="flex items-end justify-between mb-2">
          <p class="text-slate-400 text-xs font-semibold uppercase tracking-wider">Pass Rate</p>
          <div class="flex items-baseline gap-1"><span class="stat-number text-3xl font-bold text-green-400">${passRate}</span><span class="text-sm text-slate-500 font-medium">%</span></div>
        </div>
        <div class="h-0.5 w-full bg-gradient-to-r from-transparent via-green-400/40 to-transparent mt-3"></div>
      </div>
      <div class="glass-card p-5 rounded-2xl fade-in stagger-3">
        <div class="flex items-end justify-between mb-2"><p class="text-slate-400 text-xs font-semibold uppercase tracking-wider">Fallidos</p><div class="flex items-baseline gap-1"><span class="stat-number text-3xl font-bold text-green-400">${totalFailed}</span><span class="text-sm text-slate-500 font-medium">tests</span></div></div>
        <div class="h-0.5 w-full bg-gradient-to-r from-transparent via-green-400/40 to-transparent mt-3"></div>
      </div>
      <div class="glass-card p-5 rounded-2xl fade-in stagger-4"><div class="flex items-end justify-between mb-2"><p class="text-slate-400 text-xs font-semibold uppercase tracking-wider">Skipped</p><div class="flex items-baseline gap-1"><span class="stat-number text-3xl font-bold text-green-400">${totalSkipped}</span><span class="text-sm text-slate-500 font-medium">tests</span></div></div><div class="h-0.5 w-full bg-gradient-to-r from-transparent via-green-400/40 to-transparent mt-3"></div></div>
      <div class="glass-card p-5 rounded-2xl fade-in stagger-5"><div class="flex items-end justify-between mb-2"><p class="text-slate-400 text-xs font-semibold uppercase tracking-wider">AI Healing</p><div class="flex items-baseline gap-1"><span class="stat-number text-3xl font-bold text-amber-400">${healerContexts.length}</span><span class="text-sm text-slate-500 font-medium">suggestions</span></div></div><div class="h-0.5 w-full bg-gradient-to-r from-transparent via-amber-400/40 to-transparent mt-3"></div></div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div class="glass-card p-6 rounded-2xl fade-in stagger-1"><div class="flex items-center justify-between mb-6"><h3 class="text-sm font-semibold text-slate-200">Tests por Suite</h3><span class="text-xs text-slate-500">${totalTests} tests</span></div><div class="chart-container"><canvas id="suiteChart"></canvas></div></div>
      <div class="glass-card p-6 rounded-2xl fade-in stagger-2"><div class="flex items-center justify-between mb-6"><h3 class="text-sm font-semibold text-slate-200">Estado Global</h3><span class="text-xs text-slate-500">Pass / Fail / Skip</span></div><div class="chart-container"><canvas id="statusChart"></canvas></div></div>
    </div>

    <!-- Suite Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      ${suiteData.map((s, i) => `
      <div class="glass-card p-5 rounded-xl fade-in stagger-${i + 1}">
        <div class="flex items-center gap-3 mb-4"><div class="w-10 h-10 rounded-lg bg-${getSuiteColor(s.name)}20 flex items-center justify-center"><svg class="w-5 h-5 text-${getSuiteColor(s.name)}" fill="none" stroke="currentColor" viewBox="0 0 24 24">${getSuiteIcon(s.name)}</svg></div><span class="font-semibold text-slate-200 capitalize">${s.name}</span></div>
        <div class="space-y-2"><div class="flex justify-between"><span class="text-slate-400 text-sm">Pasados</span><span class="font-semibold text-green-400 mono">${s.passed}</span></div><div class="flex justify-between"><span class="text-slate-400 text-sm">Fallidos</span><span class="font-semibold text-red-400 mono">${s.failed}</span></div><div class="flex justify-between"><span class="text-slate-400 text-sm">Skipped</span><span class="font-semibold text-amber-400 mono">${s.skipped}</span></div><div class="flex justify-between border-t border-slate-800/50 pt-2"><span class="text-slate-400 text-sm">Pass Rate</span><span class="font-bold text-green-400">${s.passRate}%</span></div>${s.healerCount > 0 ? `<div class="mt-2 p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg"><div class="flex items-center gap-2 text-amber-400 text-xs"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 3v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><span>${s.healerCount} AI suggestions</span></div></div>` : ''}</div></div>
      `).join('')}
    </div>

    <!-- Healer Suggestions Section -->
    ${totalHealerCount > 0 ? `
    <div class="glass-card rounded-2xl overflow-hidden fade-in stagger-1 mt-8">
      <div class="p-6 border-b border-slate-800/50">
        <h3 class="text-sm font-semibold text-slate-200 mb-6">🩹 Self-Healing Suggestions</h3>
        <p class="text-sm text-slate-400 mb-6">AI-powered selector suggestions for failed tests. Click to copy the suggested fix.</p>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="healerGrid">
          ${healerContexts.map((ctx, i) => `
          <div class="healer-card p-5 rounded-xl" onclick="copyToClipboard('${ctx.bestCandidateSelector?.replace(/'/g, "\\'") || ''}')">
            <div class="flex items-start gap-3 mb-4"><div class="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center"><svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 3v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div><div><div class="font-semibold text-slate-200 text-sm">${ctx.testTitle}</div><div class="text-xs text-slate-500">${ctx.testFile}</div></div></div>
            <div class="space-y-3"><div class="bg-slate-900/50 rounded-lg p-3"><div class="flex items-center gap-2 mb-2"><span class="text-xs text-slate-400 font-mono">Broken:</span><code class="text-red-400 font-mono text-xs break-all">${ctx.brokenSelector}</code></div>${ctx.bestCandidateSelector ? `<div class="flex items-center gap-2"><span class="text-xs text-slate-400 font-mono">Suggested:</span><code class="text-green-400 font-mono text-xs break-all cursor-pointer hover:text-green-300" onclick="copyToClipboard('${ctx.bestCandidateSelector.replace(/'/g, "\\'")}')" title="Click to copy">${ctx.bestCandidateSelector}</code><span class="ml-auto text-xs text-green-400 font-medium">${ctx.confidence}%</span></div>` : `<div class="text-xs text-red-400">No candidate found</div>`}</div>${ctx.availableInteractiveSelectors.length > 0 ? `<div class="bg-slate-900/50 rounded-lg p-3 max-h-40 overflow-y-auto"><div class="text-xs text-slate-400 mb-2">Available elements:</div><div class="space-y-1">${ctx.availableInteractiveSelectors.slice(0, 8).map((item, idx) => `<div class="flex items-center gap-2 text-xs"><code class="text-slate-300 font-mono text-xs bg-slate-800 px-1.5 py-0.5 rounded">${item.selector}</code><span class="text-slate-500 truncate">${item.text}</span></div>`).join('')}</div></div>` : ''}</div></div>
          `).join('')}
        </div>
      </div>
    </div>
    ` : ''}

    <!-- Footer -->
    <footer class="mt-8 pt-6 border-t border-slate-800/30"><div class="flex flex-col md:flex-row md:items-center justify-between gap-3 text-sm text-slate-500"><div class="flex items-center gap-2"><svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg><span>Cypress QA Pipeline</span></div><span class="text-xs">${totalTests} tests • ${passRate}% pass rate • Built with CTRF + Self-Healing</span></div></footer>
  </div>

  <script>
    const suiteCtx = document.getElementById('suiteChart').getContext('2d');
    new Chart(suiteCtx, { type: 'doughnut', data: { labels: ${JSON.stringify(suiteData.map(s => s.name.charAt(0).toUpperCase() + s.name.slice(1)))}, datasets: [{ data: ${JSON.stringify(suiteData.map(s => s.total))}, backgroundColor: ['#3b82f6', '#22d3ee', '#a855f7', '#f59e0b', '#64748b'], borderWidth: 0, hoverOffset: 4 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', font: { family: 'Inter', size: 11 }, padding: 20 } }, tooltip: { backgroundColor: 'rgba(15, 23, 42, 0.9)', titleColor: '#e2e8f0', bodyColor: '#cbd5e1', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1, padding: 10 } }, cutout: '70%' } });

    const statusCtx = document.getElementById('statusChart').getContext('2d');
    new Chart(statusCtx, { type: 'pie', data: { labels: ['Passed', 'Failed', 'Skipped'], datasets: [{ data: [${totalPassed}, ${totalFailed}, ${totalSkipped}], backgroundColor: ['#22d3ee', '#ef4444', '#f59e0b'], borderWidth: 0 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', font: { family: 'Inter', size: 11 }, padding: 20 } } } });

    function copyToClipboard(text) { navigator.clipboard.writeText(text).then(() => { const toast = document.createElement('div'); toast.textContent = 'Copied: ' + text.substring(0, 50); toast.style.cssText = 'position: fixed; bottom: 20px; right: 20px; background: #22d3ee; color: #0f172a; padding: 12px 20px; border-radius: 8px; font-weight: 600; z-index: 9999; box-shadow: 0 4px 20px rgba(34, 211, 238, 0.4);'; document.body.appendChild(toast); setTimeout(() => toast.remove(), 2000); }); }
  </script>
</body>
</html>`;
}

await buildDashboard();