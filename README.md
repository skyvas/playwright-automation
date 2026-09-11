# Playwright Automation Framework and MCP Agent Scaffold

A modern, production-grade test automation scaffold built with **Playwright**, TypeScript, and integrated **Model Context Protocol (MCP)** support for autonomous QA agents.

Designed as an extensible starter template, this project enables engineering teams and AI pair programmers to write, organize, and execute reliable automated tests across multiple tiers—from rapid smoke tests to full regression suites.

---

## Key Highlights

- **Tiered Test Architecture**: Dedicated directory structures for `smoke` tests (`@smoke`), `regression` suites, and reusable `fixtures`.
- **Page Object Model (POM)**: Robust, reusable, and maintainable page object architecture with a shared `BasePage`.
- **Playwright MCP Server Support**: Out-of-the-box MCP integration (`@playwright/mcp`) allowing AI agents (Antigravity, Claude Code, Cursor) to navigate, inspect, snapshot, and interact with web applications.
- **Specialized QA Agent Squad (`.agents/`)**: Embedded expert agent skills covering Test Automation, UX/User Feasibility, WCAG Accessibility (`a11y`), Performance, Form Validation, Code Review, and Quality Gatekeeping.
- **Cross-Browser and Device Emulation**: Pre-configured for Chromium, Firefox, WebKit, and mobile viewport simulation.
- **Rich Reporting and Diagnostics**: Auto-configured HTML reports, trace viewer, screenshots, and videos on test failures.
- **CI/CD Ready**: Pre-built GitHub Actions workflows for continuous integration and automated test execution.

---

## Project Architecture

```
playwright-automation/
├── .agents/                          # Embedded AI QA Agent Squad & MCP Config
│   ├── mcp_config.json               # Playwright MCP server definition
│   ├── rules/
│   │   └── playwright-standards.md   # Quality standards & locator rules for agents
│   ├── agents/                       # QA Specialist Personas
│   │   ├── qa-lead.md                # Quality strategy & test planning
│   │   ├── sdet-automation.md        # Playwright test & POM specialist
│   │   ├── ux-feasibility-auditor.md # UX heuristics, journey & a11y auditor
│   │   ├── qa-code-reviewer.md       # Anti-pattern detection & code reviewer
│   │   └── test-ingestion-orchestrator.md # Manual test ingestion & automation orchestrator
│   └── skills/                       # Modular QA skills (Playwright Pro, A11y, UX, etc.)
│       ├── playwright-pro/           # Test generator, reviewer, fixer, coverage
│       ├── a11y-audit/               # Accessibility testing & WCAG compliance
│       ├── ux-researcher-designer/   # Usability & feasibility heuristics
│       ├── form-cro/                 # Form validation & input UX testing
│       ├── performance-profiler/     # Core Web Vitals & performance auditing
│       ├── code-reviewer/            # QA code review & best practices
│       ├── focused-fix/              # Automated flakiness & bug remediation
│       ├── api-test-suite-builder/   # API testing patterns
│       └── ship-gate/                # Definition of Done & release gates
├── manual-tests/                     # Test Management System (TMS) Ingestion
│   ├── incoming/                     # Drop zone for exported manual tests (CSV, JSON, .feature, .md)
│   ├── examples/                     # Ready-to-use export templates (TestRail, Xray, Zephyr, MD)
│   ├── parsed/                       # Normalized test manifests (test-manifest.json)
│   └── traceability-matrix.md        # Bi-directional mapping: TMS ID -> Spec -> Status
├── pages/                            # Page Object Models (POM)
│   ├── BasePage.ts                   # Core page abstraction & shared actions
│   ├── LoginPage.ts                  # Authentication page objects
│   └── InventoryPage.ts              # Product catalog page objects
├── scripts/                          # Pipeline Automation Scripts
│   ├── parse-manual-tests.ts         # Multi-format TMS normalization engine
│   └── generate-automation.ts        # Autonomous Playwright spec & matrix generator
├── tests/                            # Automated Test Suites
│   ├── fixtures/
│   │   └── baseTest.ts               # Custom Playwright test fixture with injected POMs
│   ├── smoke/                        # Fast, high-priority sanity tests (@smoke)
│   │   └── auth.smoke.spec.ts
│   └── regression/                   # End-to-end full user journeys (@regression)
│       ├── e2e-shopping.spec.ts
│       └── ingested-tests.spec.ts    # Generated tests from ingested manual cases
├── utils/                            # Shared Utilities & Config
│   ├── env.ts                        # Environment configuration
│   └── testData.ts                   # Test datasets & mock payloads
├── .github/workflows/                # CI/CD Pipelines
│   └── playwright-ci.yml             # Automated CI workflow
├── playwright.config.ts              # Global Playwright configuration
├── package.json                      # Dependencies & NPM test scripts
├── tsconfig.json                     # TypeScript configuration
└── .env                              # Environment variables (URLs, credentials)
```

