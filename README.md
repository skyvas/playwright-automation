## 📦 Setup
```bash
npm install
```

## 🧪 Run Tests
```bash
npm test
```

## 🧪 Run in Headed Mode
```bash
npm run test:headed
```

## 📊 View Reports
```bash
npm run test:report
```

## 🚀 GitHub Actions
All tests run on PRs and pushes to `dev`. Reports are uploaded as artifacts.


📁 Folder Structure
│
├── .github/workflows/             # CI setup for GitHub Actions
│   └── playwright.yml
│
├── tests/                         # All test specs
│   └── auth/
│       └── login.spec.ts
│
├── pages/                         # Page Object Models
│   └── LoginPage.ts
│
├── utils/                         # Helper functions (e.g., test data, config readers)
│   └── testData.ts
│
├── playwright.config.ts          # Core Playwright configuration
├── package.json                  # NPM scripts & dependencies
├── tsconfig.json                 # TypeScript configuration
├── README.md                     # Setup & usage docs
└── .env                          # Environment variables (login creds, URLs)

⚙️ Core Features of the Framework
Feature
Description
Page Object Model
Encapsulates selectors and actions per page, making tests maintainable.
Cross-browser testing
Runs on Chromium, Firefox, and WebKit.
Retries & Reporting
Retry failed tests, HTML & GitHub summary reports, video/screenshot capture.
Parallel Test Execution
Boosts speed, especially with larger suites.
Environment Support
Easily switch between staging, QA, and prod via .env.
GitHub CI/CD
Runs tests on every push/PR with artifacts & logs.
