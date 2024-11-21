import { StaticAnalyzer } from '../analyzers/StaticAnalyzer';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

describe('StaticAnalyzer', () => {
  let analyzer: StaticAnalyzer;
  let testDir: string;
  let testFile: string;

  beforeAll(async () => {
    testDir = join(tmpdir(), 'seoscript-tests');
    testFile = join(testDir, 'test.html');
    await mkdir(testDir, { recursive: true });
  });

  beforeEach(() => {
    analyzer = new StaticAnalyzer();
  });

  it('should analyze HTML file with good SEO practices', async () => {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>This is a good title for SEO</title>
          <meta name="description" content="This is a good meta description that has the optimal length for search engines to properly index the content." />
        </head>
        <body>
          <h1>Welcome to the test page</h1>
        </body>
      </html>
    `;

    await writeFile(testFile, html);
    const result = await analyzer.analyze({ filePath: testFile });

    expect(result.totalScore).toBe(result.maxPossibleScore);
    expect(result.rules.every((r) => r.passed)).toBe(true);
  });

  it('should detect missing SEO elements', async () => {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
        </head>
        <body>
          <h1>Welcome</h1>
        </body>
      </html>
    `;

    await writeFile(testFile, html);
    const result = await analyzer.analyze({ filePath: testFile });

    expect(result.totalScore).toBe(0);
    expect(result.rules.every((r) => !r.passed)).toBe(true);
  });
});
