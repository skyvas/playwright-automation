---
workflow: regression-triage-and-quarantine
description: "End-to-end regression execution, failure classification, quarantine management, and executive defect reporting loop."
primary_agent: qa-lead
supporting_agents: [sdet-automation, qa-code-reviewer]
skills: [senior-qa, focused-fix, code-reviewer]
max_iterations: 2
---

# Workflow: Regression Suite Triage & Quarantine Loop

## Objective
Oversee full regression suite runs across multiple browsers, triage all unexpected failures, separate true product defects from automation flakiness, quarantine unstable specs to unblock continuous deployment, and generate an executive test health report.

---

## Workflow Loop

```mermaid
flowchart TD
    A["1. Execute Regression Suite: npm run test:regression"] --> B{"Any Test Failures?"}
    B -->|All Green| C["2. Generate Clean Executive Sign-Off"]
    B -->|Failures Detected| D["3. Triage & Classify Failures"]
    D --> E{"Is Failure a Product Bug?"}
    E -->|Yes (App Defect)| F["4. File Defect Report with Steps & Trace Artifacts"]
    E -->|No (Automation Flake / Env)| G["5. Run Targeted Heuristic Diagnosis"]
    G --> H{"Can Be Fixed Immediately?"}
    H -->|Yes| I["6. Fix Locator/Timing & Re-verify"] --> A
    H -->|No| J["7. Apply @quarantine Tag to Keep CI Green"] --> K["8. File Jira Defect & Notify SDET"]
```

## Agent Squad & Skill Delegation

| Phase | Acting Agent Persona | Activated Skill | Mandatory Skill Reference | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Phase 1: Run & Triage** | [QA Lead](file:///Users/akash-mac/workspace/playwright-automation/.agents/agents/qa-lead.md) | Playwright CLI & CI Reporter | `scripts/generate-ci-summary.ts` | Coordinates multi-browser execution and classifies failure types. |
| **Phase 2: Deep Diagnostics** | [SDET Automation Engineer](file:///Users/akash-mac/workspace/playwright-automation/.agents/agents/sdet-automation.md) | [`focused-fix`](file:///Users/akash-mac/workspace/playwright-automation/.agents/skills/focused-fix/SKILL.md) | [focused-fix/SKILL.md](file:///Users/akash-mac/workspace/playwright-automation/.agents/skills/focused-fix/SKILL.md) | Reproduces flakiness in headed mode and isolates root causes. |
| **Phase 3: Quarantine & DoD** | [QA Code Reviewer](file:///Users/akash-mac/workspace/playwright-automation/.agents/agents/qa-code-reviewer.md) | [`ship-gate`](file:///Users/akash-mac/workspace/playwright-automation/.agents/skills/ship-gate/SKILL.md) | [ship-gate/SKILL.md](file:///Users/akash-mac/workspace/playwright-automation/.agents/skills/ship-gate/SKILL.md) | Enforces `@quarantine` tagging and protects CI deploy gates. |

---

## Execution Runbook

### Phase 1: Execution & Log Aggregation
1. Run the regression suite across all configured browser projects:
   ```bash
   npm run test:regression
   ```
2. If failures occur, inspect the JSON output:
   - View failed tests in `test-results/report.json`.
   - Locate trace zip files in `test-results/`.

### Phase 2: Failure Classification Matrix
The QA Lead classifies each failed spec into one of 3 categories:

| Category | Typical Symptoms | Immediate Action |
| :--- | :--- | :--- |
| **Product Defect (P0-P2)** | Assertion failed on expected business logic (e.g., incorrect price, missing order confirmation, 500 API response) | Do NOT modify test. File defect report with Playwright trace. |
| **Automation Defect** | Locator not found due to intentional UI rename, deprecated selector, or stale page object | Route to `sdet-automation` for surgical POM update. |
| **Environment / Flakiness** | Browser crash, sandbox permission error, network timeout, third-party outage | Re-run isolated test with `--retries=1`. If still intermittent, quarantine. |

### Phase 3: The Quarantine Protocol
To protect the deployment pipeline from false-positive build breaks:
1. When a test cannot be repaired within the current deployment window, add the `@quarantine` tag to its test declaration:
   ```typescript
   // Before
   test('C105 - Complex multi-step checkout @regression', async ({ ... }) => {
   
   // After (Quarantined)
   test('C105 - Complex multi-step checkout @regression @quarantine', async ({ ... }) => {
   ```
2. Configure CI to exclude quarantined tests from blocking builds:
   ```bash
   npx playwright test --grep-invert @quarantine
   ```
3. Update `manual-tests/traceability-matrix.md` with status: `⚠️ Quarantined (Defect Ticket Attached)`.

### Phase 4: Executive Health Report Generation
Generate the summary report:
```bash
npx tsx scripts/generate-ci-summary.ts
```
Include:
- Total Passed, Failed, Quarantined
- Pass Rate percentage
- Open P0/P1 product blockers
- Link to Playwright HTML Report / Trace Viewer
