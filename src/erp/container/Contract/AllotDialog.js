import React, { Component } from 'react'
import { Tabs, List, Spin, message, Button } from 'antd'
import { getListData, putData } from '@/erp/api'
import ViewCustomer from '@/erp/container/Contract/ViewCustomer'
import EditCustomer from '@/erp/container/Contract/EditCustomer'
import OrderAll from '@/erp/container/Contract/OrderAll'
import OutWork from '@/erp/container/Contract/OutWork'
import _ from 'lodash'
import AllotInfo from '@/erp/container/Contract/AllotInfo'
import CurrentOrderInfo from '@/erp/container/Contract/CurrentOrderInfo'


const TabPane = Tabs.TabPane;

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderInfo: null,
      customerInfo: null,
      activeKey: "1",
      isEditing: false,
    }
    this.getOrderInfo = this.getOrderInfo.bind(this);
    this.onTabClick = this.onTabClick.bind(this);
    this.setEditing = this.setEditing.bind(this);
    this.verifyData = this.verifyData.bind(this);
    this.getOrderInfo();
    this.closeDialog = this.closeDialog.bind(this);
  }
  closeDialog(){
    this.handler.close();
  }
  refresh(){
    this.forceUpdate();
  }
  getOrderInfo(){
    const row = this.props.row;
    getListData('customerdetail/'+ this.props.row.CustomerId).then(res=>{
      res.data = _.extend(res.data, row);
      this.setState({
        customerInfo: res.data
      })
    })
    getListData('orders/'+ this.props.row.OrderId).then(res=>{
      res.data = _.extend(res.data, row);
      this.setState({
        orderInfo: res.data
      })
    })
  }
  setEditing(){
    if(this.state.isEditing){
      let data = this.editform.getFieldsValue();
      if(!data) return;
      if(data && !data.AreaCode){
        message.error('请选择区域');
        return;
      }
      putData(`Customer/update/@/erp{data.Id}?syncDate=`,data).then(res=>{
        if(res.status){
          message.info('保存成功!');
          if(this.props.refreshTable) this.props.refreshTable();
          this.setState({
            customerInfo: {...data}
          });
          this.setState((preState)=>{
            return {
              isEditing: !preState.isEditing
            }
          });
        }
      });
    }else{
      this.setState((preState)=>{
        return {
          isEditing: !preState.isEditing
        }
      });
    }

  }
  verifyData(){
    let data = this.editform?this.editform.getFieldsValue(): this.state.customerInfo;
    if(!data) return false;
    return !!(data.RegNO || data.RegCode);
  }
  onTabClick(arg){
    this.setState({activeKey:arg});
  }
  render() {
    return(
      <div style={this.props.style} className="company-dialog">
        <AllotInfo row={this.state.orderInfo} closeDialog={this.closeDialog} verifyData={this.verifyData} />
        <div>
          <Tabs type="card" style={{width: '100%'}} activeKey={this.state.activeKey} onTabClick={this.onTabClick}>
            <TabPane tab="公司信息" key="1">
              { this.state.orderInfo && this.state.orderInfo.ServiceStatus < 13 && <Button type="primary" style={{float:'right'}} disabled={this.state.orderInfo.DisableCommitAccount&&this.state.orderInfo.DisableOutWorkCommitAccount} onClick={this.setEditing}>{this.state.isEditing?'保存':'编辑'}</Button> }
              { this.state.customerInfo?(this.state.isEditing? <EditCustomer data={this.state.customerInfo} wrappedComponentRef={view=>{this.editform = view;}}/>:<ViewCustomer data={this.state.customerInfo}/>):<Spin/> }
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
