/**
 * Build Quality Observability Dashboard (Bento Grid UI) for GitHub Pages.
 * Reads merged CTRF reports and generates an interactive Dark Mode SPA.
 */

import { readFileSync, existsSync, readdirSync, statSync, mkdirSync, writeFileSync } from 'fs';

const ROOT = process.cwd();
const MERGED_DIR = `${ROOT}/merged-reports`;
const PUBLIC_DIR = `${ROOT}/public`;
const ARTIFACTS_DIR = `${ROOT}/artifacts`;

function ensureDir(dir) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

function readJson(path) {
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    return null;
  }
}

// Collect all CTRF reports from artifact downloads
const suites = ['smoke', 'api', 'a11y', 'regression', 'data-driven', 'security'];
const allResults = [];

for (const suite of suites) {
  const suiteDir = `${ARTIFACTS_DIR}/${suite}`;
  if (!existsSync(suiteDir)) continue;
  const files = readdirSync(suiteDir);
  for (const file of files) {
    if (!file.endsWith('.json')) continue;
    const report = readJson(`${suiteDir}/${file}`);
    if (!report) continue;
    const results = report.results || report.tests || [];
    for (const r of results) {
      allResults.push({
        suite,
        name: r.name || r.title || 'Unknown',
        status: r.status || 'unknown',
        duration: r.duration || 0,
        error: r.error || null,
        stack: r.stack || null,
        screenshot: r.screenshot || null,
      });
    }
  }
}

// KPIs
const totalTests = allResults.length;
const passedTests = allResults.filter((r) => r.status === 'passed').length;
const failedTests = allResults.filter((r) => r.status === 'failed').length;
const skippedTests = allResults.filter((r) => r.status === 'skipped').length;
const passRate = totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(1) : '0.0';
const totalDuration = allResults.reduce((acc, r) => acc + r.duration, 0);

// Per-suite stats
const suiteStats = {};
for (const suite of suites) {
  const sr = allResults.filter((r) => r.suite === suite);
  suiteStats[suite] = {
    total: sr.length,
    passed: sr.filter((r) => r.status === 'passed').length,
    failed: sr.filter((r) => r.status === 'failed').length,
    skipped: sr.filter((r) => r.status === 'skipped').length,
    duration: sr.reduce((acc, r) => acc + r.duration, 0),
  };
}

const flakyTests = allResults.filter((r) => r.status === 'flaky').length;
const securityAlerts = suiteStats.security ? suiteStats.security.failed : 0;

// Escape HTML
const esc = (s) =>
  String(s ?? '').replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]
  );

