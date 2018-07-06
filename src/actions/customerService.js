import { createAction } from 'redux-actions'

import { fetchCustomerServiceList } from '@/utils/api'

export const fetchListAction = () => (dispatch) => {
  // console.log(createAction('change user account list')({
  //   list: []
  // }), 'action')
  fetchCustomerServiceList().then((res) => {
    console.log(res)
  })
  // dispatch(createAction('change user account list')({
  //   list: []
  // }))
}
