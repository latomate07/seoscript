"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamicAnalyzer = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const rules_1 = require("../rules");
class DynamicAnalyzer {
    constructor(customRules) {
        this.rules = customRules || rules_1.rules;
    }
    async analyze(options) {
        if (!options.url) {
            throw new Error('URL is required for dynamic analysis');
        }
        const browser = await puppeteer_1.default.launch({
            headless: "new"
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
        }
        finally {
            await browser.close();
        }
    }
}
exports.DynamicAnalyzer = DynamicAnalyzer;
