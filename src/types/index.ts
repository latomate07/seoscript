export interface SeoRule {
  id: string;
  name: string;
  description: string;
  weight: number;
  validate: (content: string) => RuleResult;
}

export interface RuleResult {
  passed: boolean;
  score: number;
  message: string;
  details?: string[];
}

export interface AnalysisResult {
  url: string;
  totalScore: number;
  maxPossibleScore: number;
  rules: RuleResult[];
  timestamp: Date;
}

export interface AnalyzerOptions {
  url?: string;
  filePath?: string;
  rules?: string[];
  timeout?: number;
}

export type ContentType = 'static' | 'dynamic' | 'react' | 'vue' | 'angular';
