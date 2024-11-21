import puppeteer from 'puppeteer';
import { rules } from '../rules';
export class DynamicAnalyzer {
    rules;
    constructor(customRules) {
        this.rules = customRules || rules;
    }
    async analyze(options) {
        if (!options.url) {
            throw new Error('URL is required for dynamic analysis');
        }
        const browser = await puppeteer.launch({
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