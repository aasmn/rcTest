import { requestLogin, getListData, postData, deleteData } from '@/erp/api'

export const login = (payload) => (dispatch) => {
    dispatch({ type: 'LOADING', data: true })
    requestLogin(payload).then(loginRes => {
        if (loginRes.status) {

            loginRes.data.IsChannel = !!payload.usertype;

            window.sessionStorage.setItem('token', loginRes.data.Token)
            getListData('mycity').then(res=>{
                if(res.status){
                    loginRes.data.CityCode = res.data.Code;
                    loginRes.data.CityName = res.data.Name;
                    if(loginRes.data.IsChannel){
                      const str = ',{"FunctionId":8,"ParentId":0,"FunctionName":"用户管理","FunctionKey":"","FunctionLevel":1,"FunctionCenter":0,"Rank":99,"Icon":"fa fa-id-card","Status":1,"Descr":"描述","CreateBy":1,"CreateDate":"2017-10-10T09:14:22.000Z","ModifyBy":1,"ModifyDate":"2018-06-28T09:00:59.000Z","TreeIds":null,"UAA":null,"Children":[{"FunctionId":30,"ParentId":8,"FunctionName":"员工管理(渠道）","FunctionKey":"main.qd_user","FunctionLevel":2,"FunctionCenter":0,"Rank":1,"Icon":"","Status":1,"Descr":"描述","CreateBy":1,"CreateDate":"2017-10-10T09:28:05.000Z","ModifyBy":1,"ModifyDate":"2017-10-12T02:36:52.000Z","TreeIds":null,"UAA":null,"Children":[]},{"FunctionId":31,"ParentId":8,"FunctionName":"部门管理(渠道)","FunctionKey":"main.qd_departments","FunctionLevel":2,"FunctionCenter":0,"Rank":3,"Icon":"","Status":1,"Descr":"描述","CreateBy":1,"CreateDate":"2017-10-10T09:28:14.000Z","ModifyBy":1,"ModifyDate":"2017-10-12T03:44:19.000Z","TreeIds":null,"UAA":null,"Children":[]}]}'
                      loginRes.data.FunctionList = loginRes.data.FunctionList.substr(0,loginRes.data.FunctionList.length-1) + str + ']'
                    }
                    window.sessionStorage.setItem('user', JSON.stringify(loginRes.data))
                    dispatch({ type: 'LOGIN_USER', data: loginRes.data })
                }
            })
        } else {
            dispatch({ type: 'LOADING', data: false })
        }
    })
}

export function getAllDepartments(payload) {
    return (dispatch,getState) => {
        getListData('departmentscenter').then(res => {
            if (res.status) {
                dispatch({ type: 'DEPARTMENTS', data: res.data.list })
            }
        })
    }
}

export function getAllRoles(payload,getState) {
    return (dispatch, getState) => {
        getListData('roles').then(res => {
            if (res.status) {
                dispatch({ type: 'ROLES', data: res.data.list })
            }
        })
    }
}
export function getAllSalers(force,getState) {
    return (dispatch, getState) => {
        const state = getState();
        if(state.common.salers && !force){
            return null;
        }
        getListData('order/sales').then(res => {
            if (res.status) {
                dispatch({ type: 'SALERS', data: res.data })
            }
        })
    }
}
export function getOutworkers(force,getState) {
    return (dispatch, getState) => {
        const state = getState();
        if(state.common.outworkers && !force){
            return null;
        }
        getListData('outworkers').then(res => {
            if (res.status) {
                dispatch({ type: 'get outworkers', data: res.data.list })
            }
        })
    }
}

export function getAreas(force,getState) {
    return (dispatch, getState) => {
        const state = getState();
        if(state.common.areas && !force){
            return null;
        }
        getListData('code/area').then(res => {
            if (res.status) {
                console.log(res.data )
                dispatch({ type: 'AREAS', data: res.data })
            }
        })
    }
}

export function getChannel(force,getState) {
    return (dispatch, getState) => {
        const state = getState();
        if(state.common.channels && !force){
            return null;
        }
        getListData('agent/dict').then(res => {
            if (res.status) {
                console.log(res.data )
                dispatch({ type: 'CHANNELS', data: res.data })
            }
        })
    }
}

export function getCustomerType(force,getState) {
    return (dispatch, getState) => {
        const state = getState();
        if(state.common.customerTypes && !force){
            return null;
        }
        getListData('cuscategory').then(res => {
            if (res.status) {
                dispatch({ type: 'CUSTOMER_TYPE', data: res.data })
            }
        })
    }
}

