import { createAction } from 'redux-actions'
import { fetchWechatUserInfo } from '@/utils/api'
// 获取用户信息
export const fetcUserInfoAction = (cb) => (dispatch) => {
  let userInfo = ''
  let nickname
  try {
    userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    nickname = userInfo && userInfo.nickname
  } catch (e) {
    console.log(e)
  }
  dispatch(createAction('update common user info')(nickname))
  if (cb) {
    cb(nickname)
  }
}

export const changeLoginStat = (stat) => (dispatch) => {
  dispatch(createAction('change login status')(stat))
}
