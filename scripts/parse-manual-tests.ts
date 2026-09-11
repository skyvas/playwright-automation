import fs from 'fs';
import path from 'path';

export interface TestStep {
  stepNumber: number;
  action: string;
  expected: string;
}

export interface NormalizedTestCase {
  id: string;
  title: string;
  suite: string;
  priority: 'smoke' | 'regression';
  preconditions: string[];
  steps: TestStep[];
  sourceFile: string;
  sourceSystem: 'TestRail' | 'Xray' | 'Zephyr' | 'Markdown' | 'Generic';
}

const INCOMING_DIR = path.resolve(process.cwd(), 'manual-tests/incoming');
const OUTPUT_FILE = path.resolve(process.cwd(), 'manual-tests/parsed/test-manifest.json');

/**
 * Basic CSV line splitter respecting quoted multi-line values
 */
function parseCSV(content: string): Record<string, string>[] {
  const lines: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    if (char === '"') {
      inQuotes = !inQuotes;
      current += char;
    } else if (char === '\n' && !inQuotes) {
      lines.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  if (current.trim()) lines.push(current);

  if (lines.length < 2) return [];

  const parseRow = (line: string): string[] => {
    const values: string[] = [];
    let val = '';
    let inQ = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        inQ = !inQ;
      } else if (c === ',' && !inQ) {
        values.push(val.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
        val = '';
      } else {
        val += c;
      }
    }
    values.push(val.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
    return values;
  };

  const headers = parseRow(lines[0]).map(h => h.trim().toLowerCase());
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    let values = parseRow(lines[i]);
    if (values.length > headers.length) {
      // Re-stitch fields that had unquoted commas between Steps (idx 4) and Priority (last idx)
      const expectedIndex = headers.indexOf('expected result') !== -1 ? headers.indexOf('expected result') : 5;
      const extraCount = values.length - headers.length;
      const stitched = values.slice(expectedIndex, expectedIndex + extraCount + 1).join(', ');
      values = [
        ...values.slice(0, expectedIndex),
        stitched,
        ...values.slice(expectedIndex + extraCount + 1),
      ];
    }
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx] || '';
    });
    rows.push(row);
  }

  return rows;
}

export function parseTestRailCSV(filePath: string): NormalizedTestCase[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const rows = parseCSV(content);

  return rows.map((row, idx) => {
    const id = row['id'] || row['key'] || `TC-${idx + 1}`;
    const title = row['title'] || row['summary'] || row['name'] || `Test Case ${idx + 1}`;
    const suite = row['section'] || row['suite'] || 'General';
    const rawPriority = (row['priority'] || '').toLowerCase();
    const priority = rawPriority.includes('high') || rawPriority.includes('smoke') || rawPriority.includes('critical')
      ? 'smoke'
      : 'regression';

    const preconditions = (row['preconditions'] || '')
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const rawSteps = (row['steps'] || '').replace(/\\n/g, '\n');
    const rawExpected = (row['expected result'] || row['expected'] || '').replace(/\\n/g, '\n');

    const stepLines = rawSteps
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const steps: TestStep[] = stepLines.map((line, sIdx) => ({
      stepNumber: sIdx + 1,
      action: line.replace(/^\d+[\.\)]\s*/, ''),
      expected: sIdx === stepLines.length - 1 ? rawExpected : 'Action completed successfully',
    }));

    return {
      id,
      title,
      suite,
      priority,
      preconditions,
      steps: steps.length > 0 ? steps : [{ stepNumber: 1, action: title, expected: rawExpected }],
      sourceFile: path.basename(filePath),
      sourceSystem: 'TestRail',
    };
  });
}

export function parseGherkinFeature(filePath: string): NormalizedTestCase[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const testCases: NormalizedTestCase[] = [];

  let currentFeature = 'General';
  let currentScenario: NormalizedTestCase | null = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (line.startsWith('Feature:')) {
      currentFeature = line.replace('Feature:', '').trim();
    } else if (line.startsWith('Scenario:') || line.startsWith('Scenario Outline:')) {
      if (currentScenario) testCases.push(currentScenario);

      const title = line.replace(/Scenario( Outline)?:/, '').trim();
      currentScenario = {
        id: `GHK-${testCases.length + 1}`,
        title,
        suite: currentFeature,
        priority: 'regression',
        preconditions: [],
        steps: [],
        sourceFile: path.basename(filePath),
        sourceSystem: 'Xray',
      };
    } else if (line.startsWith('@') && !currentScenario) {
      // Tags before scenario or feature
      if (line.toLowerCase().includes('smoke')) {
        // Will apply to next scenario
      }
    } else if (currentScenario) {
      if (line.startsWith('@')) {
        if (line.toLowerCase().includes('smoke')) currentScenario.priority = 'smoke';
        const tagIdMatch = line.match(/@(C\d+|[A-Z]+-\d+)/);
        if (tagIdMatch) currentScenario.id = tagIdMatch[1];
      } else if (line.startsWith('Given ')) {
        currentScenario.preconditions.push(line.replace('Given ', '').trim());
      } else if (line.startsWith('When ') || line.startsWith('And ') || line.startsWith('Then ')) {
        const stepNum = currentScenario.steps.length + 1;
        currentScenario.steps.push({
          stepNumber: stepNum,
          action: line,
          expected: line.startsWith('Then') ? 'Condition satisfied' : 'Action completed',
        });
      }
    }
  }
  if (currentScenario) testCases.push(currentScenario);

  return testCases;
}