export function getTags(force,getState) {
    return (dispatch, getState) => {
        const state = getState();
        if(state.common.tags && !force){
            return null;
        }
        getListData('tag').then(res => {
            if (res.status) {
                dispatch({ type: 'CUSTOMER_TAGS', data: res.data })
            }
        })
    }
}
export function getCustomerSource(force,getState) {
    return (dispatch, getState) => {
        const state = getState();
        if(state.common.customerSource && !force){
            return null;
        }
        getListData('customersource').then(res => {
            if (res.status) {
                dispatch({ type: 'CUSTOMER_SOURCE', data: res.data })
            }
        })
        dispatch({ type: 'CUSTOMER_SOURCE', data: [] })
    }
}
export function getDeparment(force,getState) {
    return (dispatch, getState) => {
        const state = getState();
        if(state.common.deparments && !force){
            return null;
        }
        getListData('departments').then(res => {
            if (res.status) {
                dispatch({ type: 'DEPARMENT', data: res.data })
            }
        })
        dispatch({ type: 'DEPARMENT', data: [] })
    }
}
export function getMainTask(force,getState) {
    return (dispatch, getState) => {
        const state = getState();
        if(state.common.main_tasks && !force){
            return null;
        }
        getListData('commontask').then(res => {
            if (res.status) {
                dispatch({ type: 'get main task list', data: res.data })
            }
        })
        // dispatch({ type: 'get main task list', data: [] })
    }
}
export function getSubTask(force,getState) {
    return (dispatch, getState) => {
        const state = getState();
        if(state.common.sub_task && !force){
            return null;
        }
        getListData('outertasksub', {offset:0,limit:9999}).then(res => {
            if (res.status) {
                dispatch({ type: 'get sub task list', data: res.data.list })
            }
        })
    }
}


export function setPowerList(payload) {
    return (dispatch) => {
        dispatch({ type: 'CURRENT_POWERLIST', data: payload })
    }
}

export const getGroups = (force) => (dispatch, getState) => {
    dispatch({ type: 'LOADING', data: true })
    const state = getState();
    if(state.common.groups && !force){
        return null;
    }
    getListData('departments').then(res => {
        dispatch({ type: 'LOADING', data: false })
        if(res.status){
            dispatch({ type: 'get groups', data: res.data})
        }
    })
}

export const deleteGroup = (payload) => (dispatch, state) =>{
    dispatch({ type: 'LOADING', data: true })
    deleteData('departments/' + payload).then(res => {
        dispatch(getGroups(true))
    })
}

export const addGroup = (payload) => (dispatch, state) =>{
    dispatch({ type: 'LOADING', data: true })
    postData('departments', payload).then(res => {
        dispatch(getGroups(true))
    })
}
export function getBelongCompany(force,getState) {
    return (dispatch, getState) => {
        const state = getState();
        if(state.common.belongCompany && !force){
            return null;
        }
        getListData('subsidiary').then(res => {
            if (res.status) {
                dispatch({ type: 'BELONG_COMPANY', data: res.data.list })
            }
        })
        dispatch({ type: 'BELONG_COMPANY', data: null })
      }
  }
export function getSignkey(force,getState) {
    return (dispatch, getState) => {
        const state = getState();
        if(state.common.signkey){
            return state.common.signkey;
        }
        return getListData('signkey').then(res => {
            if (res.status) {
                delete res.data.Filename;
                delete res.data.key;
                delete res.data.callback;
                delete res.data.expire;
                delete res.data.Host;
                dispatch({ type: 'get signkey', data: res.data })
                setTimeout(()=>{
                    dispatch({ type: 'remove signkey', data: null})
                }, 10 * 60 * 1000)
            }
        })
    }
}

export function getMainItemList(payload, getState){
    return (dispatch, getState) => {
        const state = getState();
        if(state.common.contractItems){
            return state.common.contractItems;
        }
        dispatch({ type: 'getMainItemList', data: [] })
        return getListData('order/getmainitemlist').then(res => {
            if (res.status) {
                dispatch({ type: 'getMainItemList', data: res.data })
            }
        })
    }
}
export const getTaskConfigList = () => (dispatch) => {
  getListData('commontask').then(res => {
      if (res.status) {
        dispatch({
          type: 'change outworker task config list',
          data: res.data
        })
      }
  })
}
export function logout(payload, getState){
    return (dispatch, getState) => {
        getListData('security/logout').then(res=>{
            dispatch({ type: 'LOGOUT', data: null })
        });

    }
}
export function getZZReason(payload,getState){
  return (dispatch, getState) => {
    const state = getState();
    if(state.common.zzreason){
        return null;
    }
    getListData('orders/reasons/1').then(res => {
        if (res.status) {
            dispatch({ type: 'get zzreasons', data: res.data })
        }
    })
  }
}
export function getZFReason(payload,getState){
  return (dispatch, getState) => {
    const state = getState();
    if(state.common.zfreason){
        return null;
    }
    getListData('orders/reasons/2').then(res => {
        if (res.status) {
            dispatch({ type: 'get zfreasons', data: res.data })
        }
    })
  }
}

export function lyAmountChange(row, value){
  return (dispatch, getState) => {
    dispatch({
      type: 'ly amount data change',
      data: {
        row: row,
        amount: value
      }
    })
  }
}