import fs from 'fs';
import path from 'path';

const REPORT_JSON_PATH = path.resolve(process.cwd(), 'test-results/report.json');
const SUMMARY_OUTPUT_PATH = process.env.GITHUB_STEP_SUMMARY || path.resolve(process.cwd(), 'test-results/ci-summary.md');

interface PlaywrightTestResult {
  status: string;
  duration: number;
  error?: {
    message?: string;
    stack?: string;
  };
}

interface PlaywrightSpec {
  title: string;
  ok: boolean;
  tests: {
    projectName: string;
    results: PlaywrightTestResult[];
    status: string;
  }[];
  file: string;
  line: number;
}

interface PlaywrightSuite {
  title: string;
  specs: PlaywrightSpec[];
  suites?: PlaywrightSuite[];
}

interface PlaywrightReport {
  suites: PlaywrightSuite[];
  stats: {
    startTime: string;
    duration: number;
    expected: number;
    unexpected: number;
    flaky: number;
    skipped: number;
  };
}

function collectSpecs(suite: PlaywrightSuite): PlaywrightSpec[] {
  const specs: PlaywrightSpec[] = [...(suite.specs || [])];
  if (suite.suites) {
    for (const sub of suite.suites) {
      specs.push(...collectSpecs(sub));
    }
  }
  return specs;
}

export function generateCISummary(): void {
  if (!fs.existsSync(REPORT_JSON_PATH)) {
    console.warn(`Report JSON not found at: ${REPORT_JSON_PATH}. Skipping summary generation.`);
    return;
  }

  const rawData = fs.readFileSync(REPORT_JSON_PATH, 'utf-8');
  let report: PlaywrightReport;
  try {
    report = JSON.parse(rawData);
  } catch (err) {
    console.error('Failed to parse report.json:', err);
    return;
  }

  const allSpecs: PlaywrightSpec[] = [];
  for (const suite of report.suites || []) {
    allSpecs.push(...collectSpecs(suite));
  }

  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;
  let skippedTests = 0;
  let flakyTests = report.stats?.flaky || 0;

  interface FailureDetail {
    title: string;
    file: string;
    project: string;
    error: string;
  }
  const failures: FailureDetail[] = [];

  for (const spec of allSpecs) {
    for (const t of spec.tests) {
      totalTests++;
      const lastResult = t.results[t.results.length - 1];
      const status = lastResult?.status || t.status;

      if (status === 'passed') {
        passedTests++;
      } else if (status === 'skipped') {
        skippedTests++;
      } else {
        failedTests++;
        const errorMsg = lastResult?.error?.message || 'Unknown error';
        failures.push({
          title: spec.title,
          file: `${spec.file}:${spec.line}`,
          project: t.projectName,
          error: errorMsg.split('\n')[0].replace(/\u001b\[\d+m/g, ''),
        });
      }
    }
  }

  const durationSec = ((report.stats?.duration || 0) / 1000).toFixed(1);
  const passRate = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;

  const lines: string[] = [
    '# Playwright Test Execution Summary',
    '',
    `Test run completed with a **${passRate}% pass rate** across all configured browsers.`,
    '',
    '## Executive Metrics',
    '',
    '| Metric | Result |',
    '| :--- | :--- |',
    `| Total Tests | ${totalTests} |`,
    `| Passed | ${passedTests} |`,
    `| Failed | ${failedTests} |`,
    `| Flaky | ${flakyTests} |`,
    `| Skipped | ${skippedTests} |`,
    `| Total Duration | ${durationSec}s |`,
    '',
    '## Live Interactive Report',
    `The full HTML test report is published to GitHub Pages: [Open Live Report](https://${(process.env.GITHUB_REPOSITORY || 'skyvas/playwright-automation').split('/')[0]}.github.io/${(process.env.GITHUB_REPOSITORY || 'skyvas/playwright-automation').split('/')[1]}/)`,
    '',
  ];

  if (failures.length > 0) {
    lines.push('## Failed Tests');
    lines.push('');
    lines.push('| Test Case | Project | File | Error |');
    lines.push('| :--- | :--- | :--- | :--- |');
    for (const fail of failures) {
      lines.push(`| **${fail.title}** | \`${fail.project}\` | \`${fail.file}\` | \`${fail.error}\` |`);
    }
    lines.push('');
    lines.push('> Diagnostics and full trace files are available under the workflow Artifacts section.');
    lines.push('');
  } else {
    lines.push('## Status');
    lines.push('All automated test suites executed successfully with zero test failures.');
    lines.push('');
  }

  const summaryContent = lines.join('\n');

  const outDir = path.dirname(SUMMARY_OUTPUT_PATH);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  fs.appendFileSync(SUMMARY_OUTPUT_PATH, summaryContent + '\n');
  console.log(`CI Summary written to: ${SUMMARY_OUTPUT_PATH}`);
  console.log(summaryContent);
}

if (require.main === module || process.argv[1]?.includes('generate-ci-summary')) {
  generateCISummary();
}
