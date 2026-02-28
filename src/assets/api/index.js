import axios from './axios'
const directory = '/api'
export default {
  // 获取七牛token
  qiniuToken: (data) => axios.post(`${directory}/other/getQiniuToken`, {...data}),
  // 飞书授权进入首页
  feishuAuth: (data) => axios.post(`${directory}/feishu/auth`, {...data}),
  // 获取登录用户信息
  getLoginInfo: (data) => axios.post(`${directory}/feishu/getLoginInfo`, {...data}),
  // 获取部门列表
  getDepartmentList: (data) => axios.post(`${directory}/feishu/getDepartmentList`, {...data}),
  // 获取部门列表
  getUserList: (data) => axios.post(`${directory}/feishu/getUserList`, {...data}),
  // 添加项目管理人员
  addProjectUser: (data) => axios.post(`${directory}/feishu/addProjectUser`, {...data}),
  // 获取项目管理人员
  getProjectUser: (data) => axios.post(`${directory}/feishu/getProjectUser`, {...data}),
  // 配置项目管理人员权限
  setUserPower: (data) => axios.post(`${directory}/feishu/setUserPower`, {...data}),
  // 获取项目列表
  getProjectList: (data) => axios.post(`${directory}/feishu/getProjectList`, {...data}),
  // 获取项目详情
  getProjectDetail: (data) => axios.post(`${directory}/feishu/getProjectDetail`, {...data}),
  // 添加编辑项目
  editProject: (data) => axios.post(`${directory}/feishu/editProject`, {...data}),
  // 跟进项目
  followProject: (data) => axios.post(`${directory}/feishu/followProject`, {...data}),
  // 获取项目统计
  getProjectStatistics: (data) => axios.post(`${directory}/feishu/getProjectStatistics`, {...data}),
  // 发送飞书通知
  feishuNotice: (data) => axios.post(`${directory}/feishu/notice`, {...data}),
}