---

## Getting Started

### 1. Prerequisites
- **Node.js**: `v18.0.0` or later
- **npm**: `v9.0.0` or later

### 2. Installation

Clone this repository and install dependencies:

```bash
git clone https://github.com/skyvas/playwright-automation.git
cd playwright-automation
npm install
```

Install Playwright browsers and OS dependencies:

```bash
npx playwright install --with-deps
```

### 3. Environment Configuration

Copy the sample environment file and set your target environment URLs and test credentials:

```bash
cp .env.example .env
```

---

## Running Tests

This scaffold comes with tailored npm scripts to run test suites at different granularities:

| Command | Description |
| :--- | :--- |
| `npm test` | Run all test suites across all configured browsers in headless mode |
| `npm run test:smoke` | Run only the `@smoke` tests (critical-path smoke suite) |
| `npm run test:regression` | Run the full regression / end-to-end test suite (`tests/regression/`) |
| `npm run test:headed` | Run tests in headed browser mode (visible UI) |
| `npm run test:ui` | Open the interactive Playwright UI Runner |
| `npm run test:debug` | Launch the Playwright Inspector in step-by-step debug mode |
| `npm run test:report` | Serve and view the interactive HTML test report |

### Targeted Execution Examples

Run a specific test file:
```bash
npx playwright test tests/smoke/auth.smoke.spec.ts
```

Run tests on a specific browser:
```bash
npx playwright test --project=Chromium
```

Filter by test tag:
```bash
npx playwright test --grep "@smoke"
```

---

## Continuous Integration & Test Reporting

This project includes fully automated CI reporting via GitHub Actions:

- **Executive Job Summary**: High-level execution metrics (pass rate, test counts, failed tests table, duration) are rendered directly on the GitHub Actions workflow summary page (`$GITHUB_STEP_SUMMARY`).
- **PR Diff Annotations**: Playwright's `github` reporter annotates failing lines directly in pull request code reviews.
- **Report & Trace Artifacts**: The full HTML report (`playwright-report/`) and trace diagnostics (`test-results/` with traces, failure screenshots, and videos) are uploaded as workflow artifacts with a 14-day retention period.

---

## Playwright MCP Server Integration

This repository includes first-class support for the **Playwright Model Context Protocol (MCP)** server. This allows AI pair programmers and testing agents to:
- Directly control a headless or headed browser session
- Inspect the live DOM and generate accessible locators
- Execute exploratory testing sessions
- Take screenshots and trace user flows

### Starting the MCP Server Locally

Run headless mode:
```bash
npm run mcp:playwright
```

Run headed mode (watch agent actions live on your screen):
```bash
npm run mcp:playwright:headed
```

### Agent Configuration