// Build HTML
const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Quality Observability Dashboard</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet" />
  <style>
    body { font-family: 'Inter', sans-serif; background: #0f172a; color: #e2e8f0; }
    .glass { background: rgba(30, 41, 59, 0.7); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.08); }
    .card-pass { border-left: 4px solid #22c55e; }
    .card-fail { border-left: 4px solid #ef4444; }
    .card-warn { border-left: 4px solid #f59e0b; }
    .btn-active { background: #3b82f6; color: white; }
    .fade-in { animation: fadeIn 0.4s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .test-row { transition: all 0.2s; }
    .test-row:hover { background: rgba(255,255,255,0.03); }
    .status-badge { padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: 600; }
    .status-passed { background: #22c55e20; color: #4ade80; border: 1px solid #22c55e40; }
    .status-failed { background: #ef444420; color: #f87171; border: 1px solid #ef444440; }
    .status-skipped { background: #f59e0b20; color: #fbbf24; border: 1px solid #f59e0b40; }
    .status-unknown { background: #64748b20; color: #cbd5e1; border: 1px solid #64748b40; }
    .stack-trace { font-family: ui-monospace, SFMono-Regular, monospace; font-size: 0.7rem; background: #020617; padding: 8px; border-radius: 6px; overflow-x: auto; max-height: 200px; overflow-y: auto; }
  </style>
</head>
<body class="min-h-screen p-4 md:p-8">
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <header class="mb-8 fade-in">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-white tracking-tight">Quality Observability</h1>
          <p class="text-slate-400 mt-1">Dashboard de calidad — Ejecución CI $_{{ github.run_id || 'local' }}</p>
        </div>
        <div class="flex gap-2">
          <span class="px-3 py-1 rounded-full bg-slate-700 text-slate-300 text-sm">Cypress 16</td>
          <span class="px-3 py-1 rounded-full bg-blue-600/20 text-blue-400 text-sm border border-blue-500/30">CTRF</span>
        </div>
      </div>
    </header>

    <!-- KPI Cards (Bento Grid Row 1) -->
    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8 fade-in">
      <div class="glass p-6 rounded-xl card-pass h-full">
        <p class="text-slate-400 text-sm font-medium mb-1">Total Tests</p>
        <p class="text-3xl font-bold text-white">${totalTests}</p>
      </div>
      <div class="glass p-6 rounded-xl card-pass h-full">
        <p class="text-slate-400 text-sm font-medium mb-1">Pass Rate</p>
        <p class="text-3xl font-bold text-green-400">${passRate}%</p>
      </div>
      <div class="glass p-6 rounded-xl ${failedTests > 0 ? 'card-fail' : 'card-pass'} h-full">
        <p class="text-slate-400 text-sm font-medium mb-1">Fallidos</p>
        <p class="text-3xl font-bold ${failedTests > 0 ? 'text-red-400' : 'text-green-400'}">${failedTests}</p>
      </div>
      <div class="glass p-6 rounded-xl card-warn h-full">
        <p class="text-slate-400 text-sm font-medium mb-1">Flaky Tests</p>
        <p class="text-3xl font-bold text-yellow-400">${flakyTests}</p>
      </div>
      <div class="glass p-6 rounded-xl card-warn h-full">
        <p class="text-slate-400 text-sm font-medium mb-1">Security Alerts</p>
        <p class="text-3xl font-bold text-yellow-400">${securityAlerts}</p>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 fade-in">
      <div class="glass p-6 rounded-xl h-64">
        <h3 class="text-slate-300 font-semibold mb-4">Tests por Suite</h3>
        <canvas id="suiteChart"></canvas>
      </div>
      <div class="glass p-6 rounded-xl h-64">
        <h3 class="text-slate-300 font-semibold mb-4">Estado Global</h3>
        <canvas id="statusChart"></canvas>
      </div>
    </div>

    <!-- Suite Tabs -->
    <div class="fade-in">
      <div class="flex gap-1 mb-4">
        ${suites
          .map(
            (s) => `
          <button onclick="filterSuite('${s}')" id="tab-${s}" class="suite-tab px-4 py-2 rounded-lg text-sm font-medium transition-all ${s === 'smoke' ? 'btn-active' : 'bg-slate-700/50 text-slate-400 hover:bg-slate-600'}" data-suite="${s}">
            ${s.charAt(0).toUpperCase() + s.slice(1)} (${suiteStats[s]?.total || 0})
          </button>
        `
          )
          .join('')}
      </div>

      <div class="glass rounded-xl overflow-hidden">
        <table class="w-full text-left">
          <thead class="bg-slate-800/50">
            <tr>
              <th class="px-4 py-3 text-slate-400 text-sm font-semibold">Test</th>
              <th class="px-4 py-3 text-slate-400 text-sm font-semibold">Suite</th>
              <th class="px-4 py-3 text-slate-400 text-sm font-semibold">Estado</th>
              <th class="px-4 py-3 text-slate-400 text-sm font-semibold">Duración</th>
            </tr>
          </thead>
          <tbody id="testTableBody" class="divide-y divide-slate-700/50">
            ${allResults
              .map(
                (r) => `
              <tr class="test-row group ${r.status === 'failed' ? 'bg-red-500/10' : ''} data-suite="${r.suite}" data-status="${r.status}">
                <td class="px-4 py-3 text-sm">${esc(r.name)}</td>
                <td class="px-4 py-3 text-sm text-slate-400">${esc(r.suite)}</td>
                <td class="px-4 py-3 text-sm"><span class="status-badge status-${r.status}">${esc(r.status)}</span></td>
                <td class="px-4 py-3 text-sm text-slate-400">${r.duration}ms</td>
              </tr>
              ${
                r.status === 'failed' && r.error
                  ? `
              <tr class="bg-slate-900/50">
                <td colspan="4" class="px-4 py-3">
                  <div class="ml-4 bg-slate-950 p-3 rounded border border-slate-700/50">
                    <div class="text-xs text-red-400 font-mono mb-2">${esc(r.error.message || r.error || '')}</div>
                    ${r.stack ? `<div class="stack-trace mt-2">${esc(r.stack)}</div>` : ''}
                  </div>
                </td>
              </tr>
              `
                  : ''
              }
            `
              )
              .join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Security Section -->
    ${
      suiteStats.security
        ? `
    <div class="mt-8 fade-in">
      <h3 class="text-slate-300 font-semibold mb-4">🔐 OWASP ZAP Security Scan</h3>
      <div class="glass p-6 rounded-xl">
        <p class="text-slate-400 mb-4">Alertas de seguridad detectadas: <span class="text-red-400 font-bold">${suiteStats.security.failed}</span></p>
        <a href="./security/index.html" class="text-blue-400 hover:text-blue-300 underline" target="_blank">Ver reporte completo de ZAP →</a>
      </div>
    </div>
    `
        : ''
    }
  </div>

  <script>
    // Suite charts
    const suiteCtx = document.getElementById('suiteChart').getContext('2d');
    new Chart(suiteCtx, {
      type: 'doughnut',
      data: {
        labels: [${suites.map((s) => `'${esc(s)}'`).join(',')}],
        datasets: [{
          data: [${suites.map((s) => suiteStats[s]?.total || 0).join(',')}],
          backgroundColor: ['#3b82f6', '#22c55e', '#a855f7', '#f59e0b', '#ef4444', '#64748b'],
          borderWidth: 0,
        }]
      },
      options: {
        plugins: { legend: { position: 'bottom', labels: { color: '#cbd5e1', font: { family: 'Inter' } } } },
        cutout: '70%',
      }
    });

    const statusCtx = document.getElementById('statusChart').getContext('2d');
    new Chart(statusCtx, {
      type: 'pie',
      data: {
        labels: ['Passed', 'Failed', 'Skipped'],
        datasets: [{
          data: [${passedTests}, ${failedTests}, ${skippedTests}],
          backgroundColor: ['#22c55e', '#ef4444', '#f59e0b'],
          borderWidth: 0,
        }]
      },
      options: {
        plugins: { legend: { position: 'bottom', labels: { color: '#cbd5e1', font: { family: 'Inter' } } } },
      }
    });

    function filterSuite(suite) {
      document.querySelectorAll('.suite-tab').forEach(tab => {
        const isActive = tab.dataset.suite === suite;
        tab.className = isActive
          ? 'suite-tab px-4 py-2 rounded-lg text-sm font-medium transition-all btn-active'
          : 'suite-tab px-4 py-2 rounded-lg text-sm font-medium transition-all bg-slate-700/50 text-slate-400 hover:bg-slate-600';
      });
      document.querySelectorAll('.test-row').forEach(row => {
        const match = suite === 'all' || row.dataset.suite === suite;
        row.style.display = match ? '' : 'none';
      });
      // Also hide/show failure detail rows
      document.querySelectorAll('tbody tr').forEach(row => {
        if (!row.classList.contains('test-row')) {
          const prev = row.previousElementSibling;
          row.style.display = prev && prev.style.display !== 'none' ? '' : 'none';
        }
      });
    }
  </script>
</body>
</html>`;

ensureDir(MERGED_DIR);
ensureDir(PUBLIC_DIR);

// Copy security report if exists
const securitySrc = `${ARTIFACTS_DIR}/security/report_html.html`;
const securityDst = `${PUBLIC_DIR}/security`;
if (existsSync(securitySrc)) {
  ensureDir(securityDst);
  require('fs').cpSync(securitySrc, `${securityDst}/index.html`);
}

writeFileSync(`${MERGED_DIR}/index.html`, html);
console.log(`Dashboard built: ${totalTests} tests, ${passRate}% pass rate`);
