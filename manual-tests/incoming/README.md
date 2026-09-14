# Manual Tests Incoming Dropzone

Drop your exported manual test suites into this directory to ingest them into the automated Playwright framework.

---

## Supported TMS Formats

| Format | Extensions | Source Systems | Example |
| :--- | :--- | :--- | :--- |
| **CSV** | `.csv` | TestRail, qTest, Zephyr, Excel | `manual-tests/examples/testrail-export.csv` |
| **Gherkin Feature** | `.feature` | Jira Xray, Cucumber, Behave | `manual-tests/examples/xray-gherkin.feature` |
| **JSON** | `.json` | Zephyr Squad, Zephyr Scale, Custom APIs | `manual-tests/examples/zephyr-cases.json` |
| **Markdown** | `.md` | Manual test runbooks, Notion, GitHub Docs | `manual-tests/examples/manual-cases.md` |

---

## How to Trigger Ingestion

Once you drop one or more test files into this directory:

### Option 1: Using Agent Workflows
In your AI assistant prompt or slash commands, run:
```bash
/tms-ingestion-to-spec
```

### Option 2: Using CLI Scripts
```bash
# 1. Parse manual tests into normalized JSON manifest
npm run parse:manual

# 2. Synthesize Playwright spec and traceability matrix
npm run generate:tests

# 3. Verify via parallel multi-agent swarm
npm run agent:swarm
```
