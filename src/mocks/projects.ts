// 定义文件类型
export interface ProjectFile {
  name: string;
  url: string;
  type: 'file' | 'url';
}

// 定义项目类型
export interface Project {
  id: number;
  client_name: string;
  project_address: string;
  consultant: string;
  designer: string;
  deposit_date: string;
  design_requirement_output: string;
  design_requirement_files: ProjectFile[];
  detailed_plan_output: string;
  detailed_plan_files: ProjectFile[];
  confirmation_date: string;
  construction_schedule_output: string;
  construction_schedule_files?: ProjectFile[];
  current_construction_progress: string;
  construction_completion_date: string;
  cabinet_drawing_sign: string;
  cabinet_drawing_files?: ProjectFile[];
  cabinet_order_date: string;
  cabinet_expected_arrival: string;
  cabinet_actual_arrival: string;
  furniture_light_curtain_order_date: string;
  furniture_arrival_date: string;
  lighting_install_date: string;
  curtain_install_date: string;
  acceptance_expected_date: string;
  acceptance_actual_date: string;
  notes: string;
}

export const projects: Project[] = [
  {
    id: 1,
    client_name: '张先生',
    project_address: '上海市浦东新区世纪大道1000号',
    consultant: '王经理',
    designer: '李设计师',
    deposit_date: '2024-01-15',
    design_requirement_output: '已完成',
    design_requirement_files: [
      { name: '设计需求记录表_v1.pdf', url: '#', type: 'file' as const },
      { name: 'https://example.com/design-requirements', url: 'https://example.com/design-requirements', type: 'url' as const }
    ],
    detailed_plan_output: '已完成',
    detailed_plan_files: [
      { name: '细化方案_最终版.pdf', url: '#', type: 'file' as const }
    ],
    confirmation_date: '2024-02-10',
    construction_schedule_output: '已完成',
    current_construction_progress: '85%',
    construction_completion_date: '2024-12-20',
    cabinet_drawing_sign: '2024-03-05',
    cabinet_order_date: '2024-03-10',
    cabinet_expected_arrival: '2024-11-15',
    cabinet_actual_arrival: '2024-11-18',
    furniture_light_curtain_order_date: '2024-10-20',
    furniture_arrival_date: '2024-12-01',
    lighting_install_date: '2024-12-05',
    curtain_install_date: '2024-12-08',
    acceptance_expected_date: '2024-12-25',
    acceptance_actual_date: '待定',
    notes: '客户对整体设计方案非常满意，特别强调厨房和主卧需要重点关注。定制柜体需要采用环保材料，灯光设计要求温馨舒适。'
  },
  {
    id: 2,
    client_name: '陈女士',
    project_address: '北京市朝阳区建外SOHO 3号楼',
    consultant: '赵经理',
    designer: '刘设计师',
    deposit_date: '2024-02-20',
    design_requirement_output: '已完成',
    design_requirement_files: [
      { name: '设计需求文档.docx', url: '#', type: 'file' as const }
    ],
    detailed_plan_output: '已完成',
    detailed_plan_files: [
      { name: '方案图纸.pdf', url: '#', type: 'file' as const }
    ],
    confirmation_date: '2024-03-15',
    construction_schedule_output: '已完成',
    current_construction_progress: '已完成',
    construction_completion_date: '2024-10-30',
    cabinet_drawing_sign: '2024-03-25',
    cabinet_order_date: '2024-04-01',
    cabinet_expected_arrival: '2024-09-20',
    cabinet_actual_arrival: '2024-09-22',
    furniture_light_curtain_order_date: '2024-09-01',
    furniture_arrival_date: '2024-10-10',
    lighting_install_date: '2024-10-15',
    curtain_install_date: '2024-10-18',
    acceptance_expected_date: '2024-11-05',
    acceptance_actual_date: '2024-11-03',
    notes: '项目已顺利完成，客户对最终效果非常认可。现代简约风格，注重收纳空间的设计。'
  },
  {
    id: 3,
    client_name: '李总',
    project_address: '深圳市南山区科技园南区深圳湾1号',
    consultant: '孙经理',
    designer: '周设计师',
    deposit_date: '2024-03-10',
    design_requirement_output: '已完成',
    design_requirement_files: [
      { name: '别墅设计需求.pdf', url: '#', type: 'file' as const }
    ],
    detailed_plan_output: '已完成',
    detailed_plan_files: [
      { name: '别墅细化方案.pdf', url: '#', type: 'file' as const }
    ],
    confirmation_date: '2024-04-05',
    construction_schedule_output: '已完成',
    current_construction_progress: '60%',
    construction_completion_date: '2025-02-15',
    cabinet_drawing_sign: '2024-04-20',
    cabinet_order_date: '2024-04-25',
    cabinet_expected_arrival: '2025-01-10',
    cabinet_actual_arrival: '待定',
    furniture_light_curtain_order_date: '2024-12-15',
    furniture_arrival_date: '待定',
    lighting_install_date: '待定',
    curtain_install_date: '待定',
    acceptance_expected_date: '2025-02-28',
    acceptance_actual_date: '待定',
    notes: '别墅项目，面积较大，工期相对较长。客户要求高端定制，注重细节和品质。智能家居系统需全面集成。'
  },
  {
    id: 4,
    client_name: '王女士',
    project_address: '杭州市西湖区文一西路西溪湿地公园旁',
    consultant: '吴经理',
    designer: '郑设计师',
    deposit_date: '2024-04-01',
    design_requirement_output: '已完成',
    design_requirement_files: [],
    detailed_plan_output: '进行中',
    detailed_plan_files: [],
    confirmation_date: '待定',
    construction_schedule_output: '待输出',
    current_construction_progress: '未开始',
    construction_completion_date: '2025-03-30',
    cabinet_drawing_sign: '待定',
    cabinet_order_date: '待定',
    cabinet_expected_arrival: '2025-02-20',
    cabinet_actual_arrival: '待定',
    furniture_light_curtain_order_date: '待定',
    furniture_arrival_date: '待定',
    lighting_install_date: '待定',
    curtain_install_date: '待定',
    acceptance_expected_date: '2025-04-15',
    acceptance_actual_date: '待定',
    notes: '新中式风格，客户希望融入传统文化元素。目前正在优化设计方案，等待客户最终确认。'
  },
  {
    id: 5,
    client_name: '赵先生',
    project_address: '广州市天河区珠江新城花城大道',
    consultant: '钱经理',
    designer: '冯设计师',
    deposit_date: '2024-05-10',
    design_requirement_output: '已完成',
    design_requirement_files: [
      { name: '设计需求表.xlsx', url: '#', type: 'file' as const }
    ],
    detailed_plan_output: '已完成',
    detailed_plan_files: [
      { name: '轻奢风格方案.pdf', url: '#', type: 'file' as const }
    ],
    confirmation_date: '2024-06-15',
    construction_schedule_output: '已完成',
    current_construction_progress: '95%',
    construction_completion_date: '2024-12-10',
    cabinet_drawing_sign: '2024-06-25',
    cabinet_order_date: '2024-07-01',
    cabinet_expected_arrival: '2024-11-01',
    cabinet_actual_arrival: '2024-11-03',
    furniture_light_curtain_order_date: '2024-10-15',
    furniture_arrival_date: '2024-11-20',
    lighting_install_date: '2024-11-25',
    curtain_install_date: '2024-11-28',
    acceptance_expected_date: '2024-12-20',
    acceptance_actual_date: '待定',
    notes: '轻奢风格设计，项目进度顺利，即将进入验收阶段。客户对施工质量表示满意，期待最终效果。'
  }
];
