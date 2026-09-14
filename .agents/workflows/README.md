# QA Agentic Workflows Directory

This directory houses executable, iterative agentic workflow runbooks designed for AI pair programming agents and QA engineers. Each workflow defines a closed-loop state machine with pre-flight inputs, diagnostic heuristics, patch cycles, circuit breakers, and deterministic exit criteria.

---

## Top 5 Quality Assurance Workflows

| # | Workflow File | Primary Agent | Key Capabilities / Loop |
| :- | :--- | :--- | :--- |
| 1 | [`tms-ingestion-to-spec.md`](./tms-ingestion-to-spec.md) | **Test Ingestion Orchestrator** | Ingests TMS exports (TestRail, Xray, Markdown), generates POMs & specs, executes verification, and syncs traceability matrix. |
| 2 | [`flaky-test-healing.md`](./flaky-test-healing.md) | **SDET Automation Engineer** | Deep-dive trace diagnosis, eliminating race conditions, and verifying 3 consecutive clean passes. |
| 3 | [`accessibility-audit-and-fix.md`](./accessibility-audit-and-fix.md) | **UX & Feasibility Auditor** | AxeBuilder scans for WCAG 2.2 AA compliance, triages violations by severity, and enforces 0 critical issues. |
| 4 | [`pr-quality-gate-review.md`](./pr-quality-gate-review.md) | **QA Code Reviewer** | Automated 6-point pre-merge audit: checks for anti-patterns (`waitForTimeout`, non-web-first assertions, locator resilience) and runs lint/typecheck. |
| 5 | [`regression-triage-and-quarantine.md`](./regression-triage-and-quarantine.md) | **QA Lead** | Full multi-browser regression triage, product bug classification, and `@quarantine` management to keep CI green. |

---

## How to Trigger a Workflow

You can instruct your AI assistant to execute any workflow directly:

```
"Execute the workflow in .agents/workflows/tms-ingestion-to-spec.md for the new testrail-export.csv file."
```

```
"Follow .agents/workflows/flaky-test-healing.md to repair tests/regression/ingested-tests.spec.ts."
```

```
"Run .agents/workflows/pr-quality-gate-review.md on my branch before I open a PR."
```
