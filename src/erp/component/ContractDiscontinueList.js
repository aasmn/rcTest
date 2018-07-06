import React from 'react'
import { Spin, message, Button, Modal, Input, DatePicker, Row, Col, Checkbox } from 'antd'
import _ from 'lodash';
import moment from 'moment'
import { fDate, fContractStatus, fServiceStatus, fAgentStatus } from '@/erp/config/filters'
import Title from '@/erp/component/Title'
import AddedValue from '@/erp/container/searchComponent/AddedValue'
import MainItemSelect from '@/erp/container/Contract/MainItemSelect'
import ChildItemSelect from '@/erp/container/Contract/ChildItemSelect'
import { postData } from '@/erp/api'
import Confirm from '@/erp/component/Confirm'
import ContractRefund from '@/erp/container/Contract/ContractRefund'
import HasPower from '@/erp/container/HasPower'
import RIf from '@/erp/component/RIF'
import ZZReason from '@/erp/container/searchComponent/ZZReason'
import ZFReason from '@/erp/container/searchComponent/ZFReason'

class Accounting extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      data: props.data
    }
    this.validateField = this.validateField.bind(this);
  }
  validateField () {
    return null
  }
  render () {
    const data = this.props.data[0];
    return (
      <tbody className="ant-table-tbody">
        <tr className="ant-table-row">
          <td>{data.ContractNo}</td>
          <td>记账报税</td>
          <td>{data.ChildItemId === 1 ? "小规模" : "一般纳税人"}</td>
          <td>{data.Amount}</td>
          <td>{data.ChangeRefundAmount}</td>
          <td>{data.ReceiveAmount}</td>
          <td><Input maxLength="6" disabled={this.props.readOnly} defaultValue={data.RefundAmount || 0} onChange={e => { this.props.onChange(e, data) }} /></td>
          <td>{data.OrderSalesName}</td>
          <td>{fDate(data.ContractDate)}</td>
          <td>{data.Remark}</td>
          <td>{fServiceStatus(data.ServiceStatus)}</td>
        </tr>
        <tr className="ant-table-row" >
          <td colSpan="10" style={{ background: '#f8d795', padding: '3px 12px' }}>
            <span>服务期限:{data.OrderMonths}  {data.GiftMonths ? ('+' + data.GiftMonths) : ''}</span> <span style={{ marginLeft: '24px' }}>服务开始时间:{fDate(data.ServiceStart)}</span><span style={{ marginLeft: '24px' }}>服务结束时间:{fDate(data.ServiceEnd)}</span>
          </td>
        </tr>
      </tbody>
    );
  }
}

class AddedService extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      data: props.data
    }

    this.validateField = this.validateField.bind(this);
  }
  validateField () {
    return null
  }
  render () {
    const data = this.state.data;

    return (
      <tbody className="ant-table-tbody">
        {data.map((item, index) => {
          return (
            <tr className="ant-table-row" key={item.Id}>
              {index === 0 && <td rowSpan={data.length}>{item.ContractNo}</td>}
              <td><MainItemSelect disabled size="small" defaultValue={item.MainItemId} onChange={v => { this.setFieldValue(index, { MainItemId: +v }); }} /></td>
              <td><ChildItemSelect disabled={true} size="small" mainId={item.MainItemId} defaultValue={item.ChildItemId} onChange={v => { this.setFieldValue(index, { ChildItemId: +v }) }} /></td>
              <td>{item.Amount}</td>
              <td>{data.ChangeRefundAmount}</td>
              <td>{item.ReceiveAmount}</td>
              <td><Input maxLength="6" disabled={this.props.readOnly} defaultValue={item.RefundAmount || 0} onChange={e => { this.props.onChange(e, item) }} /></td>
              <td>{item.OrderSalesName}</td>
              <td>{fDate(item.ContractDate)}</td>
              <td>{item.Remark}</td>
              <td>{fServiceStatus(item.ServiceStatus)}</td>
            </tr>
          );
        })}
      </tbody>
    );

  }
}
class Others extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      data: props.data
    }
    this.validateField = this.validateField.bind(this);
  }
  validateField () {
    return null
  }
  render () {
    const data = this.state.data;
    return (<tbody className="ant-table-tbody">
      {data.map((item, index) => {
        return (
          <tr className="ant-table-row" key={item.Id}>
            {index === 0 && <td rowSpan={data.length}>{item.ContractNo}</td>}
            <td>代收费</td>
            <td><ChildItemSelect disabled size="small" mainId={4} defaultValue={item.ChildItemId} /></td>
            <td>{item.Amount}</td>
            <td>{data.ChangeRefundAmount}</td>
            <td>{item.ReceiveAmount}</td>
            <td><Input maxLength="6" disabled={this.props.readOnly} defaultValue={item.RefundAmount || 0} onChange={e => { this.props.onChange(e, item) }} /></td>
            <td>{item.OrderSalesName}</td>
            <td>{fDate(item.ContractDate)}</td>
            <td>{item.Remark}</td>
            <td>{fServiceStatus(item.ServiceStatus)}</td>
          </tr>
        );
      })}
    </tbody>);
  }
}

