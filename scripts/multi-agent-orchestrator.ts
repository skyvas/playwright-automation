import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { runQualityAudit } from './audit-test-quality';

export interface AgentWorkerResult {
  agentName: string;
  role: string;
  threadId: number;
  status: 'PASSED' | 'FAILED';
  durationMs: number;
  summary: string;
  details: any;
  errors?: string[];
}

export interface SwarmExecutionSummary {
  executionId: string;
  startTime: string;
  endTime: string;
  totalDurationMs: number;
  overallGateStatus: 'PASSED' | 'FAILED';
  workerResults: AgentWorkerResult[];
}

const RESULTS_DIR = path.resolve(process.cwd(), 'test-results/agents');
const MATRIX_PATH = path.resolve(process.cwd(), 'manual-tests/traceability-matrix.md');

function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Worker Thread 1: SDET Automation Engineer
 * Runs Playwright test execution and parses test diagnostics
 */
async function runSdetWorker(threadId: number): Promise<AgentWorkerResult> {
  const startTime = Date.now();
  console.log(`🧵 [Thread ${threadId}] 🤖 [SDET Automation Engineer] Spawning test execution worker...`);
  return new Promise((resolve) => {
    const project = process.env.PW_PROJECT || 'Chromium';
    const args = ['playwright', 'test', 'tests/regression/ingested-tests.spec.ts'];
    if (project !== 'all') {
      args.push(`--project=${project}`);
    }

    const child = spawn('npx', args, {
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, CI: 'true' },
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', (code) => {
      const durationMs = Date.now() - startTime;
      const passed = code === 0;

      const reportPath = path.resolve(process.cwd(), 'test-results/report.json');
      let testCount = 0;
      if (fs.existsSync(reportPath)) {
        try {
          const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
          testCount = report.suites?.length || 0;
        } catch {
          // ignore
        }
      }

      const result: AgentWorkerResult = {
        agentName: 'sdet-automation',
        role: 'SDET Automation Engineer',
        threadId,
        status: passed ? 'PASSED' : 'FAILED',
        durationMs,
        summary: passed
          ? `Executed ingested Playwright suite successfully in ${durationMs}ms.`
          : `Test suite execution failed with exit code ${code}.`,
        details: {
          exitCode: code,
          testCount,
          stdoutSnippet: stdout.slice(-400),
        },
        errors: passed ? undefined : [stderr || 'Some tests failed in suite.'],
      };

      console.log(`🏁 [Thread ${threadId}] 🤖 [SDET Automation Engineer] Completed with status: ${result.status} (${durationMs}ms)`);
      resolve(result);
    });
  });
}

/**
 * Worker Thread 2: UX & Feasibility Auditor
 * Runs automated WCAG 2.2 AA accessibility scan
 */
async function runUxAuditorWorker(threadId: number): Promise<AgentWorkerResult> {
  const startTime = Date.now();
  console.log(`🧵 [Thread ${threadId}] 🎨 [UX & Feasibility Auditor] Spawning accessibility audit worker...`);

  return new Promise((resolve) => {
    const child = spawn('npx', ['playwright', 'test', 'tests/smoke/a11y.smoke.spec.ts', '--project=Chromium'], {
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, CI: 'true' },
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', (code) => {
      const durationMs = Date.now() - startTime;
      const passed = code === 0;

      const result: AgentWorkerResult = {
        agentName: 'ux-feasibility-auditor',
        role: 'UX & Feasibility Quality Auditor',
        threadId,
        status: passed ? 'PASSED' : 'FAILED',
        durationMs,
        summary: passed
          ? `WCAG 2.2 Level AA accessibility compliance verified across pages in ${durationMs}ms.`
          : `Accessibility audit detected violations (exit code ${code}).`,
        details: {
          exitCode: code,
          standard: 'WCAG 2.2 Level AA',
          stdoutSnippet: stdout.slice(-300),
        },
        errors: passed ? undefined : [stderr || 'Accessibility scan failed.'],
      };

      console.log(`🏁 [Thread ${threadId}] 🎨 [UX & Feasibility Auditor] Completed with status: ${result.status} (${durationMs}ms)`);
      resolve(result);
    });
  });
}

