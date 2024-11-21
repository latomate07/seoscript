import { readFile } from 'fs/promises';
import { rules } from '../rules/index.js';
export class StaticAnalyzer {
    rules;
    constructor(customRules) {
        this.rules = customRules || rules;
    }
    async analyze(options) {
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
