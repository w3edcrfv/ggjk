// 测评对象类型
export type AssessmentTargetType = 'children' | 'adolescent' | 'adult' | 'elderly' | 'corporate';

// 测评对象接口
export interface AssessmentTarget {
  id: string;
  type: AssessmentTargetType;
  name: string;
  description: string;
  icon: string;
  ageRange?: string;
}

// 量表条目类型
export enum ItemType {
  SINGLE_CHOICE = 'single_choice',      // 单选题
  MULTIPLE_CHOICE = 'multiple_choice',  // 多选题
  SCALE = 'scale',                      // 量表题
}

// 量表条目选项
export interface ItemOption {
  value: string | number;
  label: string;
  score?: number;  // 选项对应的分值
}

// 量表条目
export interface AssessmentItem {
  id: string;
  question: string;
  type: ItemType;
  options: ItemOption[];
  required: boolean;
  dimension?: string;  // 维度（如：焦虑、抑郁等）
}

// 评分标准
export interface ScoringStandard {
  id: string;
  dimension: string;
  minScore: number;
  maxScore: number;
  level: string;      // 等级：如"正常"、"轻度"、"中度"、"重度"
  color: string;      // 图表颜色
  interpretation: string;  // 结果解释
  recommendations: string[];  // 建议
}

// 量表
export interface AssessmentScale {
  id: string;
  name: string;
  description: string;
  targetTypes: AssessmentTargetType[];  // 适用的测评对象类型
  items: AssessmentItem[];
  scoringType: 'sum' | 'average' | 'weighted';  // 计分方式：求和、平均、加权
  scoringStandards: ScoringStandard[];
  estimatedTime: string;  // 预计完成时间
}

// 用户基本信息
export interface UserInfo {
  id?: string;
  name: string;
  gender: 'male' | 'female' | 'other';
  age: number;
  phone?: string;
  email?: string;
  occupation?: string;
  targetId: string;  // 测评对象ID
  scaleId: string;   // 量表ID
  submitTime?: string;
}

// 答题记录
export interface AnswerRecord {
  itemId: string;
  value: string | number | (string | number)[];
  dimension?: string;
}

// 测评结果
export interface AssessmentResult {
  id: string;
  userInfo: UserInfo;
  answers: AnswerRecord[];
  totalScore: number;
  dimensionScores: { [dimension: string]: number };  // 各维度得分
  overallLevel: string;
  interpretation: string;
  recommendations: string[];
  chartData: {
    dimension: string;
    score: number;
    maxScore: number;
    percentage: number;
  }[];
  completedAt: string;
}

// 报告模板
export interface ReportTemplate {
  id: string;
  name: string;
  targetType: AssessmentTargetType;
  scaleId: string;
  sections: ReportSection[];
}

// 报告章节
export interface ReportSection {
  type: 'header' | 'summary' | 'chart' | 'detail' | 'recommendation';
  title: string;
  content?: string;
  order: number;
}

// 生成的测评报告
export interface AssessmentReport {
  id: string;
  resultId: string;
  userInfo: UserInfo;
  templateId: string;
  generatedAt: string;
  content: string;
}
