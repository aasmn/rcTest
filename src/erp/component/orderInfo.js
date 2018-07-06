import React, { Component } from 'react'

class Main extends Component {
  render () {
    const data = this.props.data;
    if (!data) return null;
    const style = { marginLeft: '70px' }
    return (
      <div style={{ padding: '10px 0' }}>
        <span>订单号：</span>{data.OrderNo}
        <span style={style}>联系人：</span>{data.Connector}
        <span style={style}>联系电话：</span>{data.Mobile}
        <span style={style}>签单销售：</span>{data.OrderSalesName}
        <span style={style}>签订日期：</span>{data.ContractDate}
        <span style={style}>操作人：</span>{data.HandlerName}
      </div>
    )
  }
}

export default Main
