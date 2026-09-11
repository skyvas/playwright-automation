# Test Traceability Matrix

Bi-directional traceability mapping between exported manual test management cases and automated Playwright test scripts.

---

## Coverage Summary

- Total Manual Tests Ingested: 4
- Automated in Playwright: 4
- Automation Coverage: 100%
- Last Synchronized: 2026-09-11T21:27:22.784Z

---

## Traceability Mapping

| Test ID | Title | Source File | Suite | Priority | Target Playwright Spec | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **C101** | Verify valid user can login successfully | `testrail-export.csv` | Authentication | `smoke` | [`ingested-tests.spec.ts`](tests/regression/ingested-tests.spec.ts) | Automated |
| **C102** | Verify locked out user receives error message | `testrail-export.csv` | Authentication | `regression` | [`ingested-tests.spec.ts`](tests/regression/ingested-tests.spec.ts) | Automated |
| **C103** | Add product to cart and verify cart badge | `testrail-export.csv` | Shopping Cart | `smoke` | [`ingested-tests.spec.ts`](tests/regression/ingested-tests.spec.ts) | Automated |
| **C104** | Remove product from cart from inventory page | `testrail-export.csv` | Shopping Cart | `regression` | [`ingested-tests.spec.ts`](tests/regression/ingested-tests.spec.ts) | Automated |

---

## Legend
- **Automated**: Fully translated into an executable Playwright spec.
- **Needs Review**: Complex step or missing locator requiring manual QA review.
- **Pending**: Ingested but not yet scheduled for automation synthesis.
