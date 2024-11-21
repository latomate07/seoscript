import { AnalysisResult, AnalyzerOptions, SeoRule } from '../types';
export declare class DynamicAnalyzer {
    private rules;
    constructor(customRules?: SeoRule[]);
    analyze(options: AnalyzerOptions): Promise<AnalysisResult>;
}
