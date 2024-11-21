"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticAnalyzer = void 0;
const promises_1 = require("fs/promises");
const rules_1 = require("../rules");
class StaticAnalyzer {
    constructor(customRules) {
        this.rules = customRules || rules_1.rules;
    }
    async analyze(options) {
        if (!options.filePath) {
            throw new Error('File path is required for static analysis');
        }
        const content = await (0, promises_1.readFile)(options.filePath, 'utf-8');
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
exports.StaticAnalyzer = StaticAnalyzer;
