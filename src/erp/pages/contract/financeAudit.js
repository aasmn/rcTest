import React, { Component } from 'react'
import SearchForm from '@/erp/container/SearchForm'
import BelongCompany from '@/erp/container/searchComponent/BelongCompany'
// import { getListData } from '@/erp/api'
import { Button, Tabs } from 'antd'
import HasPower from '@/erp/container/HasPower'
import OrderTable from '@/erp/container/OrderTable'
import _ from 'lodash'
import {fOrderSource, fOrderStatus } from '@/erp/config/filters'
import Dialog from '@/erp/container/Dialog'
import FinanceOrderDialog from '@/erp/container/Contract/FinanceOrderDialog'
import $ from 'jquery'
// import moment from 'moment'
import { downLoad } from '@/erp/config/contractActions'
import RIf from '@/erp/component/RIF'
import  '@/erp/style/cos.less';
const TabPane = Tabs.TabPane;

let search = {
    items: [{
      label: '所属公司',
      type: 'custom',
      field: 'subsidiary',
      view: BelongCompany,
      defaultValue: '0',
      more: true
    }, {
        label: '订单号/合同编号',
        type: 'text',
        field: 'contractNO'
    }, {
        label: '甲方/联系人',
        type: 'text',
        field: 'companyname'
    }, {
        label: '订单来源',
        type: 'select',
        field: 'orderSourceId',
        data:{
          0: "全部",
          1: "电销",
          2: "天猫"
        },
        defaultValue: '0',
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
        label: '签单销售',
        type: 'text',
        field: 'OrderSalesName',
        more: true
    },  {
        label: '合同签订日期',
        type: 'date',
        field: 'starttime',
        more: true
    }, {
        label: '至',
        type: 'date',
        field: 'endtime',
        more: true
    }],
    buttons:[]
};

class Finance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchParams: {}
    };
    this.onSearch = this.onSearch.bind(this);
    this.export = this.export.bind(this);
    this.view = this.view.bind(this);
  }

  onSearch(res) {
    const params = _.cloneDeep(res)
    params._id = _.uniqueId('sq_');
    this.setState({searchParams: params});
  }

  export() {
    console.log(this.state.searchParams , 'download 参数')
    console.log(window.sessionStorage, 'window.sessionStorage')
    const Authorize = window.sessionStorage.getItem('token')
    var Params = _.cloneDeep(this.state.searchParams)
    Params.Authorize = Authorize
    if (Params.starttime === null) {
      Params.starttime = ''
    }
    if (Params.endtime === null) {
      Params.endtime = ''
    }
    var query = $.param(Params)
    query = '?' + query
    const url = '/api/download/financelist' + query
    downLoad(url,'合同数据.xls');
  }
  view(row) {
    const dialog = Dialog({
      content: <FinanceOrderDialog id={row.OrderId} data={row} ref={v=>{if(v) v.handler=dialog;}} readOnly={true}/>,
      width: 1100,
      confirmLoading: false,
      footer: null,
      title: '查看订单'
    })
    dialog.result.then(()=>{
      this.onSearch(this.state.searchParams);
    },()=>{});
  }

  render() {
    search.buttons=[(<HasPower power="EXPORT" key="btn_export"><Button style={{marginLeft: '10px'}} type="primary" onClick={this.export} >导出</Button></HasPower>)]
    const columns = [{
      title: '所属公司',
      dataIndex: 'SubsidiaryName',
    }, {
      title: '订单号',
      dataIndex: 'OrderNo',
      render:(val,record)=>{
        return (<div style={{position:"relative"}}>
          <a href="javascript:;" onClick={e=>{this.view(record)}}>{val}</a>
          <RIf if={record.AgentCompanyId>0} key={val+'_2'}><span className="newFlag">补</span></RIf>
        </div>);
      }
    }, {
      title: '甲方',
      dataIndex: 'CompanyName',
      render: (val,record) => (<a href="javascript:;" onClick={e=>{this.view(record)}}>{val}</a>)
    }, {
      title: '联系人',
      dataIndex: 'Connector',
    }, {
      title: '签单销售',
      dataIndex: 'OrderSalesName',
    }, {
      title: '订单来源',
      dataIndex: 'OrderSourceId',
      render: val=> fOrderSource(val)
    }, {
      title: '签订日期',
      dataIndex: 'ContractDate',
    }, {
      title: '订单总金额',
      dataIndex: 'Amount',
    }, {
      title: '订单状态',
      dataIndex: 'OrderStatus',
      render: (val, record)=> fOrderStatus(val, record.OrderSourceId)
    }];
    return (
        <div>
          <SearchForm items={search.items} buttons={search.buttons} onSearch={this.onSearch}/>
          <Tabs defaultActiveKey="NOALL" onChange={this.callback}>
            <TabPane tab="待处理订单" key="NOALL" forceRender={true}>
              <OrderTable SearchParams={this.state.searchParams} SearchUrl={'order/financelist'} columns={columns} isAll={false}/>
            </TabPane>
            <TabPane tab="全部订单" key="ALL" forceRender={true}>
              <OrderTable SearchParams={this.state.searchParams} SearchUrl={'order/financelist'} columns={columns} isAll={true}/>
            </TabPane>
          </Tabs>
        </div>
    );
  }
}

export default Finance
