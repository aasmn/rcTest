import React, { Component } from 'react'
import { Tabs, List, Spin, message, Button } from 'antd'
import { getListData, putData } from '@/erp/api'
import _ from 'lodash'
import OrderDialog from '@/erp/container/Contract/OrderDialog'
import Prompt from '@/erp/component/Prompt'
import BelongInfo from '@/erp/container/Contract/BelongInfo'
import store from '@/erp/store'
const TabPane = Tabs.TabPane;

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canSure: true,

    }
    this.pass = this.pass.bind(this);
    this.reject = this.reject.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
  }
  closeDialog(){
    this.handler.close();
  }
  pass(){
    const data = this.props.data;
    const post = {
      OrderId: data.OrderId,
      remark: '',
      auditVal: 0
    };
    putData('order/financeaudit', post).then(res =>{
        // console.log(res)
      if(res.status) {
        message.info('审核成功')
        this.closeDialog();
      }
    });
  }
  reject(arg){
    Prompt({
        title: '驳回原因',
        handleOk: (resStr)=>{
          return new Promise((resolve, reject) => {
            const state = store.getState();
            resStr = resStr ? resStr + '{' + state.common.user.RealName + '}' : ''
            putData('order/financeaudit',{
                OrderId: this.props.data.OrderId,
                remark: resStr,
                auditVal: 1
            }).then(res=>{
                if(res.status){
                    message.info('驳回成功！');
                    this.closeDialog();
                    resolve();
                }
            })
          });
        }
    });
  }
  sure() {
    const data = this.props.data;
    const post = {
      OrderId: data.OrderId,
      remark: '',
      auditVal: 2
    };
    putData('order/financeaudit', post).then(res =>{
        // console.log(res)
      if(res.status) {
        message.info('已确认')
        this.closeDialog();
      }
    });
  }
  render() {
    return(
      <div style={this.props.style} className="company-dialog">
        {(this.props.data.OrderSourceId === 1)?(<Button.Group style={{float:'right'}}>
            <Button type="primary"  onClick={this.pass.bind(this)} disabled={this.props.data.OrderStatus !== 2}>财务审核</Button>
            <Button type="primary"  onClick={this.reject.bind(this)} disabled={this.props.data.OrderStatus !== 2}>财务驳回</Button>
          </Button.Group>):null}
          {this.props.data.OrderSourceId === 2 ?(<Button.Group style={{float:'right'}}>
              <Button type="primary"  onClick={this.pass.bind(this)} disabled={this.props.data.OrderStatus !== 2}>网店到款</Button>
              <Button type="primary"  onClick={this.reject.bind(this)} disabled={this.props.data.OrderStatus !== 2}>财务驳回</Button>
              <Button type="primary"  onClick={this.sure.bind(this)} disabled={this.props.data.OrderStatus !== 4}>财务确认</Button>
            </Button.Group>):null}
        <BelongInfo data={this.props.data}/>
        <OrderDialog disabled={true} readOnly={true} id={this.props.data.OrderId}/>
      </div>
    )
  }
}

export default Main