export function parseZephyrJSON(filePath: string): NormalizedTestCase[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(content);
  const items = Array.isArray(data) ? data : [data];

  return items.map((item: any, idx: number) => {
    const id = item.key || item.id || `ZEP-${idx + 1}`;
    const title = item.name || item.title || item.summary || `Test ${id}`;
    const suite = item.component || item.folder || 'General';
    const rawPriority = (item.priority || '').toLowerCase();
    const priority = rawPriority.includes('high') || rawPriority.includes('critical') ? 'smoke' : 'regression';
    const preconditions = item.precondition ? [item.precondition] : [];

    const steps: TestStep[] = (item.steps || []).map((st: any, sIdx: number) => ({
      stepNumber: st.index || sIdx + 1,
      action: st.description || st.action || '',
      expected: st.expectedResult || st.expected || '',
    }));

    return {
      id,
      title,
      suite,
      priority,
      preconditions,
      steps,
      sourceFile: path.basename(filePath),
      sourceSystem: 'Zephyr',
    };
  });
}

export function parseMarkdownFile(filePath: string): NormalizedTestCase[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const testCases: NormalizedTestCase[] = [];

  let currentSuite = 'General';
  let currentCase: NormalizedTestCase | null = null;
  let inSteps = false;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (line.startsWith('## Suite:')) {
      currentSuite = line.replace('## Suite:', '').trim();
    } else if (line.startsWith('### Test Case:')) {
      if (currentCase) testCases.push(currentCase);

      const header = line.replace('### Test Case:', '').trim();
      const parts = header.split(' - ');
      const id = parts[0] ? parts[0].trim() : `TC-${testCases.length + 1}`;
      const title = parts.slice(1).join(' - ').trim() || header;

      currentCase = {
        id,
        title,
        suite: currentSuite,
        priority: 'regression',
        preconditions: [],
        steps: [],
        sourceFile: path.basename(filePath),
        sourceSystem: 'Markdown',
      };
      inSteps = false;
    } else if (currentCase) {
      if (line.toLowerCase().includes('**priority**:')) {
        const p = line.split(':')[1]?.toLowerCase() || '';
        if (p.includes('smoke') || p.includes('high')) currentCase.priority = 'smoke';
      } else if (line.toLowerCase().includes('**preconditions**:')) {
        currentCase.preconditions.push(line.split(':')[1]?.trim() || '');
      } else if (line.toLowerCase().includes('**steps**:')) {
        inSteps = true;
      } else if (line.toLowerCase().includes('**expected result**:')) {
        inSteps = false;
        const exp = line.split(':')[1]?.trim() || '';
        if (currentCase.steps.length > 0) {
          currentCase.steps[currentCase.steps.length - 1].expected = exp;
        }
      } else if (inSteps && /^\d+\.\s+/.test(line)) {
        currentCase.steps.push({
          stepNumber: currentCase.steps.length + 1,
          action: line.replace(/^\d+\.\s+/, ''),
          expected: 'Action performed',
        });
      }
    }
  }
  if (currentCase) testCases.push(currentCase);

  return testCases;
}

export function parseAllIncoming(): NormalizedTestCase[] {
  if (!fs.existsSync(INCOMING_DIR)) {
    fs.mkdirSync(INCOMING_DIR, { recursive: true });
  }

  const files = fs.readdirSync(INCOMING_DIR).filter(f => !f.startsWith('.'));
  const allCases: NormalizedTestCase[] = [];

  for (const file of files) {
    const fullPath = path.join(INCOMING_DIR, file);
    const ext = path.extname(file).toLowerCase();

    if (ext === '.csv') {
      allCases.push(...parseTestRailCSV(fullPath));
    } else if (ext === '.feature') {
      allCases.push(...parseGherkinFeature(fullPath));
    } else if (ext === '.json') {
      allCases.push(...parseZephyrJSON(fullPath));
    } else if (ext === '.md') {
      allCases.push(...parseMarkdownFile(fullPath));
    }
  }

  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allCases, null, 2));
  return allCases;
}

// CLI Execution
if (require.main === module || process.argv[1]?.includes('parse-manual-tests')) {
  console.log('Scanning manual-tests/incoming for test files...');
  const results = parseAllIncoming();
  console.log(`Successfully ingested and normalized ${results.length} test cases.`);
  console.log(`Manifest written to: ${path.relative(process.cwd(), OUTPUT_FILE)}`);
}
