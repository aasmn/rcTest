import { handleActions } from 'redux-actions'
import _ from 'lodash'
export default handleActions({
  'ly amount data change': (state, { data }) => {

    let ContractList = [].concat(state.ContractList)
    const { row, amount } = data;

    let nrow = ContractList.find(t => t.ContractId == row.ContractId)
    if (nrow) {
      nrow.ApplyAmount = amount
    }
    const total = _.reduce(ContractList, (r, t) => {
      r = r + (+t.ApplyAmount);
      return r
    }, 0)
    return {
      ...state,
      PayAccountInfo: { ...state.PayAccountInfo, ReceiveAmount: total },
      ContractList: ContractList
    }
  },
  'set lydata': (state, { data }) => {
    return {
      ...state,
      ...data
    }
  },
  'reset lydata': (state) => {
    return {
      ...state,
      BillInfo: {},
      ContractList: [],
      LYUser: [],
      PayAccountInfo: {}
    }
  },
  'change remarks': (state, { data }) => {
    return {
      ...state,
      BillInfo: { ...state.BillInfo, Remark: data }
    }
  },
  'set lingyongren list': (state, { data }) => {
    return {
      ...state,
      LYUser: data
    }
  },
  'change lyr data': (state, { data }) => {
    return {
      ...state,
      PayAccountInfo: { ...state.PayAccountInfo, ...(data || { "BankOrg": "", "Account": "", "OpenPerson": "" }) }
    }
  }
}, {
    BillInfo: {},
    ContractList: [],
    LYUser: [],
    PayAccountInfo: {}
  })
