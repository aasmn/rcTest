import React, { Component } from 'react'
import SearchForm from '@/erp/container/SearchForm'
// import BelongCompany from '@/erp/container/searchComponent/BelongCompany'
import { getListData, deleteData } from '@/erp/api'
import { Button, Tabs, Icon, message, Row, Col, Input } from 'antd'
// import HasPower from '@/erp/container/HasPower'
import OrderTable from '@/erp/container/Contract/OrderTable'
import _ from 'lodash'
import { fDate, fOrderSource, fOrderStatus } from '@/erp/config/filters'
import OrderDialog from '@/erp/container/Contract/OrderDialog'
import Dialog from '@/erp/container/Dialog'
import ReviewOrderDialog from '@/erp/container/Contract/ReviewOrderDialog'
import RIf from '@/erp/component/RIF'
import Confirm from '@/erp/component/Confirm'

const TabPane = Tabs.TabPane;

let search = {
  items: [{
      label: '甲方/联系人',
      type: 'text',
      field: 'companyname'
    },{
      label: '合同/订单号',
      type: 'text',
      field: 'contractNO'
    }, {
      label: '签单销售',
      type: 'text',
      field: 'OrderSalesName',
      more: true
    }, {
      label: '订单状态',
      type: 'select',
      field: 'orderStatus',
      data:{
        0: "全部",
        1: "审单待审核",
        2: "审单已审核",
        3: "审单驳回",
        4: "财务已审核/网店到款",
        5: "财务已驳回",
        6: "财务确认"
      },
      defaultValue: '0',
      more: true
    }, {
      label: '订单来源',
      type: 'select',
      field: 'orderSource',
      data:{
        0: "全部",
        1: "电销",
        2: "天猫"
      },
      defaultValue: '0',
      more: true
    },  {
      label: '签订日期',
      type: 'date',
      field: 'starttime',
      more: true
    }, {
      label: '至',
      type: 'date',
      field: 'endtime',
      more: true
    }, {
      label: '创建时间',
      type: 'date',
      field: 'createByStarttime',
      more: true
    }, {
      label: '至',
      type: 'date',
      field: 'createByEndtime',
      more: true
    }],
    buttons:[]
};

