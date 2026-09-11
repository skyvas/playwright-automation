# Orbit Platform Test Traceability Matrix

Bi-directional traceability mapping between incoming TestRail manual test cases and automated Playwright test suites for the Orbit Platform (`https://orbit-platform.wasmer.app/`).

---

## Coverage Summary

- Total Manual Tests Ingested: 48
- Automated in Playwright: 48
- Automation Coverage: 100%
- Target Environment: https://orbit-platform.wasmer.app/
- Zero-Emoji Compliance: 100%
- Last Synchronized: 2026-09-11T22:49:31.748Z

---

## Traceability Mapping

| Test ID | Title | Source File | Suite | Priority | Target Playwright Spec | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-1** | Valid admin login grants workspace access | `orbit_testrail_import.csv` | Authentication | `smoke` | [`auth.smoke.spec.ts`](../tests/smoke/auth.smoke.spec.ts) | Automated |
| **TC-2** | Valid member login grants member-level workspace access | `orbit_testrail_import.csv` | Authentication | `smoke` | [`auth.smoke.spec.ts`](../tests/smoke/auth.smoke.spec.ts) | Automated |
| **TC-3** | Valid viewer login grants viewer-level workspace access | `orbit_testrail_import.csv` | Authentication | `smoke` | [`auth.smoke.spec.ts`](../tests/smoke/auth.smoke.spec.ts) | Automated |
| **TC-4** | Invalid password is rejected | `orbit_testrail_import.csv` | Authentication | `smoke` | [`auth.spec.ts`](../tests/regression/auth.spec.ts) | Automated |
| **TC-5** | Unknown username is rejected | `orbit_testrail_import.csv` | Authentication | `smoke` | [`auth.spec.ts`](../tests/regression/auth.spec.ts) | Automated |
| **TC-6** | Required login fields are validated | `orbit_testrail_import.csv` | Authentication | `smoke` | [`auth.spec.ts`](../tests/regression/auth.spec.ts) | Automated |
| **TC-7** | Logout invalidates the active session | `orbit_testrail_import.csv` | Authentication | `smoke` | [`auth.smoke.spec.ts`](../tests/smoke/auth.smoke.spec.ts) | Automated |
| **TC-8** | Post-logout session data is purged | `orbit_testrail_import.csv` | Authentication | `smoke` | [`auth.smoke.spec.ts`](../tests/smoke/auth.smoke.spec.ts) | Automated |
| **TC-9** | Create project with required fields | `orbit_testrail_import.csv` | Projects | `smoke` | [`projects.spec.ts`](../tests/regression/projects.spec.ts) | Automated |
| **TC-10** | Project creation blocks missing project key | `orbit_testrail_import.csv` | Projects | `smoke` | [`projects.spec.ts`](../tests/regression/projects.spec.ts) | Automated |
| **TC-11** | Project creation blocks missing project name | `orbit_testrail_import.csv` | Projects | `smoke` | [`projects.spec.ts`](../tests/regression/projects.spec.ts) | Automated |
| **TC-12** | Default Kanban workflow is provisioned for a new project | `orbit_testrail_import.csv` | Projects | `smoke` | [`projects.spec.ts`](../tests/regression/projects.spec.ts) | Automated |
| **TC-13** | Add a custom Kanban column | `orbit_testrail_import.csv` | Projects | `smoke` | [`projects.spec.ts`](../tests/regression/projects.spec.ts) | Automated |
| **TC-14** | Configure Kanban column order and titles | `orbit_testrail_import.csv` | Projects | `regression` | [`projects.spec.ts`](../tests/regression/projects.spec.ts) | Automated |
| **TC-15** | Cancel project creation does not create a project | `orbit_testrail_import.csv` | Projects | `regression` | [`projects.spec.ts`](../tests/regression/projects.spec.ts) | Automated |
| **TC-16** | Project selector switches the active project | `orbit_testrail_import.csv` | Projects | `smoke` | [`projects.spec.ts`](../tests/regression/projects.spec.ts) | Automated |
| **TC-17** | Create and schedule sprint with required name | `orbit_testrail_import.csv` | Sprints | `smoke` | [`sprints.spec.ts`](../tests/regression/sprints.spec.ts) | Automated |
| **TC-18** | Sprint creation blocks missing sprint name | `orbit_testrail_import.csv` | Sprints | `smoke` | [`sprints.spec.ts`](../tests/regression/sprints.spec.ts) | Automated |
| **TC-19** | Sprint date range is validated | `orbit_testrail_import.csv` | Sprints | `smoke` | [`sprints.spec.ts`](../tests/regression/sprints.spec.ts) | Automated |
| **TC-20** | Start sprint changes sprint state to active | `orbit_testrail_import.csv` | Sprints | `smoke` | [`sprints.spec.ts`](../tests/regression/sprints.spec.ts) | Automated |
| **TC-21** | Complete sprint summarizes completed and incomplete issues | `orbit_testrail_import.csv` | Sprints | `smoke` | [`sprints.spec.ts`](../tests/regression/sprints.spec.ts) | Automated |
| **TC-22** | Incomplete sprint issues can be carried over | `orbit_testrail_import.csv` | Sprints | `smoke` | [`sprints.spec.ts`](../tests/regression/sprints.spec.ts) | Automated |
| **TC-23** | Create issue with required title | `orbit_testrail_import.csv` | Issues | `smoke` | [`issues.spec.ts`](../tests/regression/issues.spec.ts) | Automated |
| **TC-24** | Issue creation blocks missing title | `orbit_testrail_import.csv` | Issues | `smoke` | [`issues.spec.ts`](../tests/regression/issues.spec.ts) | Automated |
| **TC-25** | Issue accepts Markdown description | `orbit_testrail_import.csv` | Issues | `regression` | [`issues.spec.ts`](../tests/regression/issues.spec.ts) | Automated |
| **TC-26** | Issue supports priority, type, status, points, sprint, assignee, and tags | `orbit_testrail_import.csv` | Issues | `smoke` | [`issues.spec.ts`](../tests/regression/issues.spec.ts) | Automated |
| **TC-27** | Acceptance checklist items can be added and completed | `orbit_testrail_import.csv` | Issues | `smoke` | [`issues.spec.ts`](../tests/regression/issues.spec.ts) | Automated |
| **TC-28** | Issue comments can be posted | `orbit_testrail_import.csv` | Issues | `smoke` | [`issues.spec.ts`](../tests/regression/issues.spec.ts) | Automated |
| **TC-29** | Issue supports image attachment | `orbit_testrail_import.csv` | Issues | `regression` | [`issues.spec.ts`](../tests/regression/issues.spec.ts) | Automated |
| **TC-30** | Issue attachment can be previewed and downloaded | `orbit_testrail_import.csv` | Issues | `regression` | [`issues.spec.ts`](../tests/regression/issues.spec.ts) | Automated |
| **TC-31** | Issue changes persist after Save Changes | `orbit_testrail_import.csv` | Issues | `smoke` | [`issues.spec.ts`](../tests/regression/issues.spec.ts) | Automated |
| **TC-32** | Keyword filter returns matching issues | `orbit_testrail_import.csv` | Search & Filters | `smoke` | [`search-filters.spec.ts`](../tests/regression/search-filters.spec.ts) | Automated |
| **TC-33** | Issue key search returns the exact issue | `orbit_testrail_import.csv` | Search & Filters | `smoke` | [`search-filters.spec.ts`](../tests/regression/search-filters.spec.ts) | Automated |
| **TC-34** | Combined filters narrow results | `orbit_testrail_import.csv` | Search & Filters | `smoke` | [`search-filters.spec.ts`](../tests/regression/search-filters.spec.ts) | Automated |
| **TC-35** | Clear filters restores the full issue set | `orbit_testrail_import.csv` | Search & Filters | `regression` | [`search-filters.spec.ts`](../tests/regression/search-filters.spec.ts) | Automated |
| **TC-36** | Admin can create a team member | `orbit_testrail_import.csv` | User Management | `smoke` | [`user-management.spec.ts`](../tests/regression/user-management.spec.ts) | Automated |
| **TC-37** | User creation validates required fields | `orbit_testrail_import.csv` | User Management | `smoke` | [`user-management.spec.ts`](../tests/regression/user-management.spec.ts) | Automated |
| **TC-38** | User role controls permitted actions | `orbit_testrail_import.csv` | User Management | `smoke` | [`user-management.spec.ts`](../tests/regression/user-management.spec.ts) | Automated |
| **TC-39** | Admin can change another user's name | `orbit_testrail_import.csv` | User Management | `regression` | [`user-management.spec.ts`](../tests/regression/user-management.spec.ts) | Automated |
| **TC-40** | Password change enforces minimum length | `orbit_testrail_import.csv` | User Management | `smoke` | [`user-management.spec.ts`](../tests/regression/user-management.spec.ts) | Automated |
| **TC-41** | User can update own profile name | `orbit_testrail_import.csv` | Profile | `regression` | [`profile-notifications.spec.ts`](../tests/regression/profile-notifications.spec.ts) | Automated |
| **TC-42** | Notification unread count is displayed | `orbit_testrail_import.csv` | Notifications | `regression` | [`profile-notifications.spec.ts`](../tests/regression/profile-notifications.spec.ts) | Automated |
| **TC-43** | Mark all notifications as read clears unread state | `orbit_testrail_import.csv` | Notifications | `smoke` | [`profile-notifications.spec.ts`](../tests/regression/profile-notifications.spec.ts) | Automated |
| **TC-44** | Notification filter switches between all and unread | `orbit_testrail_import.csv` | Notifications | `regression` | [`profile-notifications.spec.ts`](../tests/regression/profile-notifications.spec.ts) | Automated |
| **TC-45** | c shortcut opens Create New Issue | `orbit_testrail_import.csv` | Keyboard & UX | `regression` | [`keyboard-ux.spec.ts`](../tests/regression/keyboard-ux.spec.ts) | Automated |
| **TC-46** | slash shortcut focuses issue filter | `orbit_testrail_import.csv` | Keyboard & UX | `regression` | [`keyboard-ux.spec.ts`](../tests/regression/keyboard-ux.spec.ts) | Automated |
| **TC-47** | Esc closes open modal or preview | `orbit_testrail_import.csv` | Keyboard & UX | `regression` | [`keyboard-ux.spec.ts`](../tests/regression/keyboard-ux.spec.ts) | Automated |
| **TC-48** | Question-mark shortcut opens keyboard guide | `orbit_testrail_import.csv` | Keyboard & UX | `regression` | [`keyboard-ux.spec.ts`](../tests/regression/keyboard-ux.spec.ts) | Automated |

---

## Legend
- **Automated**: Fully implemented in Page Object Model Playwright specs with passing assertions.
- **Needs Review**: Edge case or pending locator update.
- **Pending**: Ingested but not yet scheduled.
