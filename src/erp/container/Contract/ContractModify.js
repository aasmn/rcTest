import React from 'react'
import { Spin, message, Button, Form, Select, Input } from 'antd'
import { getListData, postData, putData } from '@/erp/api'
import _ from 'lodash'
import * as ContractActions from '@/erp/config/contractActions'
import Dialog from '@/erp/container/Dialog'
import Title from '@/erp/component/Title'
import store from '@/erp/store'

import CustomerBaseInfo from '@/erp/container/Contract/CustomerBaseInfo'
import ContractInfo from '@/erp/container/Contract/ContractForm'
import PayInfo from '@/erp/container/Contract/PayInfo'

const Option = Select.Option;
const FormItem = Form.Item;

class FormSelect extends React.Component {
  render(){
    return (
    <Select value={''+ (this.props.value||'')} style={{minWidth: '100px'}} onChange={e=>{this.props.onChange(e)}}>
      {this.props.children}
    </Select>
    );
  }
}
function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class StatusInfoForm extends React.Component {
  state={salerList:null}
  componentWillMount() {
    getListData('order/sales?subsidiaryId='+ this.props.subId).then(res=>{
      this.setState({
        salerList: res.data
      })
    });
  }
  getFieldsValue = ()=>{
    if(this.validateField()) return null;
    const fields = this.props.form.getFieldsValue();
    const data = this.props.data;
    return _.extend(this.props.data,fields);
  }
  validateField = ()=>{
    this.props.form.validateFields();
    const errors = this.props.form.getFieldsError();
    return hasErrors(errors);
  }
  render() {
    if(!this.state.salerList) return <Spin/>;
    let data = this.props.data;
    const props = this.props;
    const { getFieldDecorator } = props.form;
    return (
      <div>
        <Form layout="inline">
            <FormItem
              label="签单销售"
            >
              {getFieldDecorator('OrderSalesId', {
                initialValue: data.OrderSalesId
              })(
                <FormSelect>
                  {this.state.salerList.map(item=>{
                    return <Option key={item.Id} value={item.Id}>{item.RealName}</Option>
                  })}
                </FormSelect>
              )}
            </FormItem>
            <FormItem
              label="订单状态"
            >
              {getFieldDecorator('OrderStatus', {
                initialValue: data.OrderStatus
              })(
                <FormSelect onChange={this.changeCompany}>
                  <Option key="1" value="1">审单待审核</Option>
                  <Option key="2" value="2">审单已审核</Option>
                  <Option key="3" value="3">审单驳回</Option>
                  <Option key="4" value="4">财务已审核/网店到款</Option>
                  <Option key="5" value="5">财务已驳回</Option>
                  <Option key="6" value="6">财务确认</Option>
                </FormSelect>
              )}
            </FormItem>
            <FormItem
              label= '外勤审核状态'
            >
              {getFieldDecorator('OutWorkerStatus', {
                initialValue: data.OutWorkerStatus
              })(
                <FormSelect onChange={this.changeCompany}>
                  <Option key="0" value="">空</Option>
                  <Option key="1" value="1">待审核</Option>
                  <Option key="2" value="2">已审核</Option>
                  <Option key="3" value="3">已驳回</Option>
                  <Option key="4" value="4">外勤提交</Option>
                  <Option key="5" value="5">部分确认</Option>
                  <Option key="6" value="6">已提交</Option>
                </FormSelect>
              )}
            </FormItem>
            <FormItem
              label="会计审核状态"
            >
              {getFieldDecorator('AccountantStatus', {
                initialValue: data.AccountantStatus
              })(
                <FormSelect>
                  <Option key="0" value="">空</Option>
                  <Option key="1" value="1">待审核</Option>
                  <Option key="2" value="2">已审核</Option>
                  <Option key="3" value="3">已驳回</Option>
                  <Option key="5" value="5">部分确认</Option>
                </FormSelect>
              )}
            </FormItem>
            <FormItem
              label="服务状态"
            >
              {getFieldDecorator('ServiceStatus', {
                initialValue: data.ServiceStatus
              })(
                <FormSelect>
                  <Option key="0" value="">空</Option>
                  <Option key="1" value="1">待分配</Option>
                  <Option key="2" value="2">未开始</Option>
                  <Option key="3" value="3">外勤服务</Option>
                  <Option key="4" value="4">外勤会计服务</Option>
                  <Option key="5" value="5">会计服务</Option>
                  <Option key="7" value="7">结束</Option>
                  <Option key="8" value="8">中止</Option>
                </FormSelect>
              )}
            </FormItem>
            <FormItem
              label="报税状态"
            >
              {getFieldDecorator('AgentStatus', {
                initialValue: data.AgentStatus,
              })(
                <FormSelect>
                  <Option key="0" value="">空</Option>
                  <Option key="1" value="1">未开始</Option>
                  <Option key="2" value="2">挂起</Option>
                  <Option key="3" value="3">服务中</Option>
                </FormSelect>
              )}
            </FormItem>
          </Form>
        </div>)
  }
}

const StatusInfo = Form.create()(StatusInfoForm);

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      readOnly: props.readOnly
    }
    this.onSave = this.onSave.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.getOrderDetail = this.getOrderDetail.bind(this);
    if(props.id){
      this.getOrderDetail(props.id);
    }else{
      this.state.data = {};
    }
  }
  getOrderDetail(id){
    getListData('order/'+ id).then(res=>{
      if(res.status){
        this.setState({data: res.data});
      }
    })
  }
  onSave(){

    const msg2 = this.ContractInfo.validateField();
    const msg3 = this.PayInfo.validateField();

    if(msg2) message.error(msg2);
    if(msg3) message.error(msg3);
    if(msg2 || msg3) return;

    let cusInfo = this.CustomerBaseInfo.getFieldsValue();
    if(!cusInfo) return;

    let ctrInfo = this.ContractInfo.getFieldsValue();
    let payInfo = this.PayInfo.getFieldsValue();
    if(!(ctrInfo.CrmOrderItems && ctrInfo.CrmOrderItems.length>0)){
      message.error('合同信息不能为空！');
      return;
    }

    const data = {
      ...cusInfo,
      ...ctrInfo,
      ...payInfo
    };
    // data.OrderSalesId = data.SalesId
    const state = store.getState();
    if (data.Remark && !(/(\{.*\})$/.test(_.trim(data.Remark)))) {
      data.Remark = data.Remark + '{' + state.common.user.RealName + '}';
    }
    data.Remark = data.Remark || '';
    this.handler.close(data)

  }
  onEdit(){
    this.setState({readOnly: false})
  }
  render() {

    return (
      <div style={this.props.style} className="order-dialog">
        <StatusInfo wrappedComponentRef={e=>{this.CustomerBaseInfo = e}} data={this.props.data} subId={this.props.subId} />
        <ContractInfo isCenter={true} ref={e=>{this.ContractInfo = e}} data={this.props.data}/>
        <PayInfo ref={e=>{this.PayInfo = e}} data={this.props.data} />
        <div style={{textAlign:'center'}}><Button type="primary" onClick={this.onSave}>保存</Button></div>
      </div>
    );
  }
}
export default Main
