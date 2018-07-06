import React, { Component } from 'react'
import { Button, Row, Col, message, Form, Modal, DatePicker, Input } from 'antd'
import HasPower from '@/erp/container/HasPower'
import {fServiceStatus, fAccountantStatus, fCheckStatus, fDate } from '@/erp/config/filters'
import Confirm from '@/erp/component/Confirm'
import { putData, postData } from '@/erp/api'
import SetServiceMonth from '@/erp/container/Contract/SetServiceMonth'
import store from '@/erp/store'
import Dialog from '@/erp/container/Dialog'
import _ from 'lodash'

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initRow: {},
      visible: false,
      setFirstMonth: ''
    }
    this.AccountCheck = this.AccountCheck.bind(this);
    this.AccountCheckSecond = this.AccountCheckSecond.bind(this);
    this.onReject = this.onReject.bind(this);
    console.log(store, 'xxx')
  }
  AccountCheck = () => {
    const dialog = Dialog({
        content: <SetServiceMonth data={this.state.initRow} wrappedComponentRef={v=>{if(v) v.handler=dialog;}}/>,
        width: 500,
        confirmLoading: false,
        footer: null,
        title: '设置首报月'
    })
    dialog.result.then(()=>{
        store.dispatch({
          type: 'set contract account modal status',
          status: {
            modal1: false,
            modal2: false
          }
        });
    },()=>{});
  }

  closeAll () {

  }
  AccountCheckSecond() {
    let setFirstMonth = this.state.setFirstMonth.length && this.state.setFirstMonth[0];
    if(!setFirstMonth) setFirstMonth = {};
    const info = this.state.initRow
    var AccountantTaskSource = info.AccountantTaskSource,
    PartTax = info.PartTax,
    ServiceStatus = info.ServiceStatus,
    ServiceStart = setFirstMonth.ServiceStart?setFirstMonth.ServiceStart:'',
    ServiceEnd = setFirstMonth.ServiceEnd?setFirstMonth.ServiceEnd:'';
    putData('order/audit/pass/' + info.OrderId + '?accountantTaskSource=' + AccountantTaskSource + '&partTax=' + PartTax + '&serviceStatus=' + ServiceStatus + '&serviceStartDate=' + ServiceStart + '&serviceEndDate=' + ServiceEnd).then(res => {
      if (res.status) {
        message.info('审核成功！');
        store.dispatch({
          type: 'set contract account modal status',
          status: {
            modal1: false,
            modal2: false
          }
        });
      }
    })
  }
  onReject() {
    const OrderId = this.props.data.OrderId
    let remark;
    const dialog = Dialog({
      content: (<div><label>驳回原因</label><Input.TextArea onChange={e => { remark = e.target.value }} /></div>),
      handleOk: () => {
        // if (!remark) {
        //   message.error("请填写驳回原因!")
        //   return false;
        // }
        return save(remark || '');
      },
      width: 450,
      confirmLoading: false,
      title: "确认结束"
    })
    const that = this;
    function save(remark) {
      const state = store.getState();
      if (remark && !(/(\{.*\})$/.test(_.trim(remark)))) {
        remark = remark + '{' + state.common.user.RealName + '}';
      }
      return putData('order/audit/reject/' + OrderId, { remark: remark }).then(res => {
        if (res.status) {
          // 关闭上一个弹窗并且刷新列表
          message.info('驳回成功！');
          store.dispatch({
            type: 'set contract account modal status',
            status: {
              modal1: false,
              modal2: false
            }
          })
        }
      })
    }
  }
  componentWillMount() {
    this.setState({initRow: this.props.data}, () => {
      var setFirstMonth = _.filter(this.state.initRow.CrmOrderItems, {
        "MainItemId": 1
      })

      this.setState({setFirstMonth: setFirstMonth})
      if (setFirstMonth && setFirstMonth.length && (!fDate(setFirstMonth[0].ServiceStart))) {
        this.setState({isSetFirstMonth: true})
      } else {
        this.setState({isSetFirstMonth: false})
      }
    })
  }
  render() {
    const data = this.state.initRow;
    // console.log(data.ServiceStart, data.AccountantStatus, 'render')
    console.log(data.AccountantStatus !== 1)
    console.log(data.AccountantStatus !== 3)
    return(
      <div>
        <Row className="company-info">
          <Col span={22}>
             <label>序列ID:</label>{data.SequenceNo}
             <label>公司名称:</label>{data.CompanyName}
             <label>当前服务日期:</label>{fDate(data.CrmOrderItems[0]&&data.CrmOrderItems[0].ServiceStart)} - {fDate(data.CrmOrderItems[0]&&data.CrmOrderItems[0].ServiceEnd)}
             <label>服务状态:</label>{fServiceStatus(data.ServiceStatus)}
             <label>外勤审核状态:</label>{fCheckStatus(data.OutWorkerStatus)}
             <label>会计审核状态:</label>{fAccountantStatus(data.AccountantStatus)}
          </Col>
          <Col span={2}>
            <Button.Group>
              {(this.state.isSetFirstMonth) && <HasPower power="REVIEW"  key={"btn_REVIEW"}>
                <Button type="primary" onClick={this.AccountCheck} disabled={data.AccountantStatus >1 || data.ServiceStatus === 8}>会计审核</Button>
              </HasPower>}
              {(!this.state.isSetFirstMonth) && <HasPower power="REVIEW"  key={"btn_REVIEW"}>
                <Button type="primary" onClick={this.AccountCheckSecond} disabled={data.AccountantStatus>1 || data.ServiceStatus === 8}>会计审核</Button>
              </HasPower>}
             <HasPower power="REJECT"  key={"btn_REJECT"}>
                <Button type="primary" onClick={this.onReject} disabled={data.AccountantStatus > 1 || data.ServiceStatus === 8 || data.FreChangeOrderId}>会计驳回</Button>
              </HasPower>
            </Button.Group>
          </Col>
        </Row>
      </div>
    )
  }
}

export default Main
