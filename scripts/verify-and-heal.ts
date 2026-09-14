import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const REPORT_PATH = path.resolve(process.cwd(), 'test-results/report.json');
const MATRIX_PATH = path.resolve(process.cwd(), 'manual-tests/traceability-matrix.md');

interface TestDiagnostic {
  tmsId: string;
  title: string;
  passed: boolean;
  durationMs: number;
  failureReason?: string;
  healingSuggestion?: string;
}

/**
 * Diagnostic heuristics for failing Playwright steps
 */
function analyzeFailure(errorMessage: string): string {
  if (/waiting for locator\(/i.test(errorMessage) || /locator\..*timed out/i.test(errorMessage)) {
    return 'Locator Timeout: Element was not found or not visible within timeout. Recommended Fix: Use resilient getByRole/data-test locator or verify page state transition.';
  }
  if (/toHaveURL/i.test(errorMessage)) {
    return 'Navigation/URL Mismatch: Expected destination URL did not match. Recommended Fix: Check authentication state or redirect timing.';
  }
  if (/toContainText|toHaveText/i.test(errorMessage)) {
    return 'Assertion Text Mismatch: UI text differs from expected string. Recommended Fix: Verify internationalization/copy changes or use regex matching.';
  }
  return 'Unknown runtime error. Recommended Fix: Review trace viewer in test-results/ for DOM snapshot at failure.';
}

export function runVerificationAndHeal(): void {
  console.log('🔄 [Agent Pipeline] Running Playwright verification on ingested test suite...');

  const projectArg = process.env.PW_PROJECT ? `--project=${process.env.PW_PROJECT}` : '';
  const testCmd = `npx playwright test tests/regression/ingested-tests.spec.ts ${projectArg}`.trim();

  try {
    execSync(testCmd, {
      stdio: 'inherit',
    });
    console.log('✅ [Agent Pipeline] All ingested tests executed successfully!');
  } catch {
    console.warn('⚠️ [Agent Pipeline] Some tests failed during verification. Initiating diagnostic analysis...');
  }

  if (!fs.existsSync(REPORT_PATH)) {
    console.error(`❌ Report not found at ${REPORT_PATH}`);
    return;
  }

  const rawReport = JSON.parse(fs.readFileSync(REPORT_PATH, 'utf-8'));
  const diagnostics: TestDiagnostic[] = [];

  function traverseSuites(suite: any) {
    if (suite.specs) {
      for (const spec of suite.specs) {
        // Extract TMS ID from title (e.g., "C101 - Verify valid user...")
        const match = spec.title.match(/^(C\d+|[A-Z]+-\d+)/);
        const tmsId = match ? match[1] : 'N/A';

        for (const test of spec.tests) {
          const lastResult = test.results[test.results.length - 1];
          const passed = lastResult && (lastResult.status === 'passed' || lastResult.status === 'expected');
          const duration = lastResult ? lastResult.duration : 0;
          const errorMsg = lastResult?.error?.message;

          diagnostics.push({
            tmsId,
            title: spec.title,
            passed,
            durationMs: duration,
            failureReason: errorMsg,
            healingSuggestion: errorMsg ? analyzeFailure(errorMsg) : undefined,
          });
        }
      }
    }
    if (suite.suites) {
      for (const child of suite.suites) {
        traverseSuites(child);
      }
    }
  }

  traverseSuites(rawReport);

  // Group by TMS ID
  const tmsMap = new Map<string, TestDiagnostic>();
  for (const d of diagnostics) {
    if (d.tmsId !== 'N/A') {
      tmsMap.set(d.tmsId, d);
    }
  }

  console.log(`📊 [Agent Pipeline] Processed ${tmsMap.size} TMS test cases.`);

  // Update Traceability Matrix
  if (fs.existsSync(MATRIX_PATH)) {
    let content = fs.readFileSync(MATRIX_PATH, 'utf-8');
    const now = new Date().toISOString();

    // Update synchronization date
    content = content.replace(/- Last Synchronized: .*/, `- Last Synchronized: ${now} (Verified by QA Agent Pipeline)`);

    // Update row status
    for (const [id, diag] of tmsMap.entries()) {
      const statusText = diag.passed ? '✅ Automated & Passing' : '❌ Needs Review / Failing';
      const rowRegex = new RegExp(`(\\|\\s*\\*\\*${id}\\*\\*\\s*\\|.*?\\|)\\s*(Automated|Needs Review|Pending|✅ Automated & Passing|❌ Needs Review / Failing)\\s*\\|`, 'g');
      content = content.replace(rowRegex, `$1 ${statusText} |`);
    }

    fs.writeFileSync(MATRIX_PATH, content, 'utf-8');
    console.log(`📝 [Agent Pipeline] Updated ${MATRIX_PATH} with live verification results.`);
  }

  // Print summary report
  console.log('\n--- 🤖 Agent Diagnostic & Health Report ---');
  for (const [id, diag] of tmsMap.entries()) {
    if (diag.passed) {
      console.log(`  ✓ ${id}: ${diag.title} (${diag.durationMs}ms) - HEALTHY`);
    } else {
      console.log(`  ✗ ${id}: ${diag.title} - FAILED`);
      console.log(`     Reason: ${diag.failureReason}`);
      console.log(`     Suggestion: ${diag.healingSuggestion}`);
    }
  }
}

if (require.main === module) {
  runVerificationAndHeal();
}
