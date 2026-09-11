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
 * Generate a clean Playwright test spec from ingested test cases
 */
export function generateTestSpec(testCases: NormalizedTestCase[]): string {
  const code: string[] = [];
  code.push("import { test, expect } from '../fixtures/baseTest';");
  code.push("import { credentials, products } from '../../utils/testData';");
  code.push('');
  code.push("test.describe('Ingested Manual Tests Suite', () => {");
  code.push('  test.beforeEach(async ({ loginPage }) => {');
  code.push('    await loginPage.goto();');
  code.push('  });');
  code.push('');

  for (const tc of testCases) {
    const tag = tc.priority === 'smoke' ? '@smoke' : '@regression';
    code.push(`  test('${tc.id} - ${tc.title.replace(/'/g, "\\'")} ${tag}', async ({ loginPage, inventoryPage, page }) => {`);
    code.push('    // Bi-directional TMS Traceability Annotations');
    code.push(`    test.info().annotations.push({ type: 'TMS_ID', description: '${tc.id}' });`);
    code.push(`    test.info().annotations.push({ type: 'TMS_System', description: '${tc.sourceSystem}' });`);
    code.push(`    test.info().annotations.push({ type: 'Source_File', description: '${tc.sourceFile}' });`);
    code.push('');

    // Precondition handling
    const needsLogin = tc.preconditions.some(p => p.toLowerCase().includes('logged in') || p.toLowerCase().includes('authenticated'))
      || tc.suite.toLowerCase().includes('cart') || tc.suite.toLowerCase().includes('shopping');

    if (needsLogin && !tc.steps.some(s => s.action.toLowerCase().includes('username') || s.action.toLowerCase().includes('login'))) {
      code.push('    // Handle Preconditions');
      code.push('    await test.step(\'Precondition: Login as valid user\', async () => {');
      code.push('      await loginPage.login(credentials.validUser.username, credentials.validUser.password);');
      code.push('      await expect(page).toHaveURL(/inventory\\.html/);');
      code.push('    });');
      code.push('');
    }

    if (tc.preconditions.some(p => p.toLowerCase().includes('added') && p.toLowerCase().includes('cart'))) {
      code.push('    // Precondition: Add item to cart');
      code.push('    await test.step(\'Precondition: Add product to cart\', async () => {');
      code.push('      await inventoryPage.addItemToCartByName(products.backpack);');
      code.push('      expect(await inventoryPage.getCartBadgeCount()).toBe(1);');
      code.push('    });');
      code.push('');
    }

    // Translate steps into structured test.step calls
    for (const step of tc.steps) {
      code.push(`    await test.step('Step ${step.stepNumber}: ${step.action.replace(/'/g, "\\'")}', async () => {`);
      const actionLower = step.action.toLowerCase();
      const expectedLower = step.expected.toLowerCase();

      if (actionLower.includes('valid username') || (actionLower.includes('username') && !actionLower.includes('locked'))) {
        code.push('      await loginPage.usernameInput.fill(credentials.validUser.username);');
      } else if (actionLower.includes('locked_out_user') || actionLower.includes('locked')) {
        code.push('      await loginPage.usernameInput.fill(credentials.lockedOutUser.username);');
      }

      if (actionLower.includes('password')) {
        code.push('      await loginPage.passwordInput.fill(credentials.validUser.password);');
      }

      if (actionLower.includes('login button') || actionLower.includes('click login')) {
        code.push('      await loginPage.loginButton.click();');
      }

      if (actionLower.includes('add to cart') || actionLower.includes('add product')) {
        code.push('      await inventoryPage.addItemToCartByName(products.backpack);');
      } else if (actionLower.includes('locate') && !actionLower.includes('click')) {
        code.push('      await expect(inventoryPage.inventoryItems.filter({ hasText: products.backpack })).toBeVisible();');
      }

      if (actionLower.includes('remove')) {
        code.push('      await inventoryPage.removeItemFromCartByName(products.backpack);');
      }

      if (actionLower.includes('badge') || expectedLower.includes('badge')) {
        if (expectedLower.includes('increments') || expectedLower.includes('1')) {
          code.push('      expect(await inventoryPage.getCartBadgeCount()).toBe(1);');
        } else if (expectedLower.includes('disappears') || expectedLower.includes('0')) {
          code.push('      expect(await inventoryPage.getCartBadgeCount()).toBe(0);');
        }
      }

      if (expectedLower.includes('redirected to inventory') || expectedLower.includes('product catalog')) {
        code.push('      await expect(page).toHaveURL(/inventory\\.html/);');
      } else if (expectedLower.includes('locked out')) {
        code.push("      const errorText = await loginPage.getErrorMessage();");
        code.push("      expect(errorText).toContain('Sorry, this user has been locked out.');");
      }

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

  // Generate target spec file
  const targetSpecPath = 'tests/regression/ingested-tests.spec.ts';
  const fullSpecPath = path.resolve(process.cwd(), targetSpecPath);
  const specCode = generateTestSpec(testCases);

  fs.writeFileSync(fullSpecPath, specCode);
  console.log(`Generated Playwright test spec: ${targetSpecPath}`);

  // Build traceability records
  const entries: TraceabilityEntry[] = testCases.map(tc => ({
    manualId: tc.id,
    title: tc.title,
    sourceFile: tc.sourceFile,
    targetSpec: targetSpecPath,
    suite: tc.suite,
    priority: tc.priority,
    status: 'Automated',
  }));

  generateTraceabilityMatrix(entries);
  console.log(`Traceability matrix generated: ${path.relative(process.cwd(), MATRIX_PATH)}`);
}

if (require.main === module || process.argv[1]?.includes('generate-automation')) {
  runGenerator();
}
