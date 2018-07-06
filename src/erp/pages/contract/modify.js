import React, { Component } from 'react'
import { getListData, postData } from '@/erp/api'
import { Table, Button, Select, message, Row, Input, Form, Spin, Checkbox } from 'antd'
import { fDate, fAgentStatus, fOrderStatus, fAccountantStatus, fCheckStatus, fServiceStatus, fContractStatus} from '@/erp/config/filters'
import Dialog from '@/erp/container/Dialog'
import Title from '@/erp/component/Title'
import ContractModify from '@/erp/container/Contract/ContractModify'
import _ from 'lodash'
import HasPower from '@/erp/container/HasPower'

const Option = Select.Option;
const FormItem = Form.Item;

let timeout;
let currentValue;

function fetch(value, callback) {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  currentValue = value;
  function fake() {
    getListData(`customer/namelist?name=@/erp{value}&size=9999`)
      .then((d) => {
        if (currentValue === value) {
          const result = d.data;
          const data = [];
          result.forEach((r) => {
            data.push({
              value: r.Id,
              text: r.CompanyName,
            });
          });
          callback(data);
        }
      });
  }
  timeout = setTimeout(fake, 300);
}
class SearchInput extends React.Component {
  state = {
    data: [],
    value: '',
  }
  handleChange = (value) => {
    this.setState({ value });
    fetch(value, data => {
      // this.setState({ value });
      this.setState({ data })
    });
  }
  onSelect= (item)=>{
    this.setState({value: this.state.data.find(t=>t.value==item).text});
    getListData('customer/detailswithcontract/'+ item).then(res=>{
      if(res.status){
        this.props.onSelect(res.data)
      }
    })
  }
  render() {
    const options = this.state.data.map(d => <Option key={d.value}>{d.text}</Option>);
    return (
      <Select
        style={{width:'400px'}}
        mode="combobox"
        value={this.state.value}
        placeholder={this.props.placeholder}
        defaultActiveFirstOption={false}
        showArrow={false}
        filterOption={false}
        onSearch={this.handleChange}
        onSelect={this.onSelect}
      >
        {options}
      </Select>
    );
  }
}


const fIsassign = function(status) {
  var str = ''
  switch (+status) {
      case 0:
          str = '未分配'
          break;
      case 1:
          str = '已分配'
          break;
  }
  return str
}
const fRecall = function(status) {
  var str = ''
  switch (+status) {
      case 1:
          str = '否'
          break;
      case 0:
          str = '是'
          break;
  }
  return str
}
class AgentArea extends React.Component {
  render() {
    const data = this.props.data;
    if(!data) return null;
    return (
     <Row>
       <Title title="Agent记账数据"/>
       <label>开始记账日期</label>：{fDate(data.BusinessDate)}，
       <label>主办会计</label>：{data.AccountantName}，
       <label>记账状态</label>：{fAgentStatus(data.Status)}，
       <label>是否分配</label>：{fIsassign(data.isassign)}，
       <label>是否建账</label>：{fRecall(data.recall)}
     </Row>
    );
  }
}
class FormSelect extends React.Component {
  render(){
    return (
    <Select value={''+this.props.value} style={{minWidth: '200px'}} onChange={e=>{this.props.onChange(e)}}>
      {this.props.children}
    </Select>
    );
  }
}
class CompanyForm extends React.Component {
  state={
    companyList:[],
    salerList:[]
  }
  componentWillMount() {
    Promise.all([getListData('subsidiary?citycode='+ this.props.data.CityCode),
      getListData('order/sales?subsidiaryId='+ this.props.data.SubsidiaryId)
    ]).then(res=>{
      this.setState({
        companyList: res[0].data,
        salerList: res[1].data,
        loading: false
      })
    });
  }
  changeCompany = (v)=>{
    this.props.form.setFieldsValue({
      SalesId: ''
    })
    getListData('order/sales?subsidiaryId='+ v).then(res=>{
      this.setState({
        salerList: res.data
      })
    })
  }
  render() {
    if(this.state.loading) return <Spin/>;
    let data = this.props.data;
    const props = this.props;
    const { getFieldDecorator } = props.form;
    return (
      <div>
        <Title title="公司数据"/>
        <Form layout="inline">
            <FormItem
              label="所属公司"
            >
              {getFieldDecorator('SubsidiaryId', {
                initialValue: data.SubsidiaryId
              })(
                <FormSelect onChange={this.changeCompany}>
                  {this.state.companyList.map(item=>{
                    return <Option key={item.Id} value={''+ item.Id}>{item.CompanyName}</Option>
                  })}
                </FormSelect>
              )}
            </FormItem>
            <FormItem
              label="公司名称"
            >
              {getFieldDecorator('CompanyName', {
                initialValue: data.CompanyName
              })(
                <Input disabled />
              )}
            </FormItem>
            <FormItem
              label= '联系人'
            >
              {getFieldDecorator('Connector', {
                initialValue: data.Connector
              })(
                <Input/>
              )}
            </FormItem>
            <FormItem
              label="联系电话"
            >
              {getFieldDecorator('Mobile', {
                initialValue: data.Mobile
              })(
                <Input/>
              )}
            </FormItem>
            <FormItem
              label="当前负责销售"
            >
              {getFieldDecorator('SalesId', {
                initialValue: data.SalesId
              })(
                <FormSelect>
                  {this.state.salerList.map(item=>{
                    return <Option key={item.Id} value={item.Id}>{item.RealName}</Option>
                  })}
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
                  <Option key="1" value="1">未开始</Option>
                  <Option key="2" value="2">挂起</Option>
                  <Option key="3" value="3">服务中</Option>
                </FormSelect>
              )}
            </FormItem>
            <FormItem 
              label="纳税人类别">
                {getFieldDecorator('AddedValue', {
                initialValue: data.AddedValue,
              })(
              <FormSelect disabled>
                  <Option key="1" value="1">小规模</Option>
                  <Option key="2" value="2">一般纳税人</Option>
                </FormSelect>
              )}
            </FormItem>
            <FormItem label="">
              {getFieldDecorator('IsTb', {
                initialValue: data.IsTb,
              })(
                <Checkbox>同步首报月</Checkbox>
                )}
            </FormItem>
          </Form>
        </div>)
  }
}

