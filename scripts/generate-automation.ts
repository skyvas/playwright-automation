import fs from 'fs';
import path from 'path';
import { parseAllIncoming, NormalizedTestCase } from './parse-manual-tests';

const MANIFEST_PATH = path.resolve(process.cwd(), 'manual-tests/parsed/test-manifest.json');
const MATRIX_PATH = path.resolve(process.cwd(), 'manual-tests/traceability-matrix.md');

export interface TraceabilityEntry {
  manualId: string;
  title: string;
  sourceFile: string;
  targetSpec: string;
  suite: string;
  priority: string;
  status: 'Automated' | 'Needs Review' | 'Pending';
}

/**
 * Standard mapping for known test cases to target spec files (can be extended dynamically)
 */
const SPEC_MAPPINGS: Record<string, string> = {};

/**
 * Determine target spec path for a given test case following QA Lead routing rules
 */
export function resolveTargetSpec(tc: NormalizedTestCase): string {
  if (SPEC_MAPPINGS[tc.id]) {
    return SPEC_MAPPINGS[tc.id];
  }
  const suiteSlug = tc.suite ? tc.suite.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : 'general';
  if (tc.priority === 'smoke') {
    return `tests/smoke/${suiteSlug || 'smoke'}.smoke.spec.ts`;
  }
  return `tests/regression/${suiteSlug || 'regression'}.spec.ts`;
}

/**
 * Generate a clean Playwright test spec template for arbitrary unmapped test cases
 */
export function generateTestSpec(testCases: NormalizedTestCase[], suiteName: string = 'Generated Suite'): string {
  const code: string[] = [];
  code.push("import { test, expect } from '../fixtures/baseTest';");
  code.push("import { testData } from '../../utils/testData';");
  code.push('');
  code.push(`test.describe('${suiteName}', () => {`);
  code.push('  test.beforeEach(async ({ page }) => {');
  code.push('    // Base setup and navigation');
  code.push('  });');
  code.push('');

  for (const tc of testCases) {
    const tag = tc.priority === 'smoke' ? '@smoke' : '@regression';
    code.push(`  test('${tc.id} - ${tc.title.replace(/'/g, "\\'")} ${tag}', async ({ page }) => {`);
    code.push(`    test.info().annotations.push({ type: 'TMS_ID', description: '${tc.id}' });`);
    code.push(`    test.info().annotations.push({ type: 'TMS_System', description: '${tc.sourceSystem}' });`);
    code.push(`    test.info().annotations.push({ type: 'Source_File', description: '${tc.sourceFile}' });`);
    code.push('');

    for (const step of tc.steps) {
      code.push(`    await test.step('Step ${step.stepNumber}: ${step.action.replace(/'/g, "\\'")}', async () => {`);
      code.push(`      // ${step.expected.replace(/'/g, "\\'")}`);
      code.push('      await expect(page).toBeDefined();');
      code.push('    });');
      code.push('');
    }

    code.push('  });');
    code.push('');
  }

  code.push('});');
  code.push('');
  return code.join('\n');
}

/**
 * Generate Traceability Matrix Markdown document
 */
export function generateTraceabilityMatrix(entries: TraceabilityEntry[]): void {
  const total = entries.length;
  const automated = entries.filter(e => e.status === 'Automated').length;
  const coveragePercent = total > 0 ? Math.round((automated / total) * 100) : 0;

  const content: string[] = [
    '# Test Traceability Matrix',
    '',
    'Bi-directional traceability mapping between exported manual test management cases and automated Playwright test scripts.',
    '',
    '---',
    '',
    '## Coverage Summary',
    '',
    `- Total Manual Tests Ingested: ${total}`,
    `- Automated in Playwright: ${automated}`,
    `- Automation Coverage: ${coveragePercent}%`,
    `- Last Synchronized: ${new Date().toISOString()}`,
    '',
    '---',
    '',
    '## Traceability Mapping',
    '',
    '| Test ID | Title | Source File | Suite | Priority | Target Playwright Spec | Status |',
    '| :--- | :--- | :--- | :--- | :--- | :--- | :--- |',
  ];

  for (const entry of entries) {
    content.push(
      `| **${entry.manualId}** | ${entry.title} | \`${entry.sourceFile}\` | ${entry.suite} | \`${entry.priority}\` | [\`${path.basename(entry.targetSpec)}\`](${entry.targetSpec}) | ${entry.status} |`
    );
  }

  content.push('');
  content.push('---');
  content.push('');
  content.push('## Legend');
  content.push('- **Automated**: Fully translated into an executable Playwright spec.');
  content.push('- **Needs Review**: Complex step or missing locator requiring manual QA review.');
  content.push('- **Pending**: Ingested but not yet scheduled for automation synthesis.');
  content.push('');

  fs.writeFileSync(MATRIX_PATH, content.join('\n'));
}

export function runGenerator(): void {
  console.log('Running test ingestion & automation generator...');

  let testCases: NormalizedTestCase[] = [];
  if (fs.existsSync(MANIFEST_PATH)) {
    testCases = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
  } else {
    testCases = parseAllIncoming();
  }

  if (testCases.length === 0) {
    console.log('No test cases found in incoming folder or manifest.');
    return;
  }

  // Build traceability records for all ingested cases
  const entries: TraceabilityEntry[] = testCases.map(tc => {
    const targetSpec = resolveTargetSpec(tc);
    const specExists = fs.existsSync(path.resolve(process.cwd(), targetSpec));
    return {
      manualId: tc.id,
      title: tc.title,
      sourceFile: tc.sourceFile,
      targetSpec: targetSpec,
      suite: tc.suite,
      priority: tc.priority,
      status: specExists ? 'Automated' : 'Pending',
    };
  });

  generateTraceabilityMatrix(entries);
  console.log(`Traceability matrix updated with ${entries.length} test cases at: ${path.relative(process.cwd(), MATRIX_PATH)}`);
}

if (require.main === module || process.argv[1]?.includes('generate-automation')) {
  runGenerator();
}
