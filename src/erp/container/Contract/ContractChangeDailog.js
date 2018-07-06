import React from 'react'
import { Spin, message, Button } from 'antd'
import { getListData, postData, putData } from '@/erp/api'
import _ from 'lodash'
import * as ContractActions from '@/erp/config/contractActions'
import Dialog from '@/erp/container/Dialog'
import Title from '@/erp/component/Title'
import store from '@/erp/store'

import CustomerBaseInfo from '@/erp/container/Contract/CustomerBaseInfo'
import ContractOrigin from '@/erp/container/Contract/ContractOrigin'
import PayInfo from '@/erp/container/Contract/PayInfo'
import ContractChangeForm from '@/erp/container/Contract/ContractChangeForm'
import ContractRefund from '@/erp/container/Contract/ContractRefund'
import BelongInfoChange from "@/erp/container/Contract/BelongInfoChange";

function formatChangeOrderData(data){
  let result;
  if (data && data.ChangeOrderDto && data.ChangeOrderDto.CrmOrderItems){
    result = data.ChangeOrderDto.CrmOrderItems[0]
    result.IsRefund = !!data.ChangeOrderDto.RefundItem;
    result.Remark1 = data.ChangeOrderDto.Remark;
    result.ContractDate = data.ChangeOrderDto.ContractDate;
  }else{
    result = {
      MainItemId: 1,
      ChildItemId: _.find(data.CrmOrderItems, { MainItemId: 1 }).ChildItemId === 1 ? 2 : 1,
    }
  }
  return result
}
function formatRefundData (data){
  return (data && data.ChangeOrderDto && data.ChangeOrderDto.RefundItem) || null;
}
function getLastMonth(data,smonth){
  const order =  _.find(data.CrmOrderItems, { MainItemId: 1 });
  if(!order) return 0;
  return order.OrderMonths + order.GiftMonths - smonth;
}

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      readOnly: props.readOnly,
      changeOrderData: formatChangeOrderData(props.data),
      refundData: formatRefundData(props.data),
      changeDate: props.data.ChangeDate,
      loading: false,
      lastMonth: 0
    }
    this.onSave = this.onSave.bind(this);
    console.log('ContractChangeDailog',this);
  }
  onChangeDate = (date,smonth)=>{
    const lastmonth = getLastMonth(this.props.data, smonth);
    this.setState(preState => {
      const changeOrderData = { ...preState.changeOrderData, OrderMonths: lastmonth};
      let st = { ...preState, changeOrderData, lastMonth: lastmonth, changeDate: date  };
      return st;
    });
  }
  onChangeForm = (obj)=>{
    this.setState(preState=>{
      const changeOrderData = { ...preState.changeOrderData,...obj}
      let st = { ...preState, changeOrderData };
      if ('OrderMonths' in obj) st.lastMonth = obj.OrderMonths;
      return st;
    });
  }
  onChangeRefund = (obj)=>{
    this.setState(preState => {
      const refundData = { ...preState.refundData, ...obj }
      return { ...preState, refundData };
    })
  }
  validateChangeOrderData = ()=>{
    const itemData = this.state.changeOrderData

    if (!itemData.OrderMonths) {
      message.error("请输入余下合同期限!");
      return false;
    }
    if (!itemData.ContractNo) {
      message.error("请输入合同编号!");
      return false;
    }
    if (!itemData.ContractDate){
      message.error("请输入合同签订日期!")
      return false;
    }
    if (isNaN(itemData.Amount)) {
      message.error("请输入合同费用!")
      return false;
    }
    
    return true;
  }
  validateRefundData = ()=>{
    if (!this.state.changeOrderData.IsRefund) return true;
    const data = this.state.refundData;
    if (!data.RefundAmount){
      message.error('请输入退款金额！')
      return false;
    }
    if (!data.RefundName) {
      message.error('请输入退款银行/第三方！')
      return false;
    }
    if (!data.Number) {
      message.error('请输入退款账号！')
      return false;
    }
    if (!data.AccountOpening) {
      message.error('请输入开户人！')
      return false;
    }
    return true;
  }
  onEdit = ()=>{
    this.setState({ readOnly: false })
  }
  onSave(){

    let cusInfo = this.CustomerBaseInfo.getFieldsValue();
    if (!cusInfo) return;
    
    if(!this.state.changeDate){
      message.error('请选择变更时间');
      return;
    }
    if(!this.validateChangeOrderData()) return;
    if(!this.validateRefundData()) return;
    if (this.PayInfo){
      const msg3 = this.PayInfo.validateField();
      if (msg3) {
        message.error(msg3);
        return;
      }
    }
    
    let payInfo = this.PayInfo? this.PayInfo.getFieldsValue() : {};
    const orgData = this.props.data;
    const changeOrderData = this.state.changeOrderData;
    const state = store.getState();
    if (changeOrderData.Remark1 && !(/(\{.*\})$/.test(_.trim(changeOrderData.Remark1)))) {
      changeOrderData.Remark1 = changeOrderData.Remark1 + '{' + state.common.user.RealName + '}';
    }

    let orderData = {
      OrderId: this.props.data.ChangeOrderDto.OrderId,
      IsRefund: +changeOrderData.IsRefund,
      ContractDate: changeOrderData.ContractDate,
      Remark: changeOrderData.Remark1 || '',
      CrmOrderItems: [{
        ..._.pick(changeOrderData, ['Id','MainItemId', 'ContractNo', 'Amount','ChildItemId','Remark']),
        OrderMonths: changeOrderData.OrderMonths,
        GiftMonths: changeOrderData.GiftMonths
      }],
      RefundItem: this.state.refundData,
      ...payInfo
    }

    let data = {
      ...cusInfo,
      OrderId: orgData.OrderId,
      ChangeDate: this.state.changeDate,
      ChangeOrderDto: orderData,
      canNoAgent: changeOrderData.NoAgent
    }
    this.setState({loading:true});
    
    if (!data.ChangeOrderDto.OrderId){
      postData('order/taxpayeradd',data).then(res=>{
        this.setState({ loading: false });
        if(res.status){
          message.info('保存成功！');
          this.props.onClose()
        }
      })
    }else{
      postData('order/taxpayerupdate', data).then(res=>{
        this.setState({ loading: false });
        if(res.status){
          message.info('保存成功！');
          this.props.onClose()
        }
      })
    }

  }

  render() {
    if(!this.props.data) return <Spin/>;
    const belongData = this.props.data.ChangeOrderDto.OrderId ? _.extend(this.props.data.ChangeOrderDto, {SubsidiaryName: this.props.data.SubsidiaryName}): null;
    return (
      <div style={this.props.style} className="order-dialog">
        <div className="contract-dialog-addon">{this.props.addOn || null}</div>
        {belongData && <BelongInfoChange data={belongData}/> }
        <CustomerBaseInfo readOnly={this.state.readOnly} companyReadOnly={true} wrappedComponentRef={e=>{this.CustomerBaseInfo = e}} data={this.props.data}/>
        <ContractOrigin readOnly={this.state.readOnly} ref={e=>{this.ContractInfo = e}} data={this.props.data} readOnly={this.state.readOnly} onChange={this.onChangeDate}/>
        <ContractChangeForm readOnly={this.state.readOnly} lastMonth={this.state.lastMonth} data={this.state.changeOrderData} onChange={this.onChangeForm}/>
        {this.state.changeOrderData.IsRefund && <ContractRefund readOnly={this.state.readOnly} data={this.state.refundData} onChange={this.onChangeRefund} review={this.props.review} pbReadOlny={this.props.RefundStatus==1} />}
        {(!this.props.review) && <PayInfo ref={e => { this.PayInfo = e }} data={this.props.data.ChangeOrderDto} readOnly={this.state.readOnly} />}
        {this.state.readOnly ? (isReandOnly(this.props.data.ChangeOrderDto.OrderStatus, this.props) ? null : <div style={{ textAlign: 'center' }}><Button type="primary" onClick={this.onEdit}>编辑</Button></div>)
          : <div style={{ textAlign: 'center' }}><Button type="primary" loading={this.state.loading} onClick={this.onSave}>保存并提交</Button></div>}
      </div>
    );
  }
}
function isReandOnly(status, props) {
  if (props.disabled) return true;
  if (props.centerReadOnly) return true;
  if (status === 1 || status === 3 || status === 5 || status === 8) {
    //1.待审核，2.审单已审核，3.审单驳回，4财务已审核/ 网店到款（天猫）,5财务驳回,6.财务确认（天猫）,7 总经理审核,8总经理驳回,9已退款
    return false;
  }
  return true;
}
export default Main
