import { ReportTemplate } from '@/types/assessment';

export const reportTemplates: ReportTemplate[] = [
  {
    id: 'adult_sds_report',
    name: '成人抑郁测评报告模板',
    targetType: 'adult',
    scaleId: 'sds',
    sections: [
      {
        type: 'header',
        title: '报告标题',
        order: 1,
      },
      {
        type: 'summary',
        title: '测评结果概述',
        order: 2,
      },
      {
        type: 'chart',
        title: '得分图表',
        order: 3,
      },
      {
        type: 'detail',
        title: '详细分析',
        order: 4,
      },
      {
        type: 'recommendation',
        title: '专业建议',
        order: 5,
      },
    ],
  },
  {
    id: 'adult_sas_report',
    name: '成人焦虑测评报告模板',
    targetType: 'adult',
    scaleId: 'sas',
    sections: [
      {
        type: 'header',
        title: '报告标题',
        order: 1,
      },
      {
        type: 'summary',
        title: '测评结果概述',
        order: 2,
      },
      {
        type: 'chart',
        title: '得分图表',
        order: 3,
      },
      {
        type: 'detail',
        title: '详细分析',
        order: 4,
      },
      {
        type: 'recommendation',
        title: '专业建议',
        order: 5,
      },
    ],
  },
  {
    id: 'adolescent_sds_report',
    name: '青少年抑郁测评报告模板',
    targetType: 'adolescent',
    scaleId: 'sds',
    sections: [
      {
        type: 'header',
        title: '报告标题',
        order: 1,
      },
      {
        type: 'summary',
        title: '测评结果概述',
        order: 2,
      },
      {
        type: 'chart',
        title: '得分图表',
        order: 3,
      },
      {
        type: 'detail',
        title: '详细分析',
        order: 4,
      },
      {
        type: 'recommendation',
        title: '专业建议',
        order: 5,
      },
    ],
  },
  {
    id: 'elderly_sds_report',
    name: '老年人抑郁测评报告模板',
    targetType: 'elderly',
    scaleId: 'sds',
    sections: [
      {
        type: 'header',
        title: '报告标题',
        order: 1,
      },
      {
        type: 'summary',
        title: '测评结果概述',
        order: 2,
      },
      {
        type: 'chart',
        title: '得分图表',
        order: 3,
      },
      {
        type: 'detail',
        title: '详细分析',
        order: 4,
      },
      {
        type: 'recommendation',
        title: '专业建议',
        order: 5,
      },
    ],
  },
  {
    id: 'corporate_sas_report',
    name: '企业员工焦虑测评报告模板',
    targetType: 'corporate',
    scaleId: 'sas',
    sections: [
      {
        type: 'header',
        title: '报告标题',
        order: 1,
      },
      {
        type: 'summary',
        title: '测评结果概述',
        order: 2,
      },
      {
        type: 'chart',
        title: '得分图表',
        order: 3,
      },
      {
        type: 'detail',
        title: '详细分析',
        order: 4,
      },
      {
        type: 'recommendation',
        title: '专业建议',
        order: 5,
      },
    ],
  },
];

export function getTemplateByTargetAndScale(
  targetType: string,
  scaleId: string
): ReportTemplate | undefined {
  return reportTemplates.find(
    template => template.targetType === targetType && template.scaleId === scaleId
  );
}
