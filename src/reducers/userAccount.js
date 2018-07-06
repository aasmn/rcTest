import { handleActions } from 'redux-actions'
export default handleActions({
  'change user account list': (state, { payload }) => {
    return {
      ...state,
      list: payload.list
    }
  }
}, {
  list: []
})
