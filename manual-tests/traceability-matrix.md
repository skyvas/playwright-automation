# Test Traceability Matrix

Bi-directional traceability mapping between exported manual test management cases and automated Playwright test scripts.

---

## Coverage Summary

- Total Manual Tests Ingested: 2
- Automated in Playwright: 0
- Automation Coverage: 0%
- Last Synchronized: 2026-09-19T18:51:31.058Z

---

## Traceability Mapping

| Test ID | Title | Source File | Suite | Priority | Target Playwright Spec | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-SORT-01** | Sort products by price low to high | `manual-cases.md` | Product Sorting | `regression` | [`product-sorting.spec.ts`](tests/regression/product-sorting.spec.ts) | Pending |
| **TC-SORT-02** | Sort products by name Z to A | `manual-cases.md` | Product Sorting | `regression` | [`product-sorting.spec.ts`](tests/regression/product-sorting.spec.ts) | Pending |

---

## Legend
- **Automated**: Fully translated into an executable Playwright spec.
- **Needs Review**: Complex step or missing locator requiring manual QA review.
- **Pending**: Ingested but not yet scheduled for automation synthesis.
