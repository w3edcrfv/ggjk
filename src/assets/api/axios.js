import axios from 'axios'
import qs from 'qs'

let _axios = axios.create({
  // baseURL: '/api',
  withCredentials: true,
  timeout: 10000,
  paramsSerializer: function (params) {
    //params.subdirectory = localStorage.getItem('directory')
    return qs.stringify(params)
  }
})

// 请求拦截器
_axios.interceptors.request.use(config => {
  config.headers.Accept = 'application/json'
  config.headers['Plat-From'] = 'jxs_pc'
  if (config.data && config.data.dataType === 'json') {
    config.headers['Content-Type'] = 'application/json'
    delete config.data.dataType
    config.data = JSON.stringify(config.data)
  } else {
    config.data = qs.stringify(config.data)
  }
  return config
}, error => {
  return Promise.reject(error)
})
// 响应拦截器
_axios.interceptors.response.use(res => {

  //处理非JSON数据
  if (!res.data.hasOwnProperty('status')) {
    // if (res.headers['filename'] !== '') {
    //   res.data.fileName = res.headers['filename']
    // }
    return Promise.resolve(res);
  }

  // 尚未登录
  if (res.data.error_code === 100004) {

  }

  //正常请求
  if (res.data.status === 1) {
    return Promise.resolve(res.data)
  }

  //正常报错
  res.message = res.msg ? res.msg : ''; //与本地报错保持一致含message字段
  return Promise.reject(res.data);

}, err => {
  return Promise.reject(err.data);
})

export default _axios
