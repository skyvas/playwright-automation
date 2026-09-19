import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Autonomous Squad & DAG Orchestration Standard', () => {
  const rootDir = path.join(__dirname, '../..');
  const agentsDir = path.join(rootDir, '.agents');
  const skillsDir = path.join(agentsDir, 'skills');
  const personasDir = path.join(agentsDir, 'agents');

  // Utility to extract and validate staged DAG execution from SKILL.md
  function extractSkillDAG(skillContent: string): string[] {
    const stageRegex = /### Stage \d+:.*?\(`?([a-zA-Z0-9-]+)`?\)/g;
    const stages: string[] = [];
    let match;
    while ((match = stageRegex.exec(skillContent)) !== null) {
      stages.push(match[1]);
    }
    return stages;
  }

  test('1. Universal Agent Contract & Tooling are properly established', async () => {
    // AGENTS.md (Single Source of Truth)
    const agentsMdPath = path.join(rootDir, 'AGENTS.md');
    expect(fs.existsSync(agentsMdPath)).toBeTruthy();
    const agentsMdContent = fs.readFileSync(agentsMdPath, 'utf8');
    expect(agentsMdContent).toContain('Universal Agent Standard');
    expect(agentsMdContent).toContain('Autonomous Squad Personas');
    expect(agentsMdContent).toContain('sdet-automation.md');
    expect(agentsMdContent).toContain('getByRole');

    // CLAUDE.md (Vendor-neutral compatibility)
    const claudeMdPath = path.join(rootDir, 'CLAUDE.md');
    expect(fs.existsSync(claudeMdPath)).toBeTruthy();

    // MCP Server Configuration
    const mcpConfigPath = path.join(rootDir, '.mcp.json');
    expect(fs.existsSync(mcpConfigPath)).toBeTruthy();
    const mcpConfig = JSON.parse(fs.readFileSync(mcpConfigPath, 'utf8'));
    expect(mcpConfig.mcpServers.playwright).toBeDefined();
    expect(mcpConfig.mcpServers.playwright.args).toContain('@playwright/mcp');
  });

  test('2. All 5 Autonomous Squad Personas are configured and active', async () => {
    const expectedPersonas = [
      'test-ingestion-orchestrator.md',
      'qa-lead.md',
      'sdet-automation.md',
      'qa-code-reviewer.md',
      'ux-feasibility-auditor.md',
    ];

    for (const persona of expectedPersonas) {
      const personaPath = path.join(personasDir, persona);
      expect(fs.existsSync(personaPath), `Persona ${persona} should exist`).toBeTruthy();
      const content = fs.readFileSync(personaPath, 'utf8');
      expect(content).toContain('Role & Mission');
      expect(content.includes('Core Capabilities') || content.includes('Core Rules')).toBeTruthy();
    }

    // Verify sdet-automation explicitly incorporates playwright-pro skills
    const sdetContent = fs.readFileSync(path.join(personasDir, 'sdet-automation.md'), 'utf8');
    expect(sdetContent).toContain('playwright-pro');
  });

  test('3. Test Case Generation Skill conforms to Google standard and validates DAG order', async () => {
    const skillPath = path.join(skillsDir, 'test-case-generation', 'SKILL.md');
    expect(fs.existsSync(skillPath)).toBeTruthy();

    const content = fs.readFileSync(skillPath, 'utf8');

    // Frontmatter contract
    expect(content).toMatch(/^---\nname:\s*"test-case-generation"/);
    expect(content).toContain('description:');

    // DAG sequential order
    const executionOrder = extractSkillDAG(content);
    expect(executionOrder).toEqual([
      'explore-website',
      'discover-ui-components',
      'generate-scenarios',
      'author-test-cases',
      'validate-and-export',
    ]);

    expect(executionOrder.indexOf('explore-website')).toBeLessThan(executionOrder.indexOf('discover-ui-components'));
    expect(executionOrder.indexOf('generate-scenarios')).toBeLessThan(executionOrder.indexOf('author-test-cases'));

    // Agent assignment and skill usage
    expect(content).toContain('sdet-automation');
    expect(content).toContain('playwright-pro');
    expect(content).toContain('copy_paste_instructions');

    // Self-contained resources and examples
    const baseDir = path.join(skillsDir, 'test-case-generation');
    expect(fs.existsSync(path.join(baseDir, 'resources', 'input.json'))).toBeTruthy();
    expect(fs.existsSync(path.join(baseDir, 'examples', 'output-example.csv'))).toBeTruthy();
  });

  test('4. Test Automation Generation Skill conforms to Google standard and validates DAG order', async () => {
    const skillPath = path.join(skillsDir, 'test-automation-generation', 'SKILL.md');
    expect(fs.existsSync(skillPath)).toBeTruthy();

    const content = fs.readFileSync(skillPath, 'utf8');

    // Frontmatter contract
    expect(content).toMatch(/^---\nname:\s*"test-automation-generation"/);
    expect(content).toContain('description:');

    // DAG sequential order
    const executionOrder = extractSkillDAG(content);
    expect(executionOrder).toEqual([
      'parse-manual-tests',
      'determine-strategy',
      'generate-automation',
      'review-code',
      'report-results',
    ]);

    expect(executionOrder.indexOf('generate-automation')).toBeLessThan(executionOrder.indexOf('review-code'));

    // Agent assignment and skill usage
    expect(content).toContain('sdet-automation');
    expect(content).toContain('playwright-pro');
    expect(content).toContain('copy_paste_steps');

    // Self-contained resources and examples
    const baseDir = path.join(skillsDir, 'test-automation-generation');
    expect(fs.existsSync(path.join(baseDir, 'resources', 'manual-tests.csv'))).toBeTruthy();
    expect(fs.existsSync(path.join(baseDir, 'examples', 'generated.spec.ts.example'))).toBeTruthy();
  });

  test('5. Enterprise Flaky Test Healing DAG conforms to standard and validates stages', async () => {
    const skillPath = path.join(skillsDir, 'flaky-test-healing', 'SKILL.md');
    expect(fs.existsSync(skillPath)).toBeTruthy();
    const content = fs.readFileSync(skillPath, 'utf8');

    expect(content).toMatch(/^---\nname:\s*"flaky-test-healing"/);
    const executionOrder = extractSkillDAG(content);
    expect(executionOrder).toEqual([
      'parse-failure-trace',
      'diagnose-root-cause',
      'inspect-live-dom',
      'apply-healed-locator',
      'stress-verification',
    ]);

    const baseDir = path.join(skillsDir, 'flaky-test-healing');
    expect(fs.existsSync(path.join(baseDir, 'resources', 'failure-schema.json'))).toBeTruthy();
    expect(fs.existsSync(path.join(baseDir, 'examples', 'healed-spec.example.ts'))).toBeTruthy();
  });

  test('6. Network Mock & Contract Synthesis DAG conforms to standard and validates stages', async () => {
    const skillPath = path.join(skillsDir, 'network-mock-synthesis', 'SKILL.md');
    expect(fs.existsSync(skillPath)).toBeTruthy();
    const content = fs.readFileSync(skillPath, 'utf8');

    expect(content).toMatch(/^---\nname:\s*"network-mock-synthesis"/);
    const executionOrder = extractSkillDAG(content);
    expect(executionOrder).toEqual([
      'record-network-traffic',
      'extract-contracts',
      'synthesize-route-mocks',
      'generate-negative-scenarios',
      'wire-fixtures',
    ]);

    const baseDir = path.join(skillsDir, 'network-mock-synthesis');
    expect(fs.existsSync(path.join(baseDir, 'resources', 'network-contract.json'))).toBeTruthy();
    expect(fs.existsSync(path.join(baseDir, 'examples', 'mocked-routes.example.ts'))).toBeTruthy();
  });

  test('7. Visual & Accessibility Gatekeeper DAG conforms to standard and validates stages', async () => {
    const skillPath = path.join(skillsDir, 'a11y-visual-audit', 'SKILL.md');
    expect(fs.existsSync(skillPath)).toBeTruthy();
    const content = fs.readFileSync(skillPath, 'utf8');

    expect(content).toMatch(/^---\nname:\s*"a11y-visual-audit"/);
    const executionOrder = extractSkillDAG(content);
    expect(executionOrder).toEqual([
      'crawl-application-routes',
      'automated-a11y-scan',
      'visual-snapshot-comparison',
      'usability-feasibility-review',
      'generate-compliance-manifest',
    ]);

    const baseDir = path.join(skillsDir, 'a11y-visual-audit');
    expect(fs.existsSync(path.join(baseDir, 'resources', 'audit-config.json'))).toBeTruthy();
    expect(fs.existsSync(path.join(baseDir, 'examples', 'audit-spec.example.ts'))).toBeTruthy();
  });

  test('8. Release Certification & Synthetic Smoke DAG conforms to standard and validates stages', async () => {
    const skillPath = path.join(skillsDir, 'release-certification', 'SKILL.md');
    expect(fs.existsSync(skillPath)).toBeTruthy();
    const content = fs.readFileSync(skillPath, 'utf8');

    expect(content).toMatch(/^---\nname:\s*"release-certification"/);
    const executionOrder = extractSkillDAG(content);
    expect(executionOrder).toEqual([
      'environment-healthcheck',
      'execute-critical-smoke',
      'synthetic-journey-run',
      'audit-console-network',
      'signoff-or-rollback',
    ]);

    const baseDir = path.join(skillsDir, 'release-certification');
    expect(fs.existsSync(path.join(baseDir, 'resources', 'release-criteria.json'))).toBeTruthy();
    expect(fs.existsSync(path.join(baseDir, 'examples', 'certification-report.example.md'))).toBeTruthy();
  });

  test('9. All active workspace skills adhere to Google Skill Specification', async () => {
    const entries = fs.readdirSync(skillsDir, { withFileTypes: true });
    const skillFolders = entries.filter((e) => e.isDirectory()).map((e) => e.name);

    for (const folder of skillFolders) {
      const skillFile = path.join(skillsDir, folder, 'SKILL.md');
      expect(fs.existsSync(skillFile), `Skill ${folder} must have SKILL.md`).toBeTruthy();
      const content = fs.readFileSync(skillFile, 'utf8');
      expect(content).toMatch(/^---\nname:/);
      expect(content).toContain('description:');
    }
  });

  test('10. Foundational Page Object Model, Base Fixture, and Dynamic Verification Utility exist', async () => {
    // BasePage
    const basePagePath = path.join(rootDir, 'pages', 'BasePage.ts');
    expect(fs.existsSync(basePagePath)).toBeTruthy();
    const basePageContent = fs.readFileSync(basePagePath, 'utf8');
    expect(basePageContent).toContain('export abstract class BasePage');

    // baseTest fixture
    const baseTestPath = path.join(rootDir, 'tests', 'fixtures', 'baseTest.ts');
    expect(fs.existsSync(baseTestPath)).toBeTruthy();
    const baseTestContent = fs.readFileSync(baseTestPath, 'utf8');
    expect(baseTestContent).toContain('export const test = baseTest.extend');

    // verify-spec-execution utility
    const verifyScriptPath = path.join(rootDir, 'scripts', 'verify-spec-execution.ts');
    expect(fs.existsSync(verifyScriptPath)).toBeTruthy();
    const verifyScriptContent = fs.readFileSync(verifyScriptPath, 'utf8');
    expect(verifyScriptContent).toContain('export function verifySpecExecution');
  });
});
