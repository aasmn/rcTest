import { createAction } from 'redux-actions'
import { fetchGetmainitemList, fetchDataEditOrderList } from '@/utils/api'

export const updateGetmainitemList = () => (dispatch) => {
  fetchGetmainitemList().then((res) => {
    if (res.status) {
      console.log(res, 'fetchGetmainitemList')
      dispatch(createAction('update data edit getmainitem list')(res.data))
    }
  })
}

export const updateOrderItem = (payload) => (dispatch) => {
  dispatch(createAction('update data edit order item')(payload))
}

export const updateOrderList = (id) => (dispatch) => {
  fetchDataEditOrderList(id).then((res) => {
    if (res.status) {
      let payload = []
      try {
        payload = res.data.Orders
      } catch (e) {
        console.log(e)
      }
      dispatch(createAction('update data edit order list')(payload))
    }
  })
}
