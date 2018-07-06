import http from './http'
import config from '@/config.json'

function param (obj) {
  if (!obj) return ''
  return Object.keys(obj).map(key => {
    if (!key) return ''
    return [key, obj[key]].join('=')
  }).join('&')
}
// demo
export const fetchWechatUserInfo = () => {
  return http('/api/security/login')
}
// login
export const requestLogin = (params) => {
  return http('/api/login', 'post', params)
}
// logout
export const logout = () => {
  const url = `${config.UAA_SERVER_URL}/ua/logout`
  return http(url, 'get', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + sessionStorage.getItem('token')
    },
    extension: {
      xhrFields: {
        withCredentials: true
      }
    }
  })
}
// customer-service
export const fetchCustomerServiceList = (payload) => {
  return http('/api/customers/pagelist', payload)
}
export const fetchCustomerServiceDetail = (id, payload) => {
  return http('api/customers/' + id, payload)
}
export const fetchCustomerServiceOrderDetail = (id, payload) => {
  return http('api/customers/' + id + '/orders', payload)
}
// 客服外呼
export const fetchCustomerVisitList = (payload) => {
  return http('/api/revisit/getlist', payload)
}
export const exportCustomerVisitList = (payload) => {
  return http('/api/revisit/exportlist', payload)
}
export const fetchReturnVisitList = (payload) => {
  return http('/api/returnvisit', payload)
}
export const postReturnVisit = (payload) => {
  return http('/api/returnvisit', 'POST', payload)
}
export const putReturnVisit = (id, payload) => {
  return http('/api/returnvisit/' + id, 'PUT', payload)
}
export const fetchReturnVisitDetail = (id) => {
  return http('/api/returnvisit/' + id)
}
export const fetchVisitSelectCode = (payload) => {
  return http('/api/getcode', payload)
}
export const fetchOrderDetail = (id, payload) => {
  return http('api/customers/orders/' + id, payload)
}
export const fetchCustomerServiceOutworkDetail = (id, payload) => {
  return http('/api/customers/' + id + '/maintasks', payload)
}
export const fetchOutworkDetail = (id, payload) => {
  return http('/api/customers/' + id + '/outertasksub', payload)
}
export const fetchAgentDetail = (id) => {
  return http('api/customers/' + id + '/accountant')
}
// getAllDepartments
export const getAllDepartments = () => {
  return http('/api/departmentscenter')
}
export const fetchUsersAccount = (payload) => {
  return http('/api/users', payload)
}
// 数据管理
// 记账服务头部
export const fetchAgentServiceData = (id) => {
  return http('/api/tally/getheadinfo/' + id)
}
// 记账服务列表
export const fetchAgentServiceList = (id) => {
  return http('/api/tally/' + id)
}
// 操作记录
export const fetchOperateList = (id) => {
  return http('/api/orders/rz/' + id)
}
// 签单销售
export const fetchSalesList = (id) => {
  return http('/api/orders/sales/' + id)
}

export const fetchGetmainitemList = () => {
  return http('/api/orders/getmainitemlist')
}

export const fetchDataEditOrderList = (id) => {
  return http(`/api/orders/detailswithcontract/${id}`)
}

// 数据修改
export const saveDataEditOrderList = (payload) => {
  return http('/api/orders/detailswithcontract/save', 'POST', payload)
}

// 上传签名
export const getSignkey = () => {
  return http('/api/signkey')
}

// 用戶
// 部門
export const getDepartments = () => {
  return http('/api/sysinfo/getorgs')
}
// 添加部门
export const addDepartment = (data) => {
  return http('/api/sysinfo/addorg', 'post', data)
}
// 修改部门
export const modifyDepartment = (data) => {
  return http('/api/sysinfo/updateorgs/' + data.id, 'put', data)
  // return http('/api/sysinfo/updateorgs', 'put', data)
}
// 删除部门
export const deleteDepartment = (id) => {
  return http('/api/sysinfo/delOrgs/' + id, 'delete')
}

