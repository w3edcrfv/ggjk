import { AssessmentTarget } from '@/types/assessment';

export const assessmentTargets: AssessmentTarget[] = [
  {
    id: 'children',
    type: 'children',
    name: '儿童心理健康测评',
    description: '适用于6-12岁儿童的心理健康评估，包含情绪、行为、社交等维度',
    icon: '🧒',
    ageRange: '6-12岁',
  },
  {
    id: 'adolescent',
    type: 'adolescent',
    name: '青少年心理健康测评',
    description: '适用于13-18岁青少年的心理健康评估，关注学业压力、人际关系等',
    icon: '🎓',
    ageRange: '13-18岁',
  },
  {
    id: 'adult',
    type: 'adult',
    name: '成人心理健康测评',
    description: '适用于18-60岁成人的全面心理健康评估',
    icon: '👤',
    ageRange: '18-60岁',
  },
  {
    id: 'elderly',
    type: 'elderly',
    name: '老年人心理健康测评',
    description: '适用于60岁以上老年人的心理健康和认知功能评估',
    icon: '👴',
    ageRange: '60岁以上',
  },
  {
    id: 'corporate',
    type: 'corporate',
    name: '企业员工心理健康测评',
    description: '适用于企业员工的工作压力、职业倦怠等心理健康评估',
    icon: '💼',
    ageRange: '18-65岁',
  },
];
