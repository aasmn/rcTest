/**
 * Created by mochao on 2018/5/10.
 */
import { getSignkey } from '../utils/api'
export const getSignKey = (force, getState) => {
  return (dispatch, getState) => {
    const state = getState()
    if (state.common.signkey) {
      return state.common.signkey
    }
    return getSignkey().then(res => {
      if (res.status) {
        delete res.data.Filename
        delete res.data.key
        delete res.data.callback
        delete res.data.expire
        delete res.data.Host
        dispatch({ type: 'get signkey', data: res.data })
        setTimeout(() => {
          console.log('remove signkey')
          dispatch({type: 'remove signkey', data: null})
        }, 10 * 60 * 1000)
      }
    })
  }
}
