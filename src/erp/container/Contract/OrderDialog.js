import React from 'react'
import { Spin, message, Button } from 'antd'
import { getListData, postData, putData } from '@/erp/api'
import _ from 'lodash'
import * as ContractActions from '@/erp/config/contractActions'
import Dialog from '@/erp/container/Dialog'
import Title from '@/erp/component/Title'
import store from '@/erp/store'

import CustomerBaseInfo from '@/erp/container/Contract/CustomerBaseInfo'
import ContractInfo from '@/erp/container/Contract/ContractForm'
import PayInfo from '@/erp/container/Contract/PayInfo'
import Confirm from '@/erp/component/Confirm'


class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      readOnly: props.readOnly,
      key: _.uniqueId('key_'),
      loading: false
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
    getListData('orders/'+ id).then(res=>{
      if(res.status){
        this.setState({data: res.data});
        if(this.props.onChange) this.props.onChange(res.data);
      }
    })
  }
  onSave(){
    
    const msg2 = this.ContractInfo.validateField();
    const msg3 = this.PayInfo.validateField();

    if (msg2) {
      message.error(msg2)
      return;
    }
    if (msg3) {
      message.error(msg3);
      return;
    }

    let cusInfo = this.CustomerBaseInfo.getFieldsValue();
    if (!cusInfo) return;

    let ctrInfo = this.ContractInfo.getFieldsValue();

    

    let payInfo = this.PayInfo.getFieldsValue();
    if (!(ctrInfo.CrmOrderItems && ctrInfo.CrmOrderItems.length > 0)) {
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
    const jzItem = _.find(ctrInfo.CrmOrderItems, { MainItemId: 1 });
    if (cusInfo.AddedValue && jzItem && jzItem.ChildItemId != cusInfo.AddedValue) {
      Confirm({
        handleOk: () => {
          this.saveData(data);
        },
        okText: '确认保存',
        message: "纳税性质不一致，请仔细核对后再提交！"
      })
    }else{
      this.saveData(data);
    }
    
  } 
  saveData = (data)=>{
    this.setState({loading: true});
    if (!this.state.data.OrderId) {
      data.AgentCompanyId = this.props.isRep || '';
      postData('orders', data).then(res => {
        this.setState({ loading: false });
        if (res.status) {
          message.info('保存成功！');
          if (this.handler) this.handler.close();
          if (this.props.closeDialog) this.props.closeDialog();
          if (this.props.isPage) {
            window.location.href = "#/main/contract_manage"
          }
        }
      })
    } else {
      putData('orders/' + this.state.data.OrderId, _.extend({}, this.state.data, data)).then(res => {
        this.setState({ loading: false });
        if (res.status) {
          message.info('保存成功！');
          if (this.handler) this.handler.close();
          if (this.props.closeDialog) this.props.closeDialog();
          if (this.props.isPage) {
            window.location.href = "#/main/contract_manage"
          }
        }
      })
    }

  }
  onEdit(){
    this.setState({readOnly: false})
  }
  render() {
    if(!this.state.data) return <Spin/>;
    return (
      <div style={this.props.style} className="order-dialog" key={this.state.key}>
        <CustomerBaseInfo wrappedComponentRef={e => { this.CustomerBaseInfo = e }} data={this.state.data} readOnly={this.state.readOnly} CustomerSelectMode={2}/>
        <ContractInfo ref={e=>{this.ContractInfo = e}} data={this.state.data} readOnly={this.state.readOnly}/>
        <PayInfo ref={e=>{this.PayInfo = e}} data={this.state.data} readOnly={this.state.readOnly}/>
        {this.state.readOnly? (isReandOnly(this.state.data.OrderStatus,this.props)?  null : <div style={{textAlign:'center'}}><Button type="primary" onClick={this.onEdit}>编辑</Button></div>)
          : <div style={{textAlign:'center'}}><Button type="primary" loading={this.state.loading} onClick={this.onSave}>保存并提交</Button></div>}
      </div>
    );
  }
}
function isReandOnly(status,props){
  if(props.disabled) return true;
  if(status === 1 || status ===3 || status ===5){ //1.待审核，2.审单已审核，3.审单驳回，4财务已审核/ 网店到款（天猫）,5财务驳回,6.财务确认（天猫）
    return false;
  }
  return true;
}
export default Main
