import puppeteer from 'puppeteer';
import { AnalysisResult, AnalyzerOptions, SeoRule } from '../types/index.js';
import { rules } from '../rules/index.js';

export class DynamicAnalyzer {
  private rules: SeoRule[];

  constructor(customRules?: SeoRule[]) {
    this.rules = customRules || rules;
  }

  async analyze(options: AnalyzerOptions): Promise<AnalysisResult> {
    if (!options.url) {
      throw new Error('URL is required for dynamic analysis');
    }

    const browser = await puppeteer.launch({
      headless: true
    });
    const page = await browser.newPage();

    try {
      await page.goto(options.url, {
        waitUntil: 'networkidle0',
        timeout: options.timeout || 30000,
      });

      const content = await page.content();
      const results = this.rules.map((rule) => ({
        rule: rule.id,
        ...rule.validate(content),
      }));

      const totalScore = results.reduce((sum, result) => sum + result.score, 0);
      const maxPossibleScore = this.rules.reduce((sum, rule) => sum + rule.weight, 0);

      return {
        url: options.url,
        totalScore,
        maxPossibleScore,
        rules: results,
        timestamp: new Date(),
      };
    } finally {
      await browser.close();
    }
  }
}
