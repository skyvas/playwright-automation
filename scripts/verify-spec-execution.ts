import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

export interface VerificationResult {
  specPath: string;
  passed: boolean;
  repeatCount: number;
  durationMs: number;
  output: string;
  error?: string;
}

/**
 * Dynamically execute a Playwright test spec to verify runtime behavior and flakiness resistance.
 */
export function verifySpecExecution(specPath: string, repeatCount: number = 1): VerificationResult {
  const fullPath = path.isAbsolute(specPath) ? specPath : path.resolve(process.cwd(), specPath);
  if (!fs.existsSync(fullPath)) {
    return {
      specPath,
      passed: false,
      repeatCount,
      durationMs: 0,
      output: '',
      error: `Spec file not found at: ${fullPath}`,
    };
  }

  const repeatFlag = repeatCount > 1 ? ` --repeat-each=${repeatCount}` : '';
  const cmd = `npx playwright test "${specPath}"${repeatFlag}`;
  const start = Date.now();

  try {
    const output = execSync(cmd, {
      cwd: process.cwd(),
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    return {
      specPath,
      passed: true,
      repeatCount,
      durationMs: Date.now() - start,
      output,
    };
  } catch (err: unknown) {
    const errorObj = err as { stdout?: string; stderr?: string; message: string };
    return {
      specPath,
      passed: false,
      repeatCount,
      durationMs: Date.now() - start,
      output: errorObj.stdout || '',
      error: errorObj.stderr || errorObj.message,
    };
  }
}

export function runCLI(): void {
  const args = process.argv.slice(2);
  let specPath = '';
  let repeatCount = 1;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--spec' && args[i + 1]) {
      specPath = args[i + 1];
      i++;
    } else if (args[i] === '--stress' && args[i + 1]) {
      repeatCount = parseInt(args[i + 1], 10) || 3;
      i++;
    } else if (!specPath && !args[i].startsWith('--')) {
      specPath = args[i];
    }
  }

  if (!specPath) {
    console.error('Usage: tsx scripts/verify-spec-execution.ts [--spec <path>] [--stress <repeatCount>]');
    process.exit(1);
  }

  console.log(`[Verification] Running dynamic execution on: ${specPath} (repeat: ${repeatCount}x)...`);
  const result = verifySpecExecution(specPath, repeatCount);

  if (result.passed) {
    console.log(`[Verification Passed] Spec verified successfully in ${result.durationMs}ms (${result.repeatCount} iterations).`);
    process.exit(0);
  } else {
    console.error(`[Verification Failed] Spec failed execution verification.`);
    if (result.error) console.error(result.error);
    if (result.output) console.log(result.output);
    process.exit(1);
  }
}

if (require.main === module || process.argv[1]?.includes('verify-spec-execution')) {
  runCLI();
}