/**
 * Worker Thread 3: QA Code Reviewer
 * Concurrently audits test specs and Page Objects against 20 anti-patterns
 */
async function runCodeReviewerWorker(threadId: number): Promise<AgentWorkerResult> {
  const startTime = Date.now();
  console.log(`🧵 [Thread ${threadId}] 🛡️ [QA Code Reviewer] Spawning static anti-pattern audit worker...`);

  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        const auditResult = runQualityAudit();
        const durationMs = Date.now() - startTime;

        const totalCritical = auditResult.reports.reduce(
          (acc, r) => acc + r.findings.filter((f) => f.severity === 'CRITICAL').length,
          0
        );
        const totalWarning = auditResult.reports.reduce(
          (acc, r) => acc + r.findings.filter((f) => f.severity === 'WARNING').length,
          0
        );

        const result: AgentWorkerResult = {
          agentName: 'qa-code-reviewer',
          role: 'QA Code Reviewer & Gatekeeper',
          threadId,
          status: auditResult.passed ? 'PASSED' : 'FAILED',
          durationMs,
          summary: auditResult.passed
            ? `Zero critical anti-patterns found across ${auditResult.reports.length} files in ${durationMs}ms.`
            : `Detected ${totalCritical} critical anti-patterns. Review failed.`,
          details: {
            filesAudited: auditResult.reports.length,
            criticalCount: totalCritical,
            warningCount: totalWarning,
            reports: auditResult.reports,
          },
          errors: auditResult.passed ? undefined : [`${totalCritical} critical anti-patterns identified.`],
        };

        console.log(`🏁 [Thread ${threadId}] 🛡️ [QA Code Reviewer] Completed with status: ${result.status} (${durationMs}ms)`);
        resolve(result);
      } catch (err: any) {
        const durationMs = Date.now() - startTime;
        resolve({
          agentName: 'qa-code-reviewer',
          role: 'QA Code Reviewer & Gatekeeper',
          threadId,
          status: 'FAILED',
          durationMs,
          summary: `Code reviewer worker crashed: ${err.message}`,
          details: {},
          errors: [err.message],
        });
      }
    }, 10);
  });
}

/**
 * Central Orchestrator: QA Lead Agent
 * Fans out tasks to parallel threads, collects results at barrier synchronization,
 * enforces Definition of Done, and updates artifacts.
 */
