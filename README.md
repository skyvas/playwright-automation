# Playwright Automation Framework & QA Agent Template

A production-grade, domain-agnostic test automation template built with **Playwright**, TypeScript, and integrated **Model Context Protocol (MCP)** support for autonomous QA agents.

Use this repository as a starter scaffold for any web application. Simply configure your target `BASE_URL`, drop exported test cases from your Test Management System (TestRail, Jira Xray, Zephyr, Markdown) into `manual-tests/incoming/`, and activate the autonomous QA agent squad in `.agents/` to synthesize, review, and execute passing automation.

---

## Key Highlights

- **Universal Starter Template**: Zero hardcoded testing sites. Ready to point to any web application via `BASE_URL`.
- **Autonomous QA Agent Squad**: 8 embedded AI personas and 10+ skills (`.agents/`) for test generation, code review, accessibility auditing, and release gates.
- **True Parallel Multi-Agent Swarm**: Concurrent worker threads (`npm run agent:swarm`) executing SDET test runs, UX accessibility scans, and static anti-pattern audits simultaneously.
- **TMS Ingestion & Bi-Directional Traceability**: Built-in parsers for TestRail (.csv), Jira Xray (.feature), Zephyr (.json), and Markdown (.md).
- **Playwright MCP Server**: Live browser inspection and locator discovery via Model Context Protocol (`@playwright/mcp`).
- **Production CI/CD**: Pre-configured GitHub Actions workflow with linting, typechecks, a11y scans, test execution, step summaries, and trace artifacts.

---

## Project Structure

| Directory | Purpose |
| :--- | :--- |
| `tests/` | Playwright test suites (`smoke/`, `regression/`) and extensible fixtures (`fixtures/baseTest.ts`) |
| `pages/` | Page Object Models extending foundational `BasePage.ts` |
| `manual-tests/` | Ingestion dropzone (`incoming/`), example exports (`examples/`), parsed manifests, and traceability matrix |
| `.agents/` | QA Agent Squad personas (`agents/`), workflows (`workflows/`), rules (`rules/`), and skills (`skills/`) |
| `scripts/` | Autonomous ingestion parser, spec generator, multi-agent swarm orchestrator, and test quality auditor |

---

## Getting Started

### 1. Setup & Installation
```bash
# Clone the template
git clone https://github.com/skyvas/playwright-automation.git
cd playwright-automation

# Install dependencies and Playwright browsers
npm install
npx playwright install --with-deps

# Configure your target environment
cp .env.example .env
# Edit .env and set BASE_URL to your target application (e.g., http://localhost:3000)
```

### 2. Running Verification & Swarm Commands
```bash
# Run all Playwright tests
npm test

# Run critical smoke tests (healthcheck & accessibility)
npm run test:smoke

# Run full regression suite
npm run test:regression

# Run static 20 anti-patterns test audit
npm run test:audit

# Run True Parallel Multi-Agent Swarm (SDET + UX Auditor + Code Reviewer)
npm run agent:swarm

# Run agent self-healing verification & sync traceability matrix
npm run agent:verify

# Code quality lint & typecheck
npm run lint
npm run typecheck

# Interactive UI mode & HTML report
npm run test:ui
npm run test:report
```

---

## Ingestion Workflow: From Manual Cases to Passing Specs

1. **Drop Exported Test Cases**:
   Place your exported files into `manual-tests/incoming/`:
   - TestRail: `.csv`
   - Jira Xray: `.feature` (Gherkin)
   - Zephyr Scale / Squad: `.json`
   - Manual Runbooks: `.md`
   *(See `manual-tests/examples/` for sample formats).*

2. **Trigger Ingestion**:
   In your AI assistant prompt or slash commands, invoke:
   ```bash
   /tms-ingestion-to-spec
   ```
   Or run directly via CLI:
   ```bash
   # Parse incoming files into normalized manifest
   npm run parse:manual

   # Synthesize Playwright spec adhering to web-first standards
   npm run generate:tests

   # Run parallel verification swarm
   npm run agent:swarm
   ```

3. **Traceability Matrix**:
   `manual-tests/traceability-matrix.md` is automatically populated and updated with test passing statuses and execution timestamps.

---

## Embedded QA Agent Squad

| Agent Persona | Role | Active Skills |
| :--- | :--- | :--- |
| **QA Lead** ([`qa-lead.md`](.agents/agents/qa-lead.md)) | Test strategist, swarm dispatcher, DoD release gatekeeper | `ship-gate`, `performance-profiler` |
| **SDET Automation** ([`sdet-automation.md`](.agents/agents/sdet-automation.md)) | Spec authoring, POM architecture, fixture design | `playwright-pro`, `pw-generate`, `pw-fix`, `focused-fix` |
| **QA Code Reviewer** ([`qa-code-reviewer.md`](.agents/agents/qa-code-reviewer.md)) | Pre-merge reviews, 20 anti-patterns check, web-first assertions | `pw-review`, `code-reviewer`, `ship-gate` |
| **UX Auditor** ([`ux-feasibility-auditor.md`](.agents/agents/ux-feasibility-auditor.md)) | WCAG 2.2 AA accessibility scans, form UX, responsive layout | `a11y-audit`, `form-cro`, `ux-researcher-designer` |
| **Test Ingestion Orchestrator** ([`test-ingestion-orchestrator.md`](.agents/agents/test-ingestion-orchestrator.md)) | Normalizing heterogeneous TMS exports into Playwright automation | `senior-qa`, `api-test-suite-builder` |

---

## License

This project is licensed under the MIT License.