# Project Setup and Usage

## 📦 Setup
Run the following command to install dependencies:
```bash
npm install
npx playwright install
```

## 🧪 Run Tests
Execute all tests with:
```bash
npm test
```

## 🧪 Run in Headed Mode
Run tests in headed mode (with browser UI) using:
```bash
npm run test:headed
```

## 📊 View Reports
Generate and view test reports with:
```bash
npm run test:report
```

## 🚀 GitHub Actions
Tests automatically run on pull requests and pushes to the `dev` branch. Reports are uploaded as artifacts in GitHub Actions.

## 📁 Folder Structure
```
├── .github/workflows/             # GitHub Actions CI configuration
│   └── playwright-ci.yml
├── tests/                         # Test specifications
│   └── auth/
│       └── login.spec.ts
├── pages/                         # Page Object Models
│   └── LoginPage.ts
├── utils/                         # Helper functions (test data, config)
│   └── testData.ts
├── playwright.config.ts           # Playwright configuration
├── package.json                   # NPM scripts and dependencies
├── tsconfig.json                  # TypeScript configuration
├── README.md                      # Project setup and usage documentation
└── .env                           # Environment variables (e.g., credentials, URLs)
```

## ⚙️ Core Features of the Framework

| Feature                  | Description                                                                 |
|--------------------------|-----------------------------------------------------------------------------|
| Page Object Model        | Encapsulates page selectors and actions for maintainable tests.              |
| Cross-browser Testing    | Supports Chromium, Firefox, and WebKit.                                      |
| Retries & Reporting      | Automatic retries, HTML reports, GitHub summaries, video/screenshot capture. |
| Parallel Test Execution  | Runs tests in parallel for faster execution, ideal for large suites.         |
| Environment Support      | Switch between staging, QA, and prod environments using `.env` file.         |
| GitHub CI/CD             | Automated test runs on every push/PR with logs and artifacts.                |