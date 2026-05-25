# Playwright 

Playwright locators, built-in annotations, auto-waiting
actions, and the four flavors of assertions.

## Activities

### Activity 1 — MercadoLibre
`tests/activity1-mercadolibre.spec.ts`

One test block that exercises the 7 recommended locators on
`https://www.mercadolibre.com.mx/`:

| # | Locator           |
|---|-------------------|
| 1 | `getByRole`       |
| 2 | `getByText`       |
| 3 | `getByLabel`      |
| 4 | `getByPlaceholder`|
| 5 | `getByAltText`    |
| 6 | `getByTitle`      |
| 7 | `getByTestId`     |

### Activity 2 — TodoMVC
`tests/activity2-todomvc.spec.ts`

Five tests against `https://demo.playwright.dev/todomvc/#/` that cover:

- **Annotations**: `test.slow`, `test.fixme`, `test.fail`
- **The 7 recommended locators**
- **Auto-waiting actions** beyond `click`: `fill`, `press`, `check`, `hover`,
  `focus`, `dblclick`
- **Assertions**:
  - Auto-retrying / web-first (`expect(locator).toBeVisible()`,
    `toHaveClass`, `toHaveCount`, `toHaveText`)
  - Non-retrying (`expect(string).toContain(...)`)
  - Negative (`expect(locator).not.toBeVisible()`)
  - Soft (`expect.soft(...)`)

## Run

```bash
npm install
npx playwright install chromium
npm test
```

The HTML report lands in `playwright-report/`. Open it with:

```bash
npx playwright show-report
```

## Authors

- Author 1
- Author 2
