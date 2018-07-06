import React from 'react'
import { Spin, message, Button, Modal, Input, DatePicker, Row, Col } from 'antd'
import _ from 'lodash';
import moment from 'moment'
import { fDate, fContractStatus } from '@/erp/config/filters'
import Title from '@/erp/component/Title'
import AddedValue from '@/erp/container/searchComponent/AddedValue'
import MainItemSelect from '@/erp/container/Contract/MainItemSelect'
import ChildItemSelect from '@/erp/container/Contract/ChildItemSelect'
import { postData } from '@/erp/api'
import Dialog from '@/erp/container/Dialog'

function toMoney (m) {
  if (isNaN(m)) return ''
  return parseFloat(m).toFixed(2)
}
class Others extends React.Component {
  constructor (props) {
    super(props);
    this.onAmountChange = this.onAmountChange.bind(this);
  }
  onAmountChange (e, item) {
    const input = e.target
    const data = item;
    if(this.props.amountReadOnly){
      message.error('领用单一旦提交不可修改金额，若要修改，请删除后重新领用!')
      input.value = data.ApplyAmount
      return;
    }
    const value = e.target.value;
    if (isNaN(value)) {
      message.info('请填写正确的领取金额！');
      input.focus()
      return;
    }
    if (value > data.Amount - data.ReceivedAmount - data.ApplyAmount) {
      const applyAmount = toMoney(data.Amount - data.ReceivedAmount - data.ApplyAmount)
      input.value = applyAmount
      message.error('领用金额不能超过剩余可用金额！')
      this.props.onAmountChange(item, applyAmount)
    } else {
      this.props.onAmountChange(item, value)
    }
  }
  render () {
    const data = this.props.data;
    return (<tbody className="ant-table-tbody" key="group4">
      {data.map((item, index) => {
        return (
          <tr className="ant-table-row" key={item.ContractId}>
            {index === 0 && <td rowSpan={data.length}>{item.ContractNo}</td>}
            <td>代收费</td>
            <td>{item.ChildItemName}</td>
            <td>{item.Amount}</td>
            <td>{item.ReceivedAmount}</td>
            <td>{toMoney(item.Amount - item.ReceivedAmount - item.ApplyAmount)}</td>
            <td>{(this.props.readOnly)? item.ApplyAmount : <Input defaultValue={item.ApplyAmount} onBlur={e => { this.onAmountChange(e,item) }} />}</td>
            <td>{data.Remark}</td>
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
    this.setAmount = this.setAmount.bind(this);
  }
  setAmount (data, amount) {
    this.props.onApplyAmountChange(data, amount)
  }
  render () {
    return (
      <div>
        {(!this.props.hideTitle) && <Title title='合同信息'/>}
        <div className="ant-table ant-table-middle ant-table-bordered ant-table-scroll-position-left">
          <div className="ant-table-content">
            <div className="ant-table-body">
              <table className="">
                <thead className="ant-table-thead">
                  <tr>
                    <th key="1" style={{ width: '200px' }}><span>合同编号</span></th>
                    <th key="2" style={{ width: '100px' }}><span>项目</span></th>
                    <th key="3" style={{ width: '100px' }}><span>子项目</span></th>
                    <th key="4" style={{ width: '150px' }}><span>费用</span></th>
                    <th key="5">已领金额</th>
                    <th key="6">剩余可用金额</th>
                    <th key="7">申请金额</th>
                    <th key="8"><span>备注</span></th>
                  </tr>
                </thead>
                <Others readOnly={this.props.readOnly} onAmountChange={this.setAmount} data={this.props.data.ContractList} amountReadOnly={this.props.data.AuditStatus == 2}/>
              </table>
            </div>
          </div>
        </div>
        <Row style={{ padding: '12px 0' }}>
          <Col span={2}><label>领用备注：</label></Col>
          <Col span={22}><Input.TextArea value={this.props.data.BillInfo.Remark} readOnly={this.props.readOnly} onChange={e=>{this.props.onRemarkChange(e.target.value)}}/></Col>
        </Row>
      </div>
    );
  }
}

export default Main
