import React, { Component } from 'react'
import { Row, Col, Input, Button, Table, DatePicker, Icon, message } from 'antd'
import moment from 'moment'
import _ from 'lodash'
import UploadFile from '@/erp/container/UploadFile'
import { getListData, putData, postData } from '@/erp/api'
import '@/erp/style/channel.less'

class RechargeAmount extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentWillReceiveProps(nextProps){
    this.setState({
      amount: nextProps.data,
      showOther: (nextProps.data == 5000 || nextProps.data == 10000)? false: true
    })
  }
  getValue = ()=>{
    if(!(this.state.amount>=0)){
      message.error('请选择充值金额！')
      return null;
    } 
    return this.state.amount
  }
  render() {
    const state = this.state;
    return (
      <Button.Group>
        <Button onClick={e => { this.setState({ amount: 5000 }) }} type={state.amount === 5000 ? 'primary' : 'default'}>5000</Button>
        <Button onClick={e => {this.setState({amount: 10000})}} type={state.amount === 10000 ? 'primary' : 'default'}>10000</Button>
        <Button onClick={e => { this.setState({ showOther: true, amount:0})}} type={(state.showOther && state.amount !== 5000 && state.amount !== 10000)? 'primary' : 'default'  }>更多</Button>
        {state.showOther && (<Input type="text" value={state.amount} onChange={e => { this.setState({ amount: parseInt(e.target.value,10) || 0 }) }} style={{ width: '100px', borderRadius:0 }}/>)}
      </Button.Group>
    )
  }
}

class RechargeDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [{}]
    }
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      data: nextProps.data
    })
  }
  deleteRow = (index)=>{
    let data = _.cloneDeep(this.state.data);
    data.splice(index,1);
    this.setState({ data });
  }
  addRow = ()=>{
    let data = _.cloneDeep( this.state.data);
    data.push({});
    this.setState({data});
  }
  getValue = () => {
    const length = this.state.data.length;
    for(let i = 0; i<length-1; i++){
      let item = this.state.data[i];
      if (!item.AccountOfPayment){
        message.error('付款账户不能为空！')
        return null;
      }
      if (!item.PayTime) {
        message.error('付款时间不能为空！')
        return null;
      }
      if (!item.Amount) {
        message.error('付款金额不能为空！')
        return null;
      }
    }
    return this.state.data;
  }
  render() {
    const state = this.state;
    const props = this.props;
    const columns = [{
      title: '*付款账户',
      dataIndex: 'AccountOfPayment',
      render: (val,row) =>{
        return <Input type='text' defaultValue={val} onChange={(e) => { row.AccountOfPayment = e.target.value}} readOnly={props.readOnly}/>
      }
    }, {
      title: '*付款时间',
      dataIndex: 'PayTime',
      render: (val, row) => {
        return <DatePicker defaultValue={val && moment(val)} onChange={(e) => { row.PayTime = e && e.format('YYYY-MM-DD') }} readOnly={props.readOnly} />
      }
    }, {
      title: '*付款金额(元)',
      dataIndex: 'Amount',
      render: (val, row) => {
        return <Input type='text' defaultValue={val} onChange={(e) => { row.Amount = e.target.value }} readOnly={props.readOnly} />
      }
    }, {
      title: '操作',
      width: 160,
      render: (val,row,index)=>{
        if(props.readOnly) return null;
        return (<div>
          {state.data.length > 1 && <Button onClick={e=>this.deleteRow(index)}>删除</Button>}
          {(index + 1 ) === state.data.length && <Button onClick={e=>this.addRow()}>添加</Button>}
        </div>)
      }
    }];
    return (
      <Table columns={columns}
        rowKey={record => _.uniqueId('r_')}
        dataSource={state.data}
        pagination={false}
        size="middle"
        bordered={true}
      />

    )
  }
}

class RechargeImgs extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [null]
    }
  }
  deleteRow = (index) => {
    let data = _.cloneDeep(this.state.data);
    data.splice(index, 1);
    this.setState({ data });
  }
  addRow = (path,index) => {
    let data = _.cloneDeep(this.state.data);
    data[index] = path
    data.push(null);
    this.setState({ data });
  }
  getValue = ()=>{
    const str = this.state.data.join(',')
    if(!str){
      message.error('请上传付款凭证');
      return null;
    }
    return str;
  }
  componentWillReceiveProps(nextProps) {
    if (!nextProps.data) return
    let data = nextProps.data.split(',')
    data = _.compact(_.map(data,t=>{
      if(t.length>5) return t;
      return null;
    }))
    if (!nextProps.readOnly){
      data.push(null)
    }
    this.setState({
      data: data
    })
  }
  render() {
    const data = this.state.data;
    return (
      <div className="recharge-upload">
        {data.map((item,index)=>{
          return (<div key={_.uniqueId('img_')} className="recharge-upload-item">
            {item && !this.props.readOnly && <Icon type="close-circle" onClick={e => this.deleteRow(index)} />}
            <UploadFile value={item} onChange={e=>this.addRow(e,index)}/>
          </div>)
        })}
        
      </div>
    )
  }
}

class Main extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {},
      Remark: ''
    }
    this.fetchData()
  }
  fetchData = (e) => {
    const data = this.props.data;
    if(data && data.Id){
      getListData('finance/getprepai?id=' + data.Id).then(res=>{
        if(res.status){
          this.setState({
            Remark: res.data.Remark,
            data: res.data
          })
        }
      })
    }
  }
  getFieldsValue = () => {
    const amount = this.refs.amount.getValue();
    const detail = this.refs.detail.getValue();
    const imgs = this.refs.imgs.getValue();
    let sumamount = 0
    if(!amount) return;
    if(!detail) return;
    if(!imgs) return;
    if (amount < 5000) {
      message.error('充值金额最少为5000元')
      return
    }
    _.each(detail, item => {
      sumamount += Number(item.Amount)
    })
    if (amount !== sumamount) {
      message.error('充值金额与付款金额合计不相等！')
      return
    }
    return _.extend({} ,this.state.data,{
      Amount: amount,
      PrepayDetails: detail,
      PhotoPath: imgs,
      Remark: this.Remark
    })
  }
  setRemark = (r)=>{
    this.Remark = r
  }
  render() {
    const labelStyle = {
      lineHeight: '32px'
    }
    const state = this.state
    return (
      <div>
        <Row>
          <Col span={3}>
            <label style={labelStyle} className="required">充值金额:</label>
          </Col>
          <Col span={21}> <RechargeAmount data={state.data.Amount} readOnly={this.props.readOnly} ref="amount"/></Col>
        </Row>
        <Row>
          <Col span={3}>
            <label style={labelStyle} className="required">付款明细:</label>
          </Col>
          <Col span={21}> <RechargeDetail data={state.data.PrepayDetails} readOnly={this.props.readOnly} ref="detail" /></Col>
        </Row>
        <Row>
          <Col span={3}>
            <label style={labelStyle} className="required">付款凭证:</label>
          </Col>
          <Col span={21}> 
            <RechargeImgs data={state.data.PhotoPath} readOnly={this.props.readOnly} ref="imgs"/>
            <div>上传的图片大小请不要超过3M,支持多次上传</div>
          </Col>
        </Row>
        <Row>
          <Col span={3}>
            <label style={labelStyle}>备&nbsp;&nbsp;&nbsp;&nbsp;注:</label>
          </Col>
          <Col span={21}> <Input.TextArea readOnly={this.props.readOnly} defaultValue={this.state.Remark} onChange={e=>{this.setRemark(e.target.value)}}></Input.TextArea></Col>
        </Row>
      </div>
    )
  }
}
export default Main
