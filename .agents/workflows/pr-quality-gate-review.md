---
workflow: pr-quality-gate-review
description: "Pre-merge code review and Definition of Done verification loop enforcing Playwright best practices, zero anti-patterns, and green CI gates."
primary_agent: qa-code-reviewer
supporting_agents: [qa-lead, sdet-automation]
skills: [code-reviewer, ship-gate]
max_iterations: 3
---

# Workflow: Pull Request Quality Gate & Review Loop

## Objective
Evaluate newly contributed test automation code or modifications against the engineering Definition of Done (DoD) before merging into `main`. Ensure zero flaky anti-patterns, resilient locators, and pristine static analysis.

---

## Workflow Loop

```mermaid
flowchart TD
    A["1. Inspect Git Diff: git diff origin/main...HEAD"] --> B["2. Run Static Analysis: npm run lint && npm run typecheck"]
    B --> C{"Lint / Type Errors?"}
    C -->|Yes| D["Auto-fix or Flag Anti-Patterns"] --> B
    C -->|No| E["3. Audit Against Playwright Standards"]
    E --> F{"Standards Violations Found?"}
    F -->|Yes (e.g. waitForTimeout, non-web-first)| G["4. Generate Code Fix Suggestions"] --> B
    F -->|No| H["5. Run Full Test Suite: npm test"]
    H --> I{"Tests Pass 100%?"}
    I -->|Yes| J["6. PASS QUALITY GATE (Approve PR)"]
    I -->|No| K["7. Reject Gate & Hand Off to Focused-Fix"]
```

## Agent Squad & Skill Delegation

| Phase | Acting Agent Persona | Activated Skill | Mandatory Skill Reference | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Phase 1: Diff & Standards** | [QA Code Reviewer](file:///Users/akash-mac/workspace/playwright-automation/.agents/agents/qa-code-reviewer.md) | [`code-reviewer`](file:///Users/akash-mac/workspace/playwright-automation/.agents/skills/code-reviewer/SKILL.md) | [code-reviewer/SKILL.md](file:///Users/akash-mac/workspace/playwright-automation/.agents/skills/code-reviewer/SKILL.md) | Audits PR diff against anti-patterns and rules in [playwright-standards.md](file:///Users/akash-mac/workspace/playwright-automation/.agents/rules/playwright-standards.md). |
| **Phase 2: Static Verification** | [SDET Automation Engineer](file:///Users/akash-mac/workspace/playwright-automation/.agents/agents/sdet-automation.md) | ESLint & TypeScript | `eslint.config.mjs` | Executes `npm run lint` and `npm run typecheck`. |
| **Phase 3: Release Gatekeeping** | [QA Lead](file:///Users/akash-mac/workspace/playwright-automation/.agents/agents/qa-lead.md) | [`ship-gate`](file:///Users/akash-mac/workspace/playwright-automation/.agents/skills/ship-gate/SKILL.md) | [ship-gate/SKILL.md](file:///Users/akash-mac/workspace/playwright-automation/.agents/skills/ship-gate/SKILL.md) | Evaluates merge readiness and publishes official review verdict. |

---

## Verification Checklist

The Reviewer agent strictly verifies the following 6 gates:

| # | Quality Gate | Enforced Standard | Remediation Rule |
| :- | :--- | :--- | :--- |
| 1 | **No Hardcoded Timeouts** | Zero calls to `page.waitForTimeout()` | Replace with `toBeVisible()` or state waits |
| 2 | **Web-First Assertions** | `await expect(locator)...` used exclusively | Reject non-awaiting checks (`expect(await ...).toBe(...)`) |
| 3 | **Selector Resilience** | Role, label, text, or `data-test` used | Reject brittle XPath (`//div[2]/span`) or generic CSS |
| 4 | **Test Isolation** | No shared mutable state between specs | Each test must be runnable independently with `--repeat-each` |
| 5 | **Step Encapsulation** | High-level user actions in `test.step()` | Wrap multi-action blocks for clear trace reports |
| 6 | **Static Cleanliness** | 0 ESLint errors and 0 TypeScript compilation errors | Enforce via `npm run lint` and `npm run typecheck` |

---

## Execution Runbook

### Step 1: Static Inspection
```bash
npm run lint
npm run typecheck
```
If errors occur, apply fixes immediately before proceeding to functional execution.

### Step 2: Standards Diff Scan
Check modified files for anti-patterns:
```bash
git diff origin/main | grep -E "waitForTimeout|isVisible\(|isEnabled\("
```
If any matches appear, reject the gate and provide replacement code chunks.

### Step 3: Test Verification
Execute the modified suite on Chromium and Firefox:
```bash
npm run test:smoke
npm run test:regression
```

### Step 4: Final Verdict Output
Post the structured summary:
- **Decision**: `APPROVED` or `CHANGES REQUESTED`
- **Gates Checked**: 6/6 Passed
- **Test Results**: Total Executed, Duration, Flakiness Index
