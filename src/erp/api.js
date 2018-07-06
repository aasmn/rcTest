import axios from 'axios'
import { message } from 'antd';
import loading from './component/loading'

// instance.defaults.headers.common['Authorization'] = AUTH_TOKEN;
let ajaxCount = 0;
axios.interceptors.request.use(function(config) {
  if(window.sessionStorage.getItem('token')){
    config.headers.common['Authorize'] = window.sessionStorage.getItem('token')
  }
  ajaxCount ++ ;
  loading.create();
  return config
}, function(error) {
  return Promise.reject(error)
})
let isLogout = false;
axios.interceptors.response.use(function(response) {
  ajaxCount --;
  if (!response.data.status) {
    message.error(response.data.message);
  }
  if (ajaxCount == 0) loading.destroy();
  return response
}, function(error) {
  if (error.response && (error.response.status === 403 || error.response.status === 401)){
    if (isLogout) return;
    message.error('登录失效！');
    window.sessionStorage.clear();
    // window.location.href='#/login';
    setTimeout(()=>{
      isLogout = true;
      window.location.reload()
    },50)
    source.cancel('Token Invalid.');
  } else if(typeof error.response.data === "object"){
    message.error(error.response.data.message)
  }
  ajaxCount--;
  if (ajaxCount == 0) loading.destroy();
  return Promise.reject(error)
})

const CancelToken = axios.CancelToken;
const source = CancelToken.source();

function addCancelToken(params={}) {
  return {
    ...params,
    cancelToken: source.token
  }
}

const base = 'https://x-erp.i-counting.cn/api';
export const requestLogin = params => {
  isLogout = false;
  return axios.post(`${base}/security/login`, params ,addCancelToken()).then(res => res.data)
}

export const getSalers = params => {
  return axios.get(`${base}/contract/sales`, addCancelToken()).then(res => res.data)
}

export const getContractManageList = params => {
  return axios.get(`${base}/contract`, addCancelToken({ params: params })).then(res => res.data)
}

export const getListData = (url,params,headers) => {
  return axios.get(`${base}/${url}`, addCancelToken({params:params,headers:headers})).then(res => res.data)
}

export const fetchUserInfo  = params => {
  return axios.get(`${base}/users/${params}`, addCancelToken()).then(res => res.data)
}

export const postData = (url, params) => {
  return axios.post(`${base}/${url}`, params, addCancelToken()).then(res => res.data)
}

export const putData = (url, params) => {
  return axios.put(`${base}/${url}`, params, addCancelToken()).then(res => res.data)
}

export const deleteData = (url, params) => {
  return axios.delete(`${base}/${url}`, params, addCancelToken()).then(res => res.data)
}

export const getMockerData = (url, params) => {
  return axios.get(`mocker/${url}`, { params: params }).then(res => res.data)
}


