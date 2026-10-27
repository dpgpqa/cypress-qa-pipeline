# Cypress QA Pipeline

Pipeline completo de pruebas E2E con **Cypress 13**, **TypeScript**, **Page Object Model**, **CTRF reporting**, **Self-Healing** y **dashboard en GitHub Pages**.

[![CI Status](https://github.com/dpgpqa/cypress-qa-pipeline/actions/workflows/ci.yml/badge.svg)](https://github.com/dpgpqa/cypress-qa-pipeline/actions)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Deployed-blue?logo=github)](https://dpgpqa.github.io/cypress-qa-pipeline/)
[![Cypress 13](https://img.shields.io/badge/Cypress-13-green)](https://docs.cypress.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)

## 📊 Estado de las pruebas

| Suite | Total | Pasados | Fallados | Skipped | Pass Rate |
|-------|-------|---------|----------|---------|-----------|
| Smoke | 16 | 16 | 0 | 0 | 100% |
| Regression | 9 | 9 | 0 | 0 | 100% |
| API | 5 | 5 | 0 | 0 | 100% |
| Accessibility | 6 | 6 | 0 | 0 | 100% |
| Visual | 8 | 8 | 0 | 0 | 100% |
| **Total** | **44** | **44** | **0** | **0** | **100%** |

## 🚀 Inicio rápido

### 1. Clonar el repositorio

```bash
git clone https://github.com/dpgpqa/cypress-qa-pipeline.git
cd cypress-qa-pipeline
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Ejecutar pruebas

```bash
# Todas las pruebas
npm test

# Solo smoke
npm run test:smoke

# Solo regression
npm run test:regression

# Solo API
npm run test:api

# Solo accesibilidad
npm run test:a11y

# Solo visual
npm run test:visual
```

### 4. Typecheck y lint

```bash
# Verificar tipos de TypeScript
npm run typecheck

# Linter ESLint
npm run lint
```

## 🏗️ Estructura del proyecto

```
cypress-qa-pipeline/
├── .github/
│   └── workflows/
│       └── ci.yml              # Pipeline de GitHub Actions
├── cypress/
│   ├── config.ts               # Configuración de Cypress
│   ├── e2e/
│   │   ├── smoke/              # Pruebas de humo (login, navegación básica)
│   │   ├── regression/         # Pruebas de regresión (checkout, flujo completo)
│   │   ├── api/                # Pruebas de API (JSONPlaceholder, SauceDemo)
│   │   ├── accessibility/      # Pruebas de accesibilidad (axe-core)
│   │   └── visual/             # Pruebas visuales (imagen diff)
│   ├── pages/                  # Page Object Model
│   │   ├── BasePage.ts
│   │   ├── LoginPage.ts
│   │   ├── InventoryPage.ts
│   │   ├── CartPage.ts
│   │   ├── CheckoutInfoPage.ts
│   │   ├── CheckoutOverviewPage.ts
│   │   └── CheckoutCompletePage.ts
│   ├── fixtures/
│   │   └── test-data.ts        # Usuarios y datos de prueba
│   ├── support/
│   │   ├── commands.ts         # Comandos personalizados de Cypress
│   │   ├── e2e.ts              # Setup global de e2e
│   │   └── healer.ts           # Cypress Healer - Self-healing de selectores
│   └── cypress.config.ts
├── scripts/
│   ├── cypress-healer.mjs      # CLI de auto-reparación de selectores
│   └── build-dashboard.mjs     # Generador del dashboard de GitHub Pages
├── package.json
├── tsconfig.json
├── .eslintrc.json
└── README.md
```

## 🩹 Cypress Healer - Self-healing de selectores

El Healer detecta automáticamente cuando un selector falla y sugiere un reemplazo basado en los elementos presentes en el DOM.

### Cómo funciona

1. Escucha `Cypress.on('fail')` en `cypress/support/healer.ts`
2. Si el error es de selector (`Expected to find element:` o `Timed out retrying`), extrae el selector roto
3. Inspecciona el DOM actual (`Cypress.$('body')`) buscando elementos interactivos (`button`, `input`, `a`, `select`, `textarea`, `[data-qa]`, `[data-testid]`, `[id]`, `[role]`)
4. Calcula similitud entre el selector roto y los elementos disponibles
5. Adjunta un bloque JSON `[HEALER_CONTEXT_START]...[HEALER_CONTEXT_END]` al mensaje de error
6. `cypress-ctrf-json-reporter` captura este bloque en `ctrf/ctrf-report.json`

### CLI Healer

```bash
# Modo diagnóstico: leer reporte y mostrar sugerencias
npm run heal

# Modo auto-reparación: reemplazar selectores en el código y re-ejecutar pruebas
npm run heal:fix
```

Los scripts están en `package.json`:
```json
"heal": "node scripts/cypress-healer.mjs",
"heal:fix": "node scripts/cypress-healer.mjs --write"
```

## 📊 Dashboard de GitHub Pages

El dashboard se despliega automáticamente en GitHub Pages después de cada ejecución de CI:

**URL:** https://dpgpqa.github.io/cypress-qa-pipeline/

Incluye:
- KPIs (total de tests, pass rate, fallidos, skipped, sugerencias de healing)
- Gráficos de tests por suite y estado global
- Tarjetas por suite con detalles
- Sección de **Self-Healing Suggestions** con selectores rotos y candidatos de reemplazo
- Videos embebidos de todas las pruebas (pasadas y fallidas)

## 🔧 Scripts disponibles

| Script | Descripción |
|--------|-------------|
| `npm test` | Ejecutar todas las pruebas de Cypress |
| `npm run test:smoke` | Ejecutar solo pruebas de humo |
| `npm run test:regression` | Ejecutar solo pruebas de regresión |
| `npm run test:api` | Ejecutar solo pruebas de API |
| `npm run test:a11y` | Ejecutar solo pruebas de accesibilidad |
| `npm run test:visual` | Ejecutar solo pruebas visuales |
| `npm run typecheck` | Verificar tipos de TypeScript |
| `npm run lint` | Ejecutar ESLint |
| `npm run heal` | Diagnóstico del Healer (leer CTRF report) |
| `npm run heal:fix` | Auto-reparación de selectores |

## 🛠️ Tecnologías

- **Cypress 13** — Framework de pruebas E2E
- **TypeScript 5.9** — Tipado estático
- **ESLint + @typescript-eslint** — Linter y reglas de código
- **CTRF JSON Reporter** — Formato de reporte de pruebas
- **GitHub Actions** — CI/CD pipeline
- **GitHub Pages** — Hosting del dashboard
- **Tailwind CSS + Chart.js** — Dashboard frontend (vía CDN)

## ✅ Buenas prácticas aplicadas

- **Page Object Model** — Separación de lógica de página y pruebas
- **Selectores `data-test`** — Atributos dedicados para pruebas, no dependen de clases CSS
- **Fixtures centralizados** — Usuarios y datos en `cypress/fixtures/test-data.ts`
- **Retries automáticos** — 2 intentos en modo `runMode` de Cypress
- **Videos y screenshots** — Subidos como artifacts aunque las pruebas pasen
- **TypeScript estricto** — `strict: true` en tsconfig.json
- **Sin `cy.task` en el Healer** — Preserva el retry-ability nativo de `cy.get`

## 📄 Licencia

Privado — Uso interno.

---
*Última actualización: CI pipeline funcionando correctamente en rama `main`.*