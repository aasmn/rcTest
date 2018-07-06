import React from 'react'
import classNames from 'classnames'
import styles from '@/stylus/modifydata'
import stores from '@/stores'
import { updateOrderItem } from '@/actions/dataedit'
const { dispatch } = stores
class ContractType extends React.Component {
  constructor () {
    super()
    const { contractInfo, mainItemList, orderItem } = stores.getState().dataedit
    this.state = {
      contractInfo,
      mainItemList,
      orderItem
    }
    this.unsubscribe = stores.subscribe(() => {
      console.log('change')
      const state = stores.getState()
      const { contractInfo, mainItemList, orderItem } = state.dataedit
      this.setState({
        contractInfo
      })
    })
  }
  componentWillUnmount () {
    this.unsubscribe()
  }
  add (index) {
    const { contractInfo, mainItemList, orderItem } = this.state
    const MainItemId = index === 2 ? 4 : index + 1
    if (contractInfo[index].length > 0) {
      return
    }
    const CrmOrderItems = []
    contractInfo[index].push({
      MainItemId
    })
    contractInfo.map((item) => {
      item.map((item2) => {
        CrmOrderItems.push(item2)
      })
    })
    const payload = orderItem
    payload.CrmOrderItems = CrmOrderItems
    dispatch(updateOrderItem(payload))
    if (this.props.cb) {
      this.props.cb()
    }
  }
  render () {
    const contractInfo = this.state.contractInfo
    const type = ['记账保税', '增值', '代收']
    return (
      <div className={styles['contract-type']}>
        {
          type.map((item, index) => {
            return (
              <div
                key={`contract-type-${index}`}
                className={classNames({[styles.active]: !contractInfo[index].length})}
                onClick={this.add.bind(this, index)}
              >
                {item}
              </div>
            )
          })
        }
      </div>
    )
  }
}
export default ContractType
