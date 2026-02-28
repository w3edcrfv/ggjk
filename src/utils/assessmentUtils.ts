import {
  UserInfo,
  AnswerRecord,
  AssessmentScale,
  AssessmentResult,
  ScoringStandard,
} from '@/types/assessment';

// 计算测评分数
export function calculateScore(
  scale: AssessmentScale,
  answers: AnswerRecord[]
): { totalScore: number; dimensionScores: { [dimension: string]: number } } {
  const dimensionScores: { [dimension: string]: number } = {};
  let totalScore = 0;

  // 初始化各维度分数
  const dimensions = [...new Set(scale.items.map(item => item.dimension).filter(Boolean))];
  dimensions.forEach(dimension => {
    dimensionScores[dimension!] = 0;
  });

  // 计算每道题的分数
  scale.items.forEach(item => {
    const answer = answers.find(a => a.itemId === item.id);
    if (!answer) return;

    let itemScore = 0;
    const value = answer.value;

    if (item.type === 'scale') {
      itemScore = Number(value);
    } else if (item.type === 'single_choice') {
      const option = item.options.find(opt => opt.value === value);
      itemScore = option?.score || 0;
    } else if (item.type === 'multiple_choice') {
      if (Array.isArray(value)) {
        value.forEach(v => {
          const option = item.options.find(opt => opt.value === v);
          itemScore += option?.score || 0;
        });
      }
    }

    // 累加到总分和维度分
    totalScore += itemScore;
    if (item.dimension) {
      dimensionScores[item.dimension] += itemScore;
    }
  });

  // 根据计分方式处理
  if (scale.scoringType === 'average') {
    totalScore = totalScore / scale.items.length;
    dimensions.forEach(dimension => {
      const count = scale.items.filter(item => item.dimension === dimension).length;
      if (count > 0) {
        dimensionScores[dimension!] = dimensionScores[dimension!] / count;
      }
    });
  }

  return { totalScore, dimensionScores };
}

// 获取评分标准
export function getScoringStandard(
  scale: AssessmentScale,
  dimension: string,
  score: number
): ScoringStandard | undefined {
  return scale.scoringStandards.find(
    standard => standard.dimension === dimension && score >= standard.minScore && score <= standard.maxScore
  );
}

// 生成测评结果
export function generateAssessmentResult(
  userInfo: UserInfo,
  scale: AssessmentScale,
  answers: AnswerRecord[]
): AssessmentResult {
  const { totalScore, dimensionScores } = calculateScore(scale, answers);

  // 确定总体等级和解释
  let overallLevel = '';
  let interpretation = '';
  let recommendations: string[] = [];

  // 找到总分对应的等级（以第一个维度为例）
  const firstDimension = Object.keys(dimensionScores)[0];
  const standard = getScoringStandard(scale, firstDimension, totalScore);

  if (standard) {
    overallLevel = standard.level;
    interpretation = standard.interpretation;
    recommendations = standard.recommendations;
  }

  // 生成图表数据
  const chartData = Object.entries(dimensionScores).map(([dimension, score]) => ({
    dimension,
    score,
    maxScore: 80, // 假设最大分为80分
    percentage: Math.round((score / 80) * 100),
  }));

  return {
    id: `result_${Date.now()}`,
    userInfo,
    answers,
    totalScore,
    dimensionScores,
    overallLevel,
    interpretation,
    recommendations,
    chartData,
    completedAt: new Date().toISOString(),
  };
}

// 生成测评报告内容
export function generateReportContent(
  result: AssessmentResult,
  scale: AssessmentScale
): string {
  const { userInfo, totalScore, overallLevel, interpretation, recommendations, completedAt } = result;

  return `
# 心理健康测评报告

## 基本信息

**姓名**: ${userInfo.name}
**性别**: ${userInfo.gender === 'male' ? '男' : userInfo.gender === 'female' ? '女' : '其他'}
**年龄**: ${userInfo.age}岁
**测评量表**: ${scale.name}
**测评时间**: ${new Date(completedAt).toLocaleString('zh-CN')}

---

## 测评结果

**总得分**: ${totalScore}分
**测评等级**: ${overallLevel}

### 结果解释

${interpretation}

### 得分详情

${result.chartData.map(d => `
- **${d.dimension}维度**: ${d.score}分 (${d.percentage}%)
`).join('\n')}

---

## 专业建议

${recommendations.map((rec, index) => `${index + 1}. ${rec}`).join('\n')}

---

## 注意事项

1. 本测评结果仅供参考，不能作为临床诊断依据
2. 如果测评结果显示存在问题，建议及时咨询专业心理咨询师或精神科医生
3. 保持良好的生活习惯和心态对心理健康非常重要
4. 定期进行心理健康评估有助于及时发现和解决问题

---

## 声明

本测评结果由系统自动生成，仅供参考。如有任何疑问，请咨询专业医疗人员。

**生成时间**: ${new Date().toLocaleString('zh-CN')}
  `.trim();
}

// 导出为PDF（使用html2canvas和jspdf）
export async function exportToPDF(element: HTMLElement, filename: string = '测评报告.pdf') {
  const html2canvas = (await import('html2canvas')).default;
  const jsPDF = (await import('jspdf')).default;

  const canvas = await html2canvas(element, {
    scale: 2,
    logging: false,
    useCORS: true,
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = canvas.width;
  const imgHeight = canvas.height;
  const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
  const imgX = (pdfWidth - imgWidth * ratio) / 2;
  const imgY = 30;

  pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
  pdf.save(filename);
}

// 保存测评结果到本地存储
export function saveAssessmentResult(result: AssessmentResult): void {
  // 确保 userInfo 有必要的字段
  if (!result.userInfo.name) {
    console.warn('保存测评结果时缺少姓名信息');
  }
  const results = getAssessmentResults();
  results.push(result);
  localStorage.setItem('assessmentResults', JSON.stringify(results));
}

// 获取所有测评结果
export function getAssessmentResults(): AssessmentResult[] {
  const data = localStorage.getItem('assessmentResults');
  return data ? JSON.parse(data) : [];
}

// 根据ID获取测评结果
export function getResultById(id: string): AssessmentResult | undefined {
  const results = getAssessmentResults();
  return results.find(r => r.id === id);
}