export async function runParallelSwarm(): Promise<SwarmExecutionSummary> {
  const startTimestamp = new Date().toISOString();
  const overallStartTime = Date.now();
  const executionId = `swarm-${Date.now()}`;

  ensureDir(RESULTS_DIR);

  console.log('\n===============================================================');
  console.log(`🚀 [QA Lead Agent] Initiating True Parallel Multi-Agent Swarm`);
  console.log(`🆔 Execution ID: ${executionId} | Time: ${startTimestamp}`);
  console.log('===============================================================\n');

  console.log('⚡ [QA Lead Agent] Fanning out tasks to 3 parallel worker threads:');
  console.log('   -> Thread 1: SDET Automation Engineer (Playwright Specs)');
  console.log('   -> Thread 2: UX & Feasibility Auditor (WCAG 2.2 AA Scan)');
  console.log('   -> Thread 3: QA Code Reviewer (20 Anti-Patterns Gate)\n');

  // Launch all 3 workers in parallel!
  const workerPromises = [
    runSdetWorker(1),
    runUxAuditorWorker(2),
    runCodeReviewerWorker(3),
  ];

  // Barrier synchronization: wait for all parallel threads to complete
  const settledResults = await Promise.allSettled(workerPromises);
  const totalDurationMs = Date.now() - overallStartTime;

  ensureDir(RESULTS_DIR);

  console.log('\n===============================================================');
  console.log('🔄 [QA Lead Agent] All parallel threads reached barrier join.');
  console.log('📊 [QA Lead Agent] Aggregating telemetry and evaluating Release Gate...');
  console.log('===============================================================\n');

  const workerResults: AgentWorkerResult[] = [];
  let allPassed = true;

  for (const item of settledResults) {
    if (item.status === 'fulfilled') {
      const res = item.value;
      workerResults.push(res);
      // Write individual worker telemetry
      const workerFilePath = path.join(RESULTS_DIR, `${res.agentName}.json`);
      fs.writeFileSync(workerFilePath, JSON.stringify(res, null, 2), 'utf-8');

      if (res.status !== 'PASSED') {
        allPassed = false;
      }
    } else {
      allPassed = false;
      console.error('❌ Worker thread encountered unhandled rejection:', item.reason);
    }
  }

  const endTimestamp = new Date().toISOString();
  const summary: SwarmExecutionSummary = {
    executionId,
    startTime: startTimestamp,
    endTime: endTimestamp,
    totalDurationMs,
    overallGateStatus: allPassed ? 'PASSED' : 'FAILED',
    workerResults,
  };

  // Write consolidated report
  const summaryJsonPath = path.join(RESULTS_DIR, 'qa-lead-consolidated-report.json');
  fs.writeFileSync(summaryJsonPath, JSON.stringify(summary, null, 2), 'utf-8');

  // Generate Markdown summary
  const summaryMdPath = path.join(RESULTS_DIR, 'multi-agent-execution-summary.md');
  const mdContent = [
    '# 🤖 Parallel Multi-Agent Swarm Execution Summary',
    '',
    `- **Execution ID**: \`${executionId}\``,
    `- **Lead Orchestrator**: QA Lead Agent`,
    `- **Start Time**: ${startTimestamp}`,
    `- **End Time**: ${endTimestamp}`,
    `- **Wall-Clock Duration**: ${totalDurationMs}ms (Parallel Threading)`,
    `- **Definition of Done (DoD) Gate**: ${allPassed ? '🟢 PASSED' : '🔴 FAILED'}`,
    '',
    '---',
    '',
    '## 🧵 Worker Thread Telemetry',
    '',
    '| Thread | Agent Persona | Role | Status | Duration | Key Outcome |',
    '| :--- | :--- | :--- | :--- | :--- | :--- |',
    ...workerResults.map(
      (r) => `| **Thread ${r.threadId}** | \`${r.agentName}\` | ${r.role} | ${r.status === 'PASSED' ? '✅ PASSED' : '❌ FAILED'} | ${r.durationMs}ms | ${r.summary} |`
    ),
    '',
    '---',
    '',
    '## 🎯 Definition of Done (DoD) Decision',
    allPassed
      ? '✅ **Release Gate Approved**: All parallel criteria satisfied (specs passed, zero a11y violations, zero anti-patterns).'
      : '❌ **Release Gate Rejected**: One or more worker threads reported critical failures. Remediation required.',
    '',
  ].join('\n');

  fs.writeFileSync(summaryMdPath, mdContent, 'utf-8');

  // Update Traceability Matrix if passed
  if (allPassed && fs.existsSync(MATRIX_PATH)) {
    let matrix = fs.readFileSync(MATRIX_PATH, 'utf-8');
    matrix = matrix.replace(
      /Last Synchronized:.*$/m,
      `Last Synchronized: ${endTimestamp} (Verified by Parallel Multi-Agent Swarm)`
    );
    fs.writeFileSync(MATRIX_PATH, matrix, 'utf-8');
    console.log('📋 [QA Lead Agent] Synchronized manual-tests/traceability-matrix.md with verified status.');
  }

  console.log(`\n📄 Multi-agent summary written to: ${summaryMdPath}`);
  console.log(`🎯 Overall Release Gate Status: ${summary.overallGateStatus}`);

  return summary;
}

if (require.main === module) {
  runParallelSwarm().then((summary) => {
    if (summary.overallGateStatus === 'FAILED') {
      process.exit(1);
    }
  });
}
