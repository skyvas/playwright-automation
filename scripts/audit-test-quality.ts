import fs from 'fs';
import path from 'path';

export interface AuditFinding {
  file: string;
  line: number;
  rule: string;
  severity: 'CRITICAL' | 'WARNING' | 'SUGGESTION';
  message: string;
  snippet: string;
}

export interface FileAuditReport {
  file: string;
  score: number;
  findings: AuditFinding[];
}

const CRITICAL_DEDUCTION = 2.5;
const WARNING_DEDUCTION = 1.0;

export function auditFile(filePath: string): FileAuditReport {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const findings: AuditFinding[] = [];
  const relPath = path.relative(process.cwd(), filePath);

  lines.forEach((lineText, index) => {
    const lineNum = index + 1;
    const trimmed = lineText.trim();

    // Skip comments
    if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
      return;
    }

    // 1. waitForTimeout (Critical)
    if (/waitForTimeout\s*\(/i.test(lineText)) {
      findings.push({
        file: relPath,
        line: lineNum,
        rule: 'no-wait-for-timeout',
        severity: 'CRITICAL',
        message: 'Avoid page.waitForTimeout(). Use auto-retrying web-first assertions or locator.waitFor({ state }).',
        snippet: trimmed,
      });
    }

    // 2. Non-web-first assertions: expect(await ...)
    if (/expect\s*\(\s*await\s+.*?\.(isVisible|innerText|textContent|getAttribute)\s*\(/i.test(lineText) ||
        /expect\s*\(\s*await\s+page\./i.test(lineText)) {
      findings.push({
        file: relPath,
        line: lineNum,
        rule: 'web-first-assertions',
        severity: 'CRITICAL',
        message: 'Non-web-first assertion. Use `await expect(locator).toBeVisible()` or `await expect(page)...` to benefit from Playwright auto-retrying.',
        snippet: trimmed,
      });
    }

    // 3. Deprecated page.$ or page.$$
    if (/page\.\${1,2}\s*\(/i.test(lineText)) {
      findings.push({
        file: relPath,
        line: lineNum,
        rule: 'no-deprecated-element-handles',
        severity: 'CRITICAL',
        message: 'page.$() and page.$$() are deprecated. Use page.locator() or semantic getByRole().',
        snippet: trimmed,
      });
    }

    // 4. Hardcoded localhost URLs
    if (/https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i.test(lineText)) {
      findings.push({
        file: relPath,
        line: lineNum,
        rule: 'no-hardcoded-urls',
        severity: 'CRITICAL',
        message: 'Hardcoded URL detected. Use relative paths with baseURL from playwright.config.ts.',
        snippet: trimmed,
      });
    }

    // 5. Brittle XPath selectors
    if (/xpath\s*=|locator\s*\(\s*['"]\/\//i.test(lineText)) {
      findings.push({
        file: relPath,
        line: lineNum,
        rule: 'no-xpath-locators',
        severity: 'WARNING',
        message: 'XPath locator detected. Prefer semantic locators: getByRole(), getByLabel(), getByText().',
        snippet: trimmed,
      });
    }

    // 6. Generic test names
    if (/test\s*\(\s*['"](test\s*\d+|should\s*work|test)['"]/i.test(lineText)) {
      findings.push({
        file: relPath,
        line: lineNum,
        rule: 'descriptive-test-names',
        severity: 'WARNING',
        message: 'Generic test name. Use descriptive scenario names stating expected behavior.',
        snippet: trimmed,
      });
    }
  });

  // Calculate score from 10
  let score = 10;
  for (const f of findings) {
    if (f.severity === 'CRITICAL') score -= CRITICAL_DEDUCTION;
    else if (f.severity === 'WARNING') score -= WARNING_DEDUCTION;
  }
  score = Math.max(1, Math.min(10, Math.round(score * 10) / 10));

  return {
    file: relPath,
    score,
    findings,
  };
}

export function findFiles(dir: string, filter: (file: string) => boolean): string[] {
  let results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(findFiles(fullPath, filter));
    } else if (filter(fullPath)) {
      results.push(fullPath);
    }
  }
  return results;
}

export function runQualityAudit(): { passed: boolean; reports: FileAuditReport[] } {
  console.log('🔍 [QA Code Reviewer] Auditing Playwright test files and Page Objects for anti-patterns...\n');

  const testFiles = findFiles(path.resolve(process.cwd(), 'tests'), (f) => /\.(spec|test)\.ts$/.test(f));
  const pageFiles = findFiles(path.resolve(process.cwd(), 'pages'), (f) => /\.ts$/.test(f));
  const allFiles = [...testFiles, ...pageFiles];

  const reports = allFiles.map(auditFile);
  let totalCritical = 0;
  let totalWarning = 0;

  for (const r of reports) {
    console.log(`📄 ${r.file} — Score: ${r.score}/10`);
    for (const f of r.findings) {
      const badge = f.severity === 'CRITICAL' ? '❌ CRITICAL' : '⚠️ WARNING';
      console.log(`   Line ${f.line} [${badge}]: ${f.message}`);
      console.log(`   > ${f.snippet}`);
      if (f.severity === 'CRITICAL') totalCritical++;
      if (f.severity === 'WARNING') totalWarning++;
    }
    if (r.findings.length === 0) {
      console.log('   ✅ Clean! No anti-patterns detected.');
    }
    console.log('');
  }

  const avgScore = (reports.reduce((acc, r) => acc + r.score, 0) / (reports.length || 1)).toFixed(1);
  console.log('====================================================');
  console.log(`📊 Audit Summary: Audited ${reports.length} files | Average Score: ${avgScore}/10`);
  console.log(`   Critical Issues: ${totalCritical} | Warnings: ${totalWarning}`);
  console.log('====================================================\n');

  const passed = totalCritical === 0;
  return { passed, reports };
}

if (require.main === module) {
  const result = runQualityAudit();
  if (!result.passed) {
    console.error('❌ [QA Code Reviewer] Quality gate failed due to critical anti-patterns.');
    process.exit(1);
  } else {
    console.log('✅ [QA Code Reviewer] Quality gate passed! All files adhere to golden standards.');
  }
}