class Replenish extends Component {
  constructor(props){
    super(props);
    this.state={
      CompanyName: ''
    };
    this.next = this.next.bind(this)
  }
  getCompanyName = (id)=>{
    this.setState({
      loading: true
    });
    if(!id) return;
    getListData('order/GetCompanyName/'+ id).then(res=>{
      if(res.status && res.data){
        this.setState({
          CompanyName: res.data,
          agentId: id,
          loading: false
        });
      }else{
        // message.error("查不到公司");
        this.setState({
          agentId: '',
          loading: false
        })
      }
    })
  }
  next(){
    if(!this.state.agentId){
      message.info("请输入Agent公司ID");
      return;
    }
    this.props.next(this.state.agentId);
  }
  render(){
    return (
      [<Row>
        <Col span="6"><label className="ant-form-item-label">Agent公司ID</label></Col>
        <Col span="16" className="ant-form-item-control"><Input onPressEnter={e=>{this.getCompanyName(e.target.value)}}/>
          <div style={{color:'red'}}><small>注: 按回车查询公司名称</small></div>
        </Col>
      </Row>,
      <Row>
        <Col span="6"><label className="ant-form-item-label">Agent公司名称</label></Col>
        <Col span="16" className="ant-form-item-control"> <Input value={this.state.CompanyName} readOnly={true}/></Col>
      </Row>,
      <Row>
        <Col span="24" style={{textAlign: 'center'}}><Button onClick={this.next} loading={this.state.loading} type="primary" disabled={!this.state.agentId}>下一步</Button></Col>
      </Row>
      ]
    )
  }
}

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchParams: {}
    };
    this.onSearch = this.onSearch.bind(this);
    this.addNew = this.addNew.bind(this);
    this.viewOrder = this.viewOrder.bind(this);
    this.addNewRep = this.addNewRep.bind(this);
  }

  onSearch(res) {
    const params = {...res};
    params._id = _.uniqueId('sq_');
    this.setState({searchParams: params});
  }
  addNew(isRep=false){
    const dialog = Dialog({
        content: <OrderDialog handler={dialog} ref={e=>{ e && (e.handler = dialog)}} isRep={isRep}/>,
        width: 1100,
        confirmLoading: false,
        footer: null,
        title: '新增订单'
    })
    dialog.result.then((res)=>{
        this.onSearch(this.state.searchParams);
    },()=>{});
  }
  addNewRep(){
    const nextStep = (id)=>{
      dialog.close();
      this.addNew(id);
    }
    const dialog = Dialog({
        content: <Replenish next={nextStep}/>,
        width: 450,
        confirmLoading: false,
        footer: null,
        title: '查看订单'
    });
  }
  deleteOrder(row){
    Confirm({
        handleOk:()=>{
          deleteData('orders/' + row.OrderId).then(res => {
            if (res.status) {
              message.info('删除成功！');
              this.onSearch(this.state.searchParams)
            }
          })
        },
        message: '确认要删除吗？'
    })
    
  }
  viewOrder(row){
    const dialog = Dialog({
        content: <ReviewOrderDialog data={row} handler={dialog} ref={e=>{ e && (e.handler = dialog)}}/>,
        width: 1100,
        confirmLoading: false,
        footer: null,
        title: '查看订单'
    })
    dialog.result.then((res)=>{
        this.onSearch(this.state.searchParams);
    },()=>{});
  }
  render() {
    const columns = [{
      title: '订单号',
      dataIndex: 'OrderNo',
      width: 165,
      render:(val,record)=>{
        return (<div style={{position:"relative"}}>
                  <RIf if={record.OrderStatus< 4 || record.OrderStatus ===5 } key={val+'_1'}><Icon type="close-circle" className="list-close-icon" onClick={e=>{this.deleteOrder(record)}}/></RIf>
                  <a href="javascript:;" onClick={e=>this.viewOrder(record)} style={{float:'right'}}>{val}</a>
                  <RIf if={record.AgentCompanyId>0} key={val+'_2'}><span className="newFlag">补</span></RIf>
                </div>);
      }
    }, {
      title: '甲方',
      dataIndex: 'CompanyName',
      render:(val,record)=>{
        return <a href="javascript:;" onClick={e=>this.viewOrder(record)}>{val}</a>
      }
    }, {
      title: '联系人',
      dataIndex: 'Connector',
    }, {
      title: '签单销售',
      dataIndex: 'OrderSalesName',
    }, {
      title: '订单来源',
      dataIndex: 'SourceName'
    }, {
      title: '签订日期',
      dataIndex: 'ContractDate',
      render: val=> fDate(val)
    }, {
      title: '订单总金额',
      dataIndex: 'Amount',
    }, {
      title: '订单状态',
      dataIndex: 'OrderStatus',
      render: (val, record)=>fOrderStatus(record.OrderStatus,+record.OrderSourceId)
    }];
    search.buttons=[];
    return (
        <div>
          <SearchForm items={search.items} buttons={search.buttons} onSearch={this.onSearch}/>
          <Tabs defaultActiveKey="NOALL" >
            <TabPane tab="待处理订单" key="NOALL" forceRender={true}>
              <OrderTable SearchParams={this.state.searchParams} searchUrl="orders" columns={columns} isAll={false}/>
            </TabPane>
            <TabPane tab="全部订单" key="ALL" forceRender={true}>
              <OrderTable SearchParams={this.state.searchParams} searchUrl="orders" columns={columns} isAll={true}/>
            </TabPane>
          </Tabs>
        </div>
    );
  }
}

export default Main
