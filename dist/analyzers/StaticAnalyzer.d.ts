import { AnalysisResult, AnalyzerOptions, SeoRule } from '../types/index.js';
export declare class StaticAnalyzer {
    private rules;
    constructor(customRules?: SeoRule[]);
    analyze(options: AnalyzerOptions): Promise<AnalysisResult>;
}
