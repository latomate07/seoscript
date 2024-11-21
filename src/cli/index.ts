#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { StaticAnalyzer } from '../analyzers/StaticAnalyzer.js';
import { DynamicAnalyzer } from '../analyzers/DynamicAnalyzer.js';
import { AnalysisResult } from '../types/index.js';

const program = new Command();

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
    const spinner = ora('Analyzing...').start();

    try {
      let result: AnalysisResult;

      if (options.url) {
        const analyzer = new DynamicAnalyzer();
        result = await analyzer.analyze({
          url: options.url,
          timeout: parseInt(options.timeout),
        });
      } else if (options.file) {
        const analyzer = new StaticAnalyzer();
        result = await analyzer.analyze({
          filePath: options.file,
        });
      } else {
        throw new Error('Either --url or --file option is required');
      }

      spinner.succeed('Analysis complete!');

      console.log('\nSEO Analysis Report');
      console.log('==================\n');
      console.log(`Target: ${result.url}`);
      console.log(`Score: ${result.totalScore}/${result.maxPossibleScore}`);
      console.log(
        `Percentage: ${((result.totalScore / result.maxPossibleScore) * 100).toFixed(1)}%\n`
      );

      result.rules.forEach((rule) => {
        const status = rule.passed ? chalk.green('✓ PASS') : chalk.red('✗ FAIL');

        console.log(`${status} ${rule.message}`);
        if (rule.details) {
          rule.details.forEach((detail) => {
            console.log(`  ${chalk.gray(detail)}`);
          });
        }
      });
    } catch (error) {
      spinner.fail('Analysis failed');
      console.error(chalk.red(error instanceof Error ? error.message : 'Unknown error occurred'));
      process.exit(1);
    }
  });

program.parse();
