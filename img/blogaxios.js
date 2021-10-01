import axios2 from 'axios'
import Cookies from 'js-cookie'
import Vue from "vue"

// 创建axios实例
const axios = axios2.create({
  // baseURL:"http://192.168.0.144:8000",
  // baseURL:"http://192.168.0.144:8040",
  // baseURL:"",

  timeout: 30000, // 请求超时时间
  withCredentials:true
})

// request拦截器
axios.interceptors.request.use(config => {
  const language = 'zh-CN'

  config.headers['Accept-Language'] = `${language}`

  if (Cookies.get('csrftoken') !== undefined) {
    config.headers['X-CSRFToken'] = Cookies.get('csrftoken')
  }
  // config.headers['X-CSRFToken']="76A3xG9pCM7avwr7dKhrxQPQp5dyBU6QQSSHRfd2A1JnSlpunuegedN5JD2F3NU0"
  return config
}, error => {
  // Do something with request error
  Promise.reject(error)
})

axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  if (response.data.code === 0) {
    return response.data;
  } else {
    Vue.prototype.$message({
      type:"error",
      message:response.data.message,
      showClose: true,
      duration: 30000
    })
    return Promise.reject(response.data)
  }
}, function (error) {
  if(error.response.status==403){
    Vue.prototype.$message({
       type:"warning",
       message:"请登录后再操作!"
    })
  }
  // 对响应错误做点什么
  return Promise.reject(error);
});



export default axios
