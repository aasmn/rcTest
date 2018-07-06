import React, { Component } from 'react'
import {Input} from 'antd'

class Main extends Component{
  render (){
    const data = this.props.data
    return (
    <div className = "card">
      <div className = "card-head">
        {data.yearMonth}
        <span className = "card-head-pin" onClick={this.props.onDownload}>下载</span>
      </div>
      <div className="card-content">
        <ul className="ftlist">
          <li><span>客户总计</span><span>{data.totalCustomer}</span></li>
          <li><span>退款客户</span><span>{data.totalRefundCustomer}</span></li>
          <li><span>分摊合计</span><span>{data.totalAmount}</span></li>
          <li><span>退款合计</span><span>{data.totalRefundAmount}</span></li>
        </ul>
      </div>
    </div>)
  }
}
export default Main