let style = {};
class Main extends React.Component {
  constructor (props) {
    super(props);
    const defaultState = {
      CrmOrderItems: [],
      Remarks: '',
      Amount: 0
    }

    this.formatData = this.formatData.bind(this);
    const state = this.formatData(props.data);
    this.state = _.extend(defaultState, state);
  }
  componentWillReceiveProps (nextProps) {
    const data = nextProps.data;
    const state = this.formatData(data);
    this.setState(state);
  }
  formatData (data) {
    if (data) {
      const current = this.props.currentId
      if (current) {
        data.CrmOrderItems = _.filter(data.CrmOrderItems, item => {
          return current.indexOf(item.Id) > -1
        })
      }
      if (this.props.type == 2) {
        if (data.RefundItem) {
          data.RefundItem.readOnly = true;
        } else {
          const ramount = _.reduce(data.CrmOrderItems, (r, item) => {
            item.RefundAmount = item.Amount;
            return r + (+item.Amount);
          }, 0)
          let refundItem = {
            readOnly: true,
            RefundAmount: ramount,
            RefundName: '爱康鼎',
            Number: '1000000000',
            AccountOpening: '爱康鼎'
          }
          data.RefundItem = refundItem
        }

      }
      data.StopTime = fDate(data.StopTime);
      data.StarTime = fDate(data.StarTime);
      if (!data.StopTime) {
        data.ServerCount = 0;
      } else if (!fDate(data.StarTime)) {
        data.ServerCount = 0;
      } else {
        data.ServerCount = (moment(data.StopTime).diff(moment(data.StarTime), 'months') + 1) || 0;
      }
      data.contracts = _.values(_.groupBy(data.CrmOrderItems, 'ContractNo'));
      const agent = _.find(data.CrmOrderItems, { MainItemId: 1 });
      // data.NoAgent = data.canNoAgent || data.NoAgent;
      data.canNoAgent = agent && !!fDate(agent.ServiceStart);
      return data;
    }
    return null;
  }
  changeEndDate = (v) => {
    const data = this.state;
    const cnt = data.StarTime ? moment(v).diff(moment(data.StarTime), 'months') + 1 : 0;
    this.setState({ StopTime: v && v.format('YYYY-MM'), ServerCount: cnt || 0, NoAgent: false });
  }
  changeReason = (v) => {
    this.setState({ reason: v })
  }
  changeAmount = (e, item) => {
    let v = e.target.value;
    if (!v) v = 0;
    if (parseFloat(v) > parseFloat(item.Amount)- parseFloat(item.ReceiveAmount||0)- parseFloat(item.ChangeRefundAmount||0)) {
      message.error('退款金额不能大于合同金额减去领用金额！');
      e.target.value = item.Amount;
      v = item.Amount;
    }
    _.find(this.state.CrmOrderItems, { Id: item.Id }).RefundAmount = v;

    const sum = _.reduce(this.state.CrmOrderItems, function (sum, n) {
      return (+sum) + (+n.RefundAmount)
    }, 0);
    if (sum > 0) {
      const reItem = _.extend({}, this.state.RefundItem, { RefundAmount: sum })
      this.setState({ RefundItem: reItem }, () => {
        this.refund.changeAmount(sum);
      })
    } else {
      this.refund && this.refund.changeAmount(0);
      this.setState({ RefundItem: null });
    }

  }
  selectItem = (item, v) => {
    _.each(_.filter(this.state.CrmOrderItems, { ContractNo: item.ContractNo }), t => { t.checked = v });
  }
  onChangeRefund = (obj) => {
    this.setState(preState => {
      const RefundItem = { ...preState.RefundItem, ...obj }
      return { ...preState, RefundItem };
    })
  }
  selectRefund = () => {
    if (!!this.state.RefundItem) {
      this.setState({ RefundItem: null })
    } else {
      this.setState({ RefundItem: {} })
    }

  }
  onSave = (type) => {
    const validate = this.validateField();
    const data = _.cloneDeep(this.state);
    data.StarTime = data.StarTime || null;
    data.StopTime = data.StopTime || null;
    //data.canNoAgent = data.NoAgent;
    if (validate) {
      Confirm({
        handleOk: () => {
          this.props.onSave(data, type);
          return true;
        },
        message: '确认要中止/作废吗？'
      })

    }
  }
  onEditSave = () => {
    const validate = this.validateField();
    const data = _.cloneDeep(this.state);
    // data.canNoAgent = data.NoAgent;
    if (validate) {
      Confirm({
        handleOk: () => {
          this.props.onSave(data, 3)
          return true;
        },
        message: '确认要结束吗？'
      })

    }
  }
  validateField () {
    const data = this.state;
    if (this.props.type ==1 &&(!data.NoAgent) && !data.StopTime) {
      message.error('请填写中止服务日期！');
      return false
    }
    if (!data.reason) {
      message.error('请选择中止/废止原因！')
      return false
    }
    if (!data.Remarks) {
      message.error("请备注中止原因！");
      return false
    }
    const efData = data.RefundItem;
    if (efData) {
      let amount = 0;
      for (let i = 0; i < len; i++) {
        const crr = data.CrmOrderItems[i];
        amount = amount + parseFloat(crr.Amount)
      }
      if (amount && !efData.RefundAmount) {
        message.error('请输入退款金额！')
        return false;
      }
      if (!efData.RefundName) {
        message.error('请输入退款银行/第三方！')
        return false;
      }
      if (!efData.Number) {
        message.error('请输入退款账号！')
        return false;
      }
      if (!efData.AccountOpening) {
        message.error('请输入开户人！')
        return false;
      }
    }
    const len = data.CrmOrderItems.length;
    for (let i = 0; i < len; i++) {
      const crr = data.CrmOrderItems[i];
      if (parseFloat(crr.RefundAmount) > parseFloat(crr.Amount)) {
        message.error("退款金额不能超过合同金额！");
        return false;
      }
    }


    return true;
  }
  disabledZZTime = (date) => {
    return date && this.state.StarTime && date < moment(this.state.StarTime);
  }
  getFieldsValue () {
    return this.state;
  }
  onNoAgent = (checked) => {
    Confirm({
      handleOk: () => {
        this.setState({ StopTime: null, NoAgent: checked })
        return true;
      },
      message: '该记账合同所属的服务期限内的账目可能会受影响，确认继续吗？'
    })
  }
  render () {
    const preon = (<Checkbox checked={!!this.state.RefundItem} readOnly />)
    const Reason = this.props.type == 1 ? ZZReason : ZFReason
    const agentData = this.state.customerStatusInAgent || {}
    return (
      <div>
        <Row style={{ padding: '12px 0' }} className="row-span">
          <span><label>公司信息：</label>{this.state.CompanyName}</span>
          <span><label>开始服务日期：</label>{fDate(this.state.StarTime)}</span>
          <RIf if={this.props.type == 2}><span><label>主办会计:</label>{agentData.AccountantName}</span></RIf>
          <RIf if={this.props.type == 2}><span><label>记账状态:</label>{fAgentStatus(agentData.Status)}</span></RIf>
          <RIf if={this.props.type == 1}><span><label>中止服务日期：</label><DatePicker.MonthPicker disabledDate={this.disabledZZTime} disabled={this.props.readOnly && !this.props.edit} value={this.state.StopTime && moment(this.state.StopTime)} onChange={v => { this.changeEndDate(v) }} /></span></RIf>
          <RIf if={this.props.type == 1}><span><Checkbox checked={this.state.NoAgent} disabled={!this.state.canNoAgent} onClick={e => { this.onNoAgent(e.target.checked) }}>不必做账</Checkbox></span></RIf>
          <RIf if={this.props.type == 1}><span><label>已服务时长：</label>{this.state.ServerCount}</span></RIf>
          <span><label className="required">*中止/作废原因:</label><Reason hideAll={true} disabled={this.props.readOnly && !this.props.edit} value={this.state.reason} onChange={v => { this.changeReason(v) }} /></span>
        </Row>
        {(!this.props.hideTitle) && <Title title='合同信息' />}
        <div className="ant-table ant-table-middle ant-table-bordered ant-table-scroll-position-left">
          <div className="ant-table-content">
            <div className="ant-table-body">
              <table className="">
                <thead className="ant-table-thead">
                  <tr>
                    <th style={{ width: '200px' }}><span>合同编号</span></th>
                    <th style={{ width: '100px' }}><span>项目</span></th>
                    <th style={{ width: '100px' }}><span>子项目</span></th>
                    <th style={{ width: '150px' }}><span>费用</span></th>
                    <th>已退款金额</th>
                    <th><span>已领用</span></th>
                    <th style={{ color: 'red', textAlign: 'center' }}>*退款金额</th>
                    <th>签单销售</th>
                    <th>签订日期</th>
                    <th>备注</th>
                    <th>服务状态</th>
                  </tr>
                </thead>
                {this.state.contracts.map((item, index) => {
                  if (item[0].MainItemId == 1)
                    return <Accounting readOnly={this.props.readOnly && !this.props.edit} key={index} currentId={this.props.currentId} data={item} onChange={(e, item) => { this.changeAmount(e, item) }} onSelect={(id, v) => this.selectItem(id, v)} />
                  if (item[0].MainItemId == 2 || item[0].MainItemId == 3)
                    return <AddedService readOnly={this.props.readOnly && !this.props.edit} key={index} currentId={this.props.currentId} data={item} onChange={(e, item) => { this.changeAmount(e, item) }} onSelect={(id, v) => this.selectItem(id, v)} />
                  if (item[0].MainItemId == 4)
                    return <Others readOnly={this.props.readOnly && !this.props.edit} key={index} currentId={this.props.currentId} data={item} onChange={(e, item) => { this.changeAmount(e, item) }} onSelect={(id, v) => this.selectItem(id, v)} />
                })}
              </table>
            </div>
          </div>
        </div>
        <Row style={{ padding: '12px 0' }}>
          <Col span={2}><label className="ant-form-item-required">备注信息：</label></Col>
          <Col span={22}><Input.TextArea readOnly={this.props.readOnly && !this.props.edit} value={this.state.Remarks} onChange={v => { this.setState({ Remarks: v.target.value }) }} /></Col>
        </Row>
        <Title title="退款信息" preon={preon} />
        {this.state.RefundItem && <ContractRefund hideTitle={true} amReadOnly={true} readOnly={this.state.RefundItem.readOnly || this.props.readOnly && !this.props.edit} review={this.props.payback} pbReadOlny={this.props.pbReadOlny} data={this.state.RefundItem} onChange={this.onChangeRefund} ref={e => { this.refund = e }} />}
        {(!this.props.readOnly) && (<Button.Group style={{ textAlign: 'center', display: 'block', margin: '12px' }}>
          <HasPower power="ZFZZ"><RIf if={this.props.type == 2}><Button type="primary" loading={this.props.loading} onClick={this.onSave.bind(this, 1)}>作废中止</Button></RIf></HasPower>
          <HasPower power="PTZZ"><RIf if={this.props.type == 1}><Button type="primary" loading={this.props.loading} style={{ marginLeft: '150px' }} onClick={this.onSave.bind(this, 2)}>中止提交审核</Button></RIf></HasPower>
        </Button.Group>)}
        {this.props.edit && (<Button.Group style={{ textAlign: 'center', display: 'block', margin: '12px' }}>
          <Button type="primary" loading={this.props.loading} onClick={this.onEditSave.bind(this)}>保存</Button>
        </Button.Group>)}
      </div>
    );
  }
}

export default Main
