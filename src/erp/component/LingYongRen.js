import React, { Component } from 'react'
import Title from '@/erp/component/Title'
import InputSpan from './inputSpan'
import { Row, Col, Input, Select, Button, DatePicker } from 'antd'
import moment from 'moment'

class Main extends Component {
  constructor (props) {
    super(props);
    this.setData = this.setData.bind(this)
  }
  setData (data) {
    if (data.ReceiveUserId && this.props.lyList.length>0) {
      const user = this.props.lyList.find(t => t.UserId == data.ReceiveUserId)
      this.props.fetchData(data.ReceiveUserId)
      if (user) {
        data = {
          ...user,
          ...data
        }
      }else{
        data = {
          ...user,
          Phone: ' '
        }
      }

    }
    this.props.onSetData(data);
  }
  render () {
    const data = this.props.data;
    const props = this.props;
    if (!data) return null;
    const style = { marginLeft: '70px' }
    let lyList = [].concat(props.lyList)
    if(data.ReceiveUserId){
      if(!lyList.find(u=>(u.UserId == data.ReceiveUserId))){
        lyList.push({
          UserId: data.ReceiveUserId,
          RealName: data.RealName,
          Category: data.Category
        })
      }
    }
    return (
      <div>
        <Title title='领用信息' />
        <Row style={{ padding: '10px 0', lineHeight: '24px' }}>
          <Col span={4}>
            <span className="required"> 领用金额:</span>
            <InputSpan readOnly={true} value={data.ReceiveAmount} />
          </Col>
          <Col span={6}>
            <span className="required"> 领用人:</span>
            <Select disabled={props.readOnly} size="small" style={{ width: '100px' }} value={data.ReceiveUserId?''+data.ReceiveUserId:null} onChange={v => { this.setData({ ReceiveUserId: v }) }}>
              {props.lyList.map(d => {
                return <Select.Option key={d.UserId}>{d.RealName}</Select.Option>
              })}
            </Select>
          </Col>
          <Col span={6}>
            <span className="required"> 对应角色:</span>
            <span>{data.Category}</span>
          </Col>
          <Col span={4}>
            <span className="required"> 联系电话:</span>
            <span>{data.Phone}</span>
          </Col>
        </Row>
        <Row style={{ padding: '10px 0', lineHeight: '24px' }}>
          <Col span={4}>
            <span className="required"> 结算方式:</span>
            银行转账
          </Col>
          <Col span={6}>
            <span className="required"> 对方银行/第三方:</span>·
            <InputSpan size="small" style={{ width: '150px' }} value={data.BankOrg} readOnly={props.readOnly} onChange={e => { this.setData({ BankOrg: e.target.value }) }} />
          </Col>
          <Col span={6}>
            <span className="required"> 账号:</span>
            <InputSpan size="small" style={{ width: '150px' }} value={data.Account} readOnly={props.readOnly} onChange={e => { this.setData({ Account: e.target.value }) }} />
          </Col>
          <Col span={4}>
            <span className="required"> 开户名:</span>
            <InputSpan size="small" style={{ width: '100px' }} value={data.OpenPerson} readOnly={props.readOnly} onChange={e => { this.setData({ OpenPerson: e.target.value }) }} />
          </Col>
          {(!this.props.readOnly) &&<Col span={4}>
             <Button size="small" type="primary" onClick={e => { this.props.saveData(data) }}>保存</Button>
             <div style={{position:'absolute',color:'red'}}><small>温馨提示：账号信息将被保存，以便下次直接读取</small></div>
          </Col>}
          {(this.props.isFin || data.paydate) && <Col span={4}>
            <span style={{color: 'red'}}> 打款日期:</span>
            {this.props.isFin && <DatePicker size="small" style={{ width: '100px' }} value={data.paydate?moment(data.paydate): null}  onChange={e => { this.setData({ paydate: e && e.format('YYYY-MM-DD') })}}/>}
            {(!this.props.isFin) && <span>{moment(data.paydate).format('YYYY-MMM-DD')}</span>}
          </Col>}
        </Row>
      </div>
    )
  }
}

export default Main
