import { createAction } from 'redux-actions'

import { fetchUsersAccount } from '@/utils/api'

export const fetchListAction = () => (dispatch) => {
  // console.log(createAction('change user account list')({
  //   list: []
  // }), 'action')
  fetchUsersAccount().then((res) => {
    console.log(res)
  })
  // dispatch(createAction('change user account list')({
  //   list: []
  // }))
}
