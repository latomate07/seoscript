import { readFile } from 'fs/promises';
import { AnalysisResult, AnalyzerOptions, SeoRule } from '../types';
import { rules } from '../rules';

export class StaticAnalyzer {
  private rules: SeoRule[];

  constructor(customRules?: SeoRule[]) {
    this.rules = customRules || rules;
  }

  async analyze(options: AnalyzerOptions): Promise<AnalysisResult> {
    if (!options.filePath) {
      throw new Error('File path is required for static analysis');
    }

    const content = await readFile(options.filePath, 'utf-8');
    const results = this.rules.map((rule) => ({
      rule: rule.id,
      ...rule.validate(content),
    }));

    const totalScore = results.reduce((sum, result) => sum + result.score, 0);
    const maxPossibleScore = this.rules.reduce((sum, rule) => sum + rule.weight, 0);

    return {
      url: options.filePath,
      totalScore,
      maxPossibleScore,
      rules: results,
      timestamp: new Date(),
    };
  }
}