The MCP server is pre-configured in `.agents/mcp_config.json` and `.mcp.json`:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp", "--headless"]
    }
  }
}
```

---

## The QA Agent Squad (`.agents/`)

Located in `.agents/`, the QA Agent Squad equips AI assistants with specialized roles and runbooks:

| Agent / Skill | Expertise & Focus |
| :--- | :--- |
| **Playwright Pro** (`playwright-pro`) | Test authoring (`generate`), test quality review (`pw-review`), flakiness repair (`fix`), and coverage analysis. |
| **UX & Feasibility** (`ux-researcher-designer`) | Evaluates user flows, usability heuristics, cognitive load, and feasibility of UI workflows. |
| **Accessibility Auditor** (`a11y-audit`) | Automated and exploratory accessibility testing adhering to WCAG 2.2 Level AA guidelines. |
| **Form CRO Auditor** (`form-cro`) | Deep testing of forms, field validation, edge-case input handling, and conversion rate optimization. |
| **Performance Profiler** (`performance-profiler`) | Core Web Vitals (LCP, CLS, INP) performance analysis and resource bottleneck detection. |
| **Code Reviewer** (`code-reviewer`) | Enforces Playwright best practices, eliminating anti-patterns (e.g. hardcoded `waitForTimeout`). |
| **Release Gatekeeper** (`ship-gate`) | Validates definition of done, test coverage, and pre-release readiness checklists. |
| **Ingestion Orchestrator** (`test-ingestion-orchestrator`) | Ingests manual tests from TMS exports, synthesizes POMs and Playwright specs, and updates traceability. |

---

## Manual Test Ingestion and Automation Pipeline

This framework provides an autonomous bridge between manual Test Management Systems (TMS) and Playwright automation.

### Supported TMS Export Formats
- **TestRail**: CSV exports containing `ID`, `Title`, `Preconditions`, `Steps`, `Expected Result`, and `Priority`.
- **Jira / Xray**: Cucumber Gherkin (`.feature`) files and JSON test exports.
- **Zephyr / qTest**: Standard JSON or CSV test case exports.
- **Markdown / Generic**: Structured Markdown documents (`.md`) with test case headings and step lists.

### How to Ingest and Generate Tests

1. **Drop Export Files**: Place your TMS export files into `manual-tests/incoming/`:
   ```bash
   cp ~/Downloads/testrail-export.csv manual-tests/incoming/
   ```

2. **Parse and Normalize**: Convert heterogeneous formats into a unified test manifest:
   ```bash
   npm run parse:manual
   ```

3. **Synthesize Automation**: Run the autonomous generator or instruct an agent:
   ```bash
   npm run generate:tests
   ```
   The engine:
   - Evaluates existing Page Object Models (`pages/`) and extends them if new elements are encountered.
   - Generates production-ready Playwright tests in `tests/regression/ingested-tests.spec.ts`.
   - Injects TMS annotations (`TMS_ID`, `TMS_System`, `Source_File`) for complete auditability.
   - Updates `manual-tests/traceability-matrix.md` with live coverage statistics.

4. **Verify and Run**:
   ```bash
   npx playwright test tests/regression/ingested-tests.spec.ts
   ```

---

## How to Add New Tests

### 1. Create or Extend a Page Object
All pages inherit from `BasePage`:

```typescript
// pages/CheckoutPage.ts
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
  readonly firstNameInput: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.getByRole('textbox', { name: 'First Name' });
    this.continueButton = page.getByRole('button', { name: 'Continue' });
  }

  async fillShippingDetails(firstName: string) {
    await this.firstNameInput.fill(firstName);
    await this.continueButton.click();
  }
}
```

### 2. Write the Test Spec
Choose the appropriate folder (`tests/smoke/` for critical smoke checks or `tests/regression/` for comprehensive flows):

```typescript
// tests/smoke/checkout.smoke.spec.ts
import { test, expect } from '../fixtures/baseTest';

test.describe('Checkout Sanity @smoke', () => {
  test('should navigate to checkout step one', async ({ loginPage, inventoryPage }) => {
    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    await expect(inventoryPage.page).toHaveURL(/cart/);
  });
});
```

---

## Best Practices & Quality Standards

1. **Accessible Locators**: Always prioritize user-facing locators (`getByRole`, `getByLabel`, `getByText`) over fragile CSS or XPath selectors.
2. **Web-First Assertions**: Use `await expect(locator).toBeVisible()` or `await expect(page).toHaveURL()` instead of manual timeouts or boolean evaluations.
3. **No Hardcoded Delays**: Never use `page.waitForTimeout()`. Rely on Playwright's automatic waiting and auto-retrying assertions.
4. **Isolated Test State**: Keep tests independent; each test must manage its own navigation or authenticated state.

---

## License
This project is licensed under the MIT License.