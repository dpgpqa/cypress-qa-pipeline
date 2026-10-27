# Cypress 16.2.0 — Nuevas características

Esta carpeta documenta y valida las novedades de **Cypress 16.2.0** (released Oct 13, 2026) contra [SauceDemo](https://www.saucedemo.com).

## Cambios destacados

| Cambio | Descripción |
|--------|-------------|
| `cy.getByRole()` | Nueva query nativa para buscar elementos por rol ARIA y nombre accesible, como lo anuncia un lector de pantalla. |
| `cy.go()` | Ahora espera a que la página cargue completamente, yields el `window`, respeta `timeout` y `pageLoadTimeout`. |
| mTLS client certificates | Vuelven a presentarse en Chrome, Chromium y Edge. |
| `cy.end()` | Deprecado; se eliminará en versión futura. |
| `cy.location()` | Tipado TypeScript mejorado (objeto plano, `searchParams` tipado). |

## Cómo usar estos ejemplos

```bash
# Ejecutar todos los tests de la versión 16
npx cypress run --spec "cypress/e2e/version-features/cypress-16/**/*.cy.ts"

# Ejecutar solo getByRole
npx cypress run --spec "cypress/e2e/version-features/cypress-16/getByRole.cy.ts"
```

## Archivos

- [`getByRole.cy.ts`](./getByRole.cy.ts) — Casos de uso de `cy.getByRole()` contra SauceDemo.
- [`cy-go.cy.ts`](./cy-go.cy.ts) — Casos de uso de `cy.go()` con espera de carga de página.

---

> Fuente: [Cypress 16.2.0 Release Notes](https://www.cypress.io/releases/16-2-0) y [Changelog oficial](https://docs.cypress.io/app/references/changelog).