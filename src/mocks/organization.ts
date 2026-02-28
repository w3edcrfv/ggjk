// 组织架构数据
export interface Department {
  id: number;
  name: string;
  parent_id: number | null;
  children?: Department[];
}

export interface Employee {
  id: number;
  name: string;
  email: string;
  department_id: number;
  position: string;
  avatar?: string;
}

// 部门数据
export const departments: Department[] = [
  {
    id: 1,
    name: '公司总部',
    parent_id: null,
    children: [
      {
        id: 2,
        name: '设计部',
        parent_id: 1,
      },
      {
        id: 3,
        name: '工程部',
        parent_id: 1,
      },
      {
        id: 4,
        name: '采购部',
        parent_id: 1,
      },
      {
        id: 5,
        name: '客服部',
        parent_id: 1,
      },
    ],
  },
];

// 员工数据
export const employees: Employee[] = [
  {
    id: 1,
    name: '管理员',
    email: 'admin@company.com',
    department_id: 1,
    position: '总经理',
  },
  {
    id: 2,
    name: '王经理',
    email: 'wang@company.com',
    department_id: 2,
    position: '设计部经理',
  },
  {
    id: 3,
    name: '李设计师',
    email: 'li@company.com',
    department_id: 2,
    position: '高级设计师',
  },
  {
    id: 4,
    name: '张工程师',
    email: 'zhang@company.com',
    department_id: 3,
    position: '项目经理',
  },
  {
    id: 5,
    name: '刘工',
    email: 'liu@company.com',
    department_id: 3,
    position: '施工主管',
  },
  {
    id: 6,
    name: '陈采购',
    email: 'chen@company.com',
    department_id: 4,
    position: '采购专员',
  },
  {
    id: 7,
    name: '赵客服',
    email: 'zhao@company.com',
    department_id: 5,
    position: '客服专员',
  },
  {
    id: 8,
    name: '孙设计',
    email: 'sun@company.com',
    department_id: 2,
    position: '设计师',
  },
  {
    id: 9,
    name: '周工',
    email: 'zhou@company.com',
    department_id: 3,
    position: '工程师',
  },
  {
    id: 10,
    name: '吴采购',
    email: 'wu@company.com',
    department_id: 4,
    position: '采购主管',
  },
];

// 根据部门ID获取员工
export const getEmployeesByDepartment = (departmentId: number): Employee[] => {
  return employees.filter(emp => emp.department_id === departmentId);
};

// 获取所有部门（扁平化）
export const getAllDepartments = (): Department[] => {
  const result: Department[] = [];
  const flatten = (depts: Department[]) => {
    depts.forEach(dept => {
      result.push(dept);
      if (dept.children) {
        flatten(dept.children);
      }
    });
  };
  flatten(departments);
  return result;
};
