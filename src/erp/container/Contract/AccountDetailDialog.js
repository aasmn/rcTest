import React, { Component } from 'react'
import { Tabs, List, Spin, message } from 'antd'
import { getListData } from '@/erp/api'
import ViewCustomer from '@/erp/container/Contract/ViewCustomer'
import OrderAll from '@/erp/container/Contract/OrderAll'
import OutWork from '@/erp/container/Contract/OutWork'
import _ from 'lodash'
import ContractInfo from '@/erp/container/Contract/ContractInfo'
import CurrentOrderInfo from '@/erp/container/Contract/CurrentOrderInfo'

const TabPane = Tabs.TabPane;

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      companyInfo: null,
      orderInfo: null,
      activeKey: "1"
    }
    this.getCompanyInfo = this.getCompanyInfo.bind(this);
    this.onTabClick = this.onTabClick.bind(this);
    this.getCompanyInfo()
  }
  getCompanyInfo(){
    getListData('customerdetail/'+ this.props.row.CustomerId).then(res=>{
      res.data = _.extend(res.data, this.props.row);
      this.setState({
        companyInfo: res.data
      })
    })
    getListData('orders/'+ this.props.row.OrderId).then(res=>{
      res.data = _.extend(res.data, this.props.row);
      this.setState({
        orderInfo: res.data
      })
    })
  }
  onTabClick(arg){
    this.setState({activeKey:arg});
  }
  render() {
    return(
      <div style={this.props.style} className="company-dialog">
        {this.state.orderInfo? (<ContractInfo data={this.state.orderInfo}/>) : <Spin/>}
        <div>
          <Tabs type="card" style={{width: '100%'}} activeKey={this.state.activeKey} onTabClick={this.onTabClick}>
            <TabPane tab="公司信息" key="1">
              { this.state.companyInfo?(<ViewCustomer data={this.state.companyInfo}/>):<Spin/> }
              {this.state.orderInfo ? (<CurrentOrderInfo data={this.state.orderInfo} showAction={true}/>):<Spin/> }
            </TabPane>
            <TabPane tab="订单汇总信息" key="2">
              <OrderAll companyId={this.props.row.CustomerId}/>
            </TabPane>
            <TabPane tab="外勤任务" key="3">
              <OutWork companyId={this.props.row.CustomerId}/>
            </TabPane>
          </Tabs>
        </div>
      </div>
    )
  }
}

export default Main
