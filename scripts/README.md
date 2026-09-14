# Deterministic Tool Belt (`scripts/`)

This directory contains the **deterministic execution tools** that empower the autonomous QA agent squad (`.agents/`) and human engineers. 

While `.agents/` provides the **intelligence, personas, skills, and decision workflows**, `scripts/` provides the **fast, programmatic, and deterministic engines** that execute file parsing, spec synthesis, concurrency management, and reporting.

---

## Script Index & Agent Mapping

| Script | NPM Command | Acting Agent Persona | Purpose |
| :--- | :--- | :--- | :--- |
| [`parse-manual-tests.ts`](./parse-manual-tests.ts) | `npm run parse:manual` | **Test Ingestion Orchestrator** | Normalizes heterogeneous TMS exports (TestRail CSV, Jira Xray `.feature`, Zephyr JSON, Markdown) into a unified JSON manifest (`manual-tests/parsed/test-manifest.json`). |
| [`generate-automation.ts`](./generate-automation.ts) | `npm run generate:tests` | **SDET Automation Engineer** | Translates ingested test cases into domain-agnostic, web-first Playwright specs with `test.step()` wrapping and synchronizes `manual-tests/traceability-matrix.md`. |
| [`multi-agent-orchestrator.ts`](./multi-agent-orchestrator.ts) | `npm run agent:swarm` / `agent:parallel` | **QA Lead Agent** | Manages true parallel multi-agent threading: dispatches SDET, UX Auditor, and Code Reviewer concurrently with barrier synchronization and consolidated DoD reporting. |
| [`audit-test-quality.ts`](./audit-test-quality.ts) | `npm run test:audit` | **QA Code Reviewer** | Fast programmatic scanner enforcing the 20 anti-patterns check from `pw-review` (no `waitForTimeout`, web-first assertions, no hardcoded URLs, locator resilience). |
| [`verify-and-heal.ts`](./verify-and-heal.ts) | `npm run agent:verify` | **SDET Automation Engineer** | Runs ingested tests, parses `test-results/report.json`, diagnoses failure root-causes, and updates the traceability matrix. |
| [`generate-ci-summary.ts`](./generate-ci-summary.ts) | *(Used in CI)* | **CI/CD Pipeline** | Parses test artifacts and formats rich Markdown Step Summaries (`GITHUB_STEP_SUMMARY`) for GitHub Actions. |

---

## Why Scripts Exist Alongside `.agents/`

In modern AI agent architectures:
1. **Token Efficiency & Speed**: Deterministic tasks (like parsing large CSV files or regex checking 50 test files) take milliseconds in TypeScript, saving thousands of tokens and eliminating LLM parsing hallucinations.
2. **Deterministic Quality Gates**: Pre-merge checks and release gates should have mathematically verifiable pass/fail criteria.
3. **Headless & CI Compatible**: Every workflow action can be executed in headless CI/CD pipelines without requiring an interactive AI session.
