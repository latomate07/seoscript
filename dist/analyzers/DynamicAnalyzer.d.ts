import { AnalysisResult, AnalyzerOptions, SeoRule } from '../types/index.js';
export declare class DynamicAnalyzer {
    private rules;
    constructor(customRules?: SeoRule[]);
    analyze(options: AnalyzerOptions): Promise<AnalysisResult>;
}
