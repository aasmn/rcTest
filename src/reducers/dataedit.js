import { handleActions } from 'redux-actions'
export default handleActions({
  'update data edit getmainitem list': (state, { payload }) => {
    return {
      ...state,
      mainItemList: payload
    }
  },
  'update data edit order item': (state, { payload }) => {
    const { CrmOrderItems } = payload
    const contractInfo = [[], [], []]
    CrmOrderItems.map((item) => {
      if (item && item.MainItemId) {
        const id = item.MainItemId
        if (id === 1) {
          contractInfo[0].push(item)
        } else if ([2, 3].indexOf(id) > -1) {
          contractInfo[1].push(item)
        } else if (id === 4) {
          contractInfo[2].push(item)
        }
      }
    })
    return {
      ...state,
      orderItem: payload,
      contractInfo: contractInfo
    }
  },
  'update data edit order list': (state, { payload }) => {
    return {
      ...state,
      orderList: payload
    }
  }
}, {
  contractInfo: [],
  mainItemList: [],
  orderItem: {},
  orderList: []
})
