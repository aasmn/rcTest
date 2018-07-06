import { handleActions } from 'redux-actions'

export default handleActions({
  'set contract account modal status': (state, {status}) => {
    console.log(status)
    const newstatus = Object.assign({}, status, state.account)
    return {
      ...newstatus
    }
  }
}, {
  modal1: false,
  modal2: false
})
