#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const StaticAnalyzer_1 = require("../analyzers/StaticAnalyzer");
const DynamicAnalyzer_1 = require("../analyzers/DynamicAnalyzer");
const program = new commander_1.Command();
program
    .name('seoscript')
    .description('SEO analysis tool for modern web applications')
    .version('0.1.0');
program
    .command('analyze')
    .description('Analyze a webpage or local file for SEO optimization')
    .option('-u, --url <url>', 'URL to analyze')
    .option('-f, --file <path>', 'Local file path to analyze')
    .option('-t, --timeout <ms>', 'Timeout for dynamic analysis', '30000')
    .action(async (options) => {
    const spinner = (0, ora_1.default)('Analyzing...').start();
    try {
        let result;
        if (options.url) {
            const analyzer = new DynamicAnalyzer_1.DynamicAnalyzer();
            result = await analyzer.analyze({
                url: options.url,
                timeout: parseInt(options.timeout),
            });
        }
        else if (options.file) {
            const analyzer = new StaticAnalyzer_1.StaticAnalyzer();
            result = await analyzer.analyze({
                filePath: options.file,
            });
        }
        else {
            throw new Error('Either --url or --file option is required');
        }
        spinner.succeed('Analysis complete!');
        console.log('\nSEO Analysis Report');
        console.log('==================\n');
        console.log(`Target: ${result.url}`);
        console.log(`Score: ${result.totalScore}/${result.maxPossibleScore}`);
        console.log(`Percentage: ${((result.totalScore / result.maxPossibleScore) * 100).toFixed(1)}%\n`);
        result.rules.forEach((rule) => {
            const status = rule.passed ? chalk_1.default.green('✓ PASS') : chalk_1.default.red('✗ FAIL');
            console.log(`${status} ${rule.message}`);
            if (rule.details) {
                rule.details.forEach((detail) => {
                    console.log(`  ${chalk_1.default.gray(detail)}`);
                });
            }
        });
    }
    catch (error) {
        spinner.fail('Analysis failed');
        console.error(chalk_1.default.red(error instanceof Error ? error.message : 'Unknown error occurred'));
        process.exit(1);
    }
});
program.parse();