class OrderArea extends React.Component {
  editOrder = (item,index)=>{
    const dialog = Dialog({
          content: <ContractModify data ={item} subId={this.props.subId} ref={v=>{ v && (v.handler = dialog,this.contract = v )}}/>,
          width: 1100,
          confirmLoading: false,
          footer: null,
          title: '修改订单'
      })
      dialog.result.then((res)=>{
        this.props.onChange(res,index)
      },()=>{
        // this.onSearch(this.state.searchParams);
      });
  }
  deleteOrder = (index)=>{
    if(!window.confirm('确定要删除订单？？？')) return;
    this.props.deletOrder(index)
  }
  render() {
    const data = this.props.data;

    data.forEach(item=>{
      let amount = {BookKeepFeed: 0,
        FinanceServiceFeed: 0,
        OutWorkServiceFeed: 0,
        AgentFeed: 0
      };
      // item.CrmOrderItems =item.OrderItems;
      amount.AgentFeed = (_.find(item.CrmOrderItems,{MainItemId:1}) || {}).Amount || 0;
      amount.FinanceServiceFeed = (_.find(item.CrmOrderItems,{MainItemId:2}) || {}).Amount || 0;
      amount.OutWorkServiceFeed = (_.find(item.CrmOrderItems,{MainItemId:3}) || {}).Amount || 0;
      amount.BookKeepFeed = (_.find(item.CrmOrderItems,{MainItemId:4}) || {}).Amount || 0;
      item = _.extend(item,amount);
    });
    
    

    const columns1 = [{
            title: '订单编号',
            dataIndex: 'OrderNo',
        }, {
            title: '订单总金额',
            dataIndex: 'Amount',
        }, {
            title: '会计服务费',
            dataIndex: 'AgentFeed',
        }, {
            title: '财务服务费',
            dataIndex: 'FinanceServiceFeed'
        }, {
            title: '外勤服务费',
            dataIndex: 'OutWorkServiceFeed'
        }, {
            title: '代收费用',
            dataIndex: 'BookKeepFeed'
        }, {
            title: '签单销售',
            dataIndex: 'OrderSalesName',
        }, {
            title: '签订日期',
            dataIndex: 'ContractDate',
            render: val=> fDate(val)
        }, {
            title: '订单创建时间',
            dataIndex: 'CreateDate',
            render: val=> fDate(val)
        }, {
            title: '订单状态',
            dataIndex: 'OrderStatus',
            render: (val,row)=> fOrderStatus(val,row.OrderSourceId)
        }, {
            title: '服务状态',
            dataIndex: 'ServiceStatus',
            render: val=> fServiceStatus(val)
        }, {
            title: '外勤服务状态',
            dataIndex: 'OutWorkerStatus',
            render: val=> fCheckStatus(val)
        }, {
            title: '会计审核状态',
            dataIndex: 'AccountantStatus',
            render: val=> fAccountantStatus(val)
        }];
      const columns2 = [{
            title: '合同编号',
            dataIndex: 'ContractNo',
        }, {
            title: '项目',
            dataIndex: 'MainItemName',
        }, {
            title: '子项目',
            dataIndex: 'ChildItemName',
        }, {
            title: '费用',
            dataIndex: 'Amount'
        }, {
            title: '合同期限',
            dataIndex: 'OrderMonths'
        }, {
            title: '赠送礼包',
            dataIndex: 'GiftMonths',
        }, {
            title: '服务开始时间',
            dataIndex: 'ServiceStart',
            render: val=> fDate(val)
        }, {
            title: '服务结束时间',
            dataIndex: 'ServiceEnd',
            render: val=> fDate(val)
        }, {
            title: '合同状态',
            dataIndex: 'Status',
          render: (val, row) => fContractStatus(val)
        }];
    return (
    <div>
      <Title title="订单数据"/>
      {data.map((item,index)=>{return (
        <Row key={item.OrderId}>
          <Table columns={columns1}
              rowKey={record => record.OrderId}
              dataSource={[item]}
              pagination={false}
              size="small"
              bordered={true}
          />  
          <Table columns={columns2}
              rowKey={record => record.OrderItemId}
              dataSource={item.CrmOrderItems}
              pagination={false}
              size="small"
              bordered={true}
              style={{width:'80%'}}
          />  
          <div style={{textAlign: 'center'}}>
            <Button type="primary" style={{margin:'0 8px'}} onClick={e=>this.editOrder(item,index)}>修改</Button>
            {item.AccountantStatus != 2 && <Button type="primary" style={{margin:'0 8px'}} onClick={e=>this.deleteOrder(index)}>删除</Button>}
          </div>
        </Row>)
      })}
    </div>
    );
  }
}

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null
    };
    this.setData = this.setData.bind(this);
    this.OrdersChange = this.OrdersChange.bind(this)
    this.deletOrder = this.deletOrder.bind(this)
    this.onSave = this.onSave.bind(this)
  }
  setData(res) {
    this.setState({
      data: res
    })
  }
  OrdersChange(order,index){
    let data = _.cloneDeep(this.state.data);
    data.Orders[index] = order;
    this.setState({data})
  }
  deletOrder(index){
    let data = _.cloneDeep(this.state.data);
    data.Orders.splice(index,1);
    this.setState({data})
  }
  onSave(){
    let companyData = this.company.props.form.getFieldsValue();
    const data = _.extend(this.state.data, companyData);
    if(data.CustomerStatusInAgent && data.CustomerStatusInAgent.recall == 0){
      if(!window.confirm('该公司已建账，是否确认要保存？')) return;
    }
    const tb = companyData.IsTb? '': '2';
    postData(`customer/detailswithcontract/save?TypeExchange=@/erp{tb}`,data).then(res=>{
      if(res.status){
        message.info('保存成功！')
      }
    })
  }
  render() {
    const CompanyArea = Form.create()(CompanyForm);
    return(
      <div>
        <SearchInput onSelect={this.setData}/>
        {this.state.data &&(
          <div>
            <AgentArea data={this.state.data.CustomerStatusInAgent}/>
            <CompanyArea wrappedComponentRef={v=> this.company=v} data={this.state.data}/>
            <OrderArea data={this.state.data.Orders} subId={this.state.data.SubsidiaryId} onChange={this.OrdersChange} deletOrder={this.deletOrder}/>
            <div style={{ textAlign: 'center' }}><HasPower power="SAVE"><Button type="primary" onClick={this.onSave}>保存</Button></HasPower></div>
          </div>
        )}
      </div>
    )
  }
}

export default Main