// 资源
export const resourceApi = {
  get: (id) => { // 列表 ？ 详情
    return http('api/resources?id=' + (id || ''))
  },
  post: (data) => {
    return http('api/resources', 'post', data)
  },
  put: (data) => {
    return http('api/resources/' + data.id, 'put', data)
  },
  delete: (id) => {
    return http('api/resources/' + id, 'delete')
  }
}
// 策略
export const strageApi = {
  get: (params) => {
    return http('api/policies?' + param(params))
  },
  post: (params) => {
    return http('api/policies', 'post', params)
  },
  update: (id, status) => {
    return http(`api/policies/${id}/${status}`, 'put')
  },
  getallchannelArea: () => {
    return http('api/channelarea')
  },
  getallchannel: () => {
    return http('api/agent/tree/list')
  }
}
// 用户
export const userApi = {
  get: (user) => {
    return http('api/sysinfo/getSysUser', user)
  },
  post: (data) => {
    return http('api/sysinfo/addUserRole', 'post', data)
  },
  put: (data) => {
    return http('/api/sysinfo/updateUser', 'put', data)
  },
  delete: (mobile) => {
    return http('/api/sysinfo/delUserOfSys/' + mobile, 'delete')
  },
  setpower: (mobile, data) => {
    return http('api/sysinfo/addUserSysInfo/' + mobile, 'post', data)
  },
  getUaaUser: (mobile) => {
    return http('/api/sysinfo/getUaaUser/' + mobile)
  }
}
// 角色
export const userRolesApi = {
  get: (payload) => { // 列表
    return http('api/sysinfo/getRole?' + param(payload))
  },
  post: (data) => {
    return http('api/sysinfo/addRole', 'post', data)
  },
  put: (data) => {
    return http('/api/sysinfo/updateRole/' + data.id, 'put', data)
  },
  delete: (id) => {
    return http('api/sysinfo/delRole/' + id, 'delete')
  }
}
export const getScope = () => {
  return http('api/scopes')
}
// 渠道管理
export const channelApi = {
  user: {
    get: (params) => {
      return http('api/sysinfo/getSysUser', params)
    },
    post: (data) => {
      console.log('post')
      return new Promise((resolve) => {
        resolve({status: true})
      })
    },
    put: (data) => {
      console.log('put')
      return new Promise((resolve) => {
        resolve({status: true})
      })
    },
    delete: (id) => {
      console.log('delete')
      return new Promise((resolve) => {
        resolve({status: true})
      })
    }
  }
}
// 直营管理
export const subsidiaryApi = {
  user: {
    get: (params) => {
      return http('api/sysinfo/getSysUser', params)
    },
    post: (data) => {
      console.log('post')
      return new Promise((resolve) => {
        resolve({status: true})
      })
    },
    put: (data) => {
      console.log('put')
      return new Promise((resolve) => {
        resolve({status: true})
      })
    },
    delete: (id) => {
      console.log('delete')
      return new Promise((resolve) => {
        resolve({status: true})
      })
    }
  }
}
// 机构核算中心
export const accountingCenterApi = {
  get: (payload) => {
    return http('api/accounting', payload)
  },
  post: (payload) => {
    return http('/api/accounting', 'POST', payload)
  },
  put: (id, payload) => {
    return http('/api/accounting/' + id, 'PUT', payload)
  },
  delete: (id) => {
    return http('/api/accounting/' + id, 'DELETE')
  },
  codeuse: () => {
    return http('api/accounting/codeuse')
  }
}
// 机构直营
export const directApi = {
  get: (payload) => {
    return http('api/direct', payload)
  },
  post: (payload) => {
    return http('/api/direct', 'POST', payload)
  },
  put: (payload) => {
    return http('/api/direct', 'PUT', payload)
  },
  delete: (id) => {
    return http('/api/forbidden/' + id, 'PUT')
  }
}
// 机构代理商
export const agentApi = {
  get: (payload) => {
    return http('api/agent', payload)
  },
  post: (payload) => {
    return http('/api/agent', 'POST', payload)
  },
  put: (id, payload) => {
    return http('/api/agent/' + id, 'PUT', payload)
  },
  changestatus: (id, status) => {
    return http(`/api/agent/${id}/${status}`, 'PUT')
  }
}
