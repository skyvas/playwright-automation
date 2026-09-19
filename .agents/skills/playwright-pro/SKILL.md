---
name: "playwright-pro"
description: "Production-grade Playwright testing toolkit for AI coding agents. Generates tests, plans test architecture, models scenarios from URLs or user stories, audits for anti-patterns, and fixes flaky tests."
---

# Playwright Pro Skill

Playwright Pro is a specialized testing framework toolkit designed for autonomous test architecture, scenario modeling, test authoring, and test review.

## Core Superpowers

1. **Test Architect (`agents/test-architect.md`)**:
   - Analyzes application routes, features, user stories, acceptance criteria, or live URLs.
   - Decomposes user journeys into structured test scenarios (positive paths, negative error states, edge cases, accessibility checks).
   - Maps actions to Page Object Models (POMs) and reusable fixtures.

2. **Test Generation (`skills/generate/SKILL.md`)**:
   - Generates production-ready Playwright tests in TypeScript using `@playwright/test`.
   - Utilizes curated test templates (`templates/`) covering auth, CRUD, checkout, search, forms, dashboards, and settings.
   - Enforces user-facing accessibility locator hierarchy: `getByRole()`, `getByLabel()`, `getByText()`, `getByPlaceholder()`, `getByTestId()`.
   - Enforces web-first auto-retrying assertions (`await expect(locator)...`) and forbids brittle artificial pauses (`page.waitForTimeout()`).

3. **Code Review & Quality Gate (`skills/pw-review/SKILL.md`)**:
   - Audits Playwright test files for brittle CSS/XPath selectors, unawaited locators, non-retrying assertions, shared mutable state, or missing test step annotations.

4. **Test Debugging & Remediation (`skills/fix/SKILL.md`)**:
   - Diagnoses flaky tests and race conditions using Playwright trace logs and DOM inspection.

## Usage in Workflows

- **In `test-case-generation`**: Playwright Pro serves as the Test Architect, parsing dynamic inputs (URLs or copy-pasted test steps) to formulate comprehensive test suites with explicit preconditions, action steps, and expected outcomes.
- **In `test-automation-generation`**: Playwright Pro generates clean, maintainable `@playwright/test` specs with `test.step()` wrapping, fixture injection, and bidirectional TMS metadata annotations.
