export interface UserPermissions {
  design_stage: boolean;
  construction_stage: boolean;
  cabinet_stage: boolean;
  soft_furnishing_stage: boolean;
  acceptance_stage: boolean;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'employee';
  permissions: UserPermissions;
}

export const users: User[] = [
  {
    id: 1,
    name: '管理员',
    email: 'admin@company.com',
    role: 'admin',
    permissions: {
      design_stage: true,
      construction_stage: true,
      cabinet_stage: true,
      soft_furnishing_stage: true,
      acceptance_stage: true,
    },
  },
  {
    id: 2,
    name: '王经理',
    email: 'wang@company.com',
    role: 'employee',
    permissions: {
      design_stage: true,
      construction_stage: true,
      cabinet_stage: false,
      soft_furnishing_stage: false,
      acceptance_stage: false,
    },
  },
  {
    id: 3,
    name: '李设计师',
    email: 'li@company.com',
    role: 'employee',
    permissions: {
      design_stage: true,
      construction_stage: false,
      cabinet_stage: true,
      soft_furnishing_stage: false,
      acceptance_stage: false,
    },
  },
  {
    id: 4,
    name: '张工程师',
    email: 'zhang@company.com',
    role: 'employee',
    permissions: {
      design_stage: false,
      construction_stage: true,
      cabinet_stage: true,
      soft_furnishing_stage: true,
      acceptance_stage: true,
    },
  },
];

// 当前登录用户（模拟）
export let currentUser: User = users[0];

// 切换当前用户（用于测试）
export const setCurrentUser = (userId: number) => {
  const user = users.find(u => u.id === userId);
  if (user) {
    currentUser = user;
    // 保存到 localStorage
    localStorage.setItem('currentUserId', userId.toString());
  }
};

// 从 localStorage 恢复当前用户
const savedUserId = localStorage.getItem('currentUserId');
if (savedUserId) {
  const userId = parseInt(savedUserId, 10);
  const user = users.find(u => u.id === userId);
  if (user) {
    currentUser = user;
  }
}

// 获取当前用户
export const getCurrentUser = () => currentUser;

// 检查当前用户是否有某个阶段的权限
export const hasPermission = (stage: keyof UserPermissions): boolean => {
  if (currentUser.role === 'admin') return true;
  return currentUser.permissions[stage];
};
