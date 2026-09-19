# Playwright Automation Framework & QA Agent Scaffold

A modern test automation framework built with **Playwright**, TypeScript, and integrated **Model Context Protocol (MCP)** support for autonomous QA agents.

---

## Key Highlights

- **Universal Agent Standard**: Native cross-IDE support (`AGENTS.md`, `CLAUDE.md`, `.mcp.json`) for Antigravity, Claude Code, Cursor, and VS Code.
- **Tiered Test Architecture**: Dedicated suites for `@smoke` sanity checks and `@regression` end-to-end user journeys.
- **Autonomous QA Agent Squad**: Embedded AI personas and declarative DAG skills (`.agents/`) for test ingestion, self-healing, network mocking, a11y auditing, and release gates.
- **Dynamic Verification & Zero Flakiness**: Automated trial execution (`npm run verify:spec`) and stress testing (`npm run test:stress`) before merging tests into production.
- **TMS Ingestion & Traceability**: End-to-end orchestration converting manual tests (TestRail, Jira Xray, Zephyr, Markdown) into executable Playwright specs.
- **Playwright MCP Server**: Live browser inspection, accessible locator discovery, and execution via MCP (`@playwright/mcp`).
- **Production CI/CD**: Automated GitHub Actions workflow with executive test summaries, failure annotations, and HTML/trace artifacts.

---

## Core Project Structure

| Directory / File | Purpose |
| :--- | :--- |
| `tests/` | Playwright test suites (`smoke/`, `regression/`), master orchestration test (`workflow/`), and fixtures (`fixtures/baseTest.ts`) |
| `pages/` | Page Object Models extending `BasePage` |
| `manual-tests/` | Ingestion dropzone (`incoming/`), parsed manifests, and traceability matrix |
| `.agents/` | Autonomous squad personas (`agents/`), declarative DAG skills (`skills/`), and MCP config |
| `scripts/` | TMS parsing, automated spec generation, and dynamic verification scripts |
| `AGENTS.md` / `CLAUDE.md` | Universal cross-IDE agent contract and engineering standards |

---

## Getting Started

### 1. Installation
```bash
git clone https://github.com/skyvas/playwright-automation.git
cd playwright-automation
npm install
npx playwright install --with-deps
cp .env.example .env
```

### 2. Running Tests
```bash
# Run all tests
npm test

# Run critical smoke tests
npm run test:smoke

# Run full regression suite
npm run test:regression

# Run flakiness stress test (consecutive repeat loop)
npm run test:stress

# Dynamically verify a specific spec
npm run verify:spec -- --spec <path> --stress 3

# Interactive UI mode
npm run test:ui

# View HTML report
npm run test:report
```

---

## Agent-Driven Ingestion Pipeline & Orchestration

This framework features an autonomous orchestration pipeline where specialized AI agents under `.agents/` collaborate to convert manual test exports into verified, industry-standard Playwright automation:

```mermaid
flowchart TD
    A["TMS Export Files<br/>(TestRail, Xray, Zephyr, Markdown)"] --> B["Test Ingestion Orchestrator<br/>(.agents/agents/test-ingestion-orchestrator.md)"]
    B -->|Normalized Manifest| C["QA Lead Agent<br/>(.agents/agents/qa-lead.md)"]
    C -->|Scope & Risk Prioritization| D["SDET Automation Engineer<br/>(.agents/agents/sdet-automation.md)"]
    D -->|Draft POMs & Specs| E["UX & Feasibility Auditor<br/>(.agents/agents/ux-feasibility-auditor.md)"]
    E -->|A11y & Usability Review| F["QA Code Reviewer<br/>(.agents/agents/qa-code-reviewer.md)"]
    F -->|Pass Quality Gate| G["Production Spec & Traceability Matrix<br/>(tests/regression/ & traceability-matrix.md)"]
    F -->|Flagged Anti-Patterns| D
```

### Step-by-Step Agent Pipeline:

1. **Ingestion & Normalization (`test-ingestion-orchestrator`)**
   - Ingests manual test cases dropped in `manual-tests/incoming/` across supported formats (TestRail CSV, Jira Xray `.feature`, Zephyr JSON, Markdown).
   - Normalizes heterogeneous test data into a unified schema: `manual-tests/parsed/test-manifest.json` (`npm run parse:manual`).

2. **Test Strategy & Risk Prioritization (`qa-lead`)**
   - Evaluates test intent and tags suites appropriately (`@smoke` for critical path sanity checks, `@regression` for full flows).
   - Audits coverage gaps across critical user journeys and assigns execution priorities.

3. **Page Object & Spec Synthesis (`sdet-automation`)**
   - Leverages the `playwright-pro` skill to synthesize clean Page Object Models (`pages/`) extending `BasePage`.
   - Generates executable Playwright test specs (`npm run generate:tests`) using custom fixtures (`tests/fixtures/baseTest.ts`), accessible locators (`getByRole`, `getByLabel`), and web-first async assertions (`expect(locator).toBeVisible()`).

4. **UX & Accessibility Verification (`ux-feasibility-auditor`)**
   - Validates user journey feasibility, form input edge cases, error messaging, and WCAG 2.2 Level AA accessibility standards.

5. **Rigorous Review & Quality Gatekeeping (`qa-code-reviewer`)**
   - Performs automated static and behavioral code review: strictly rejects anti-patterns (no hardcoded `page.waitForTimeout()`, no brittle XPath/CSS).
   - Enforces test state independence and auto-retrying assertions.
   - Enforces the Definition of Done (`ship-gate`), logs verification, and updates `manual-tests/traceability-matrix.md`.

---

## Working with Agents (Example Prompts)

Trigger the embedded QA Agent Squad using natural language queries in your AI assistant (e.g. Antigravity, Claude Code, Cursor):

### 1. Ingest Manual Tests & Generate Automation
> *"Ingest the manual test export files from `manual-tests/incoming/`. Parse the test manifest, map steps to existing Page Object Models, generate Playwright specs adhering to industry standards, and update the traceability matrix."*

### 2. Generate a New Feature Test Spec
> *"Write an automated Playwright smoke test for the user checkout flow using our Page Object Model in `pages/` and custom test fixture. Ensure all locators use `getByRole` and assertions are web-first."*

### 3. QA Code Review & Flakiness Remediation
> *"Review tests in `tests/regression/` against our Playwright standards. Check for hardcoded timeouts, fragile CSS/XPath selectors, or missing assertions, and fix any violations."*

### 4. Accessibility & Quality Audits
> *"Run an accessibility audit on target application views using the `a11y-audit` skill. Verify WCAG 2.2 Level AA compliance and report any contrast or label violations."*

---

## Playwright MCP Server Integration

Enable live browser control and DOM inspection for AI agents via Model Context Protocol:

```bash
# Headless mode
npm run mcp:playwright

# Headed mode (watch agent interactions live)
npm run mcp:playwright:headed
```

Configuration is maintained in `.agents/mcp_config.json` and `.mcp.json`.

---

## License

This project is licensed under the MIT License.