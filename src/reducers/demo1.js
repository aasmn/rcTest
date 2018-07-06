import { handleActions } from 'redux-actions'

export default handleActions({
  'USER_FETCH_SUCCEEDED': (state, { user }) => {
    console.log(user)
    return {
      ...state,
      userInfo: user.result
    }
  }
}, {
  userInfo: {}
})
