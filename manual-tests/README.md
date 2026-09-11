# Manual Test Ingestion Directory

This directory powers the ingestion of manual test cases exported from leading Test Management Systems (TMS) into automated Playwright test scripts.

---

## Directory Structure

```
manual-tests/
├── incoming/             # Place your exported test files here (CSV, JSON, .feature, .md)
├── examples/             # Reference export templates for TestRail, Jira Xray, Zephyr, and Markdown
├── parsed/               # Generated intermediate JSON test manifests
├── traceability-matrix.md # Bi-directional mapping of manual Test IDs to automated Playwright specs
└── README.md             # This guide
```

---

## Supported Formats

1. **TestRail**: CSV exports containing `ID`, `Title`, `Section`, `Preconditions`, `Steps`, `Expected Result`, `Priority`.
2. **Jira Xray / Cucumber**: `.feature` files containing `Feature:`, `Scenario:`, `@smoke`, and `Given/When/Then` steps.
3. **Zephyr / qTest**: JSON exports containing test key, name, preconditions, and step arrays.
4. **Markdown**: Standard Markdown documents with `### Test Case: ID - Title` and step lists.

---

## Quick Start: How to Ingest and Automate

1. **Drop your export file** into `manual-tests/incoming/`:
   ```bash
   cp /path/to/my-testrail-export.csv manual-tests/incoming/
   ```

2. **Parse the incoming files**:
   ```bash
   npm run parse:manual
   ```

3. **Generate Playwright automation scripts**:
   ```bash
   npm run generate:tests
   ```

4. **Run the generated tests**:
   ```bash
   npx playwright test tests/regression/ingested-tests.spec.ts
   ```

5. **Review the Traceability Matrix**:
   Open `manual-tests/traceability-matrix.md` to see coverage and status.
