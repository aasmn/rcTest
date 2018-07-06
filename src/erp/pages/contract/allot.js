import React, { Component } from 'react'
import SearchForm from '@/erp/container/SearchForm'
// import BelongCompany from '@/erp/container/searchComponent/BelongCompany'
// import { getListData } from '@/erp/api'
import { Tabs } from 'antd'
// import HasPower from '@/erp/container/HasPower'
import OrderTable from '@/erp/container/Contract/OrderTable'
import _ from 'lodash'
import { fDate, fServiceStatus, fCheckStatus, fAccountantStatus } from '@/erp/config/filters'

import Dialog from '@/erp/container/Dialog'

import ServiceStatusSelect from '@/erp/container/searchComponent/ServiceStatusSelect'

import AreaSelect from '@/erp/container/searchComponent/AreaSelect'
import AllotDialog from '@/erp/container/Contract/AllotDialog'
import RIf from '@/erp/component/RIF'


const TabPane = Tabs.TabPane;

let search = {
    items: [{
      label: '甲方/联系人',
      type: 'text',
      field: 'companyname'
    }, {
      label: '订单号/合同编号',
      type: 'text',
        field: 'contractNO'
    }, {
        label: '所属区（县）',
        type: 'custom',
        field: 'areacode',
        view: AreaSelect,
        defaultValue: '',
        more: true
    }, {
        label: '联系人',
        type: 'text',
        field: 'contact',
        more: true
    }, {
        label: '当前负责销售',
        type: 'text',
        field: 'SalesName',
        more: true
    }, {
        label: '服务状态',
        type: 'custom',
        field: 'serviceStatus',
        view: ServiceStatusSelect,
        more: true
    }, {
        label: '外勤处理状态',
        type: 'select',
        field: 'outworkStatus',
        data:{
            0: "全部",
            1: "待审核",
            2: "已审核",
            3: "已驳回",
            5: "已提交"
        },
        more: true
    }, {
      label: '会计处理状态',
      type: 'select',
      field: 'accountantStatus',
      data:{
        0: "全部",
        1: "待审核",
        2: "已审核",
        3: "已驳回",
        5: "部分审核"
      },
      defaultValue: '',
      more: true
    }, {
        label: '签订日期',
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

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchParams: {}
    };
    this.onSearch = this.onSearch.bind(this);
    this.viewOrder = this.viewOrder.bind(this);
  }

  onSearch(res) {
    if(!res) res = this.state.searchParams;
    const params = {...res};
    params._id = _.uniqueId('sq_');
    this.setState({searchParams: params});
  }
  viewOrder(row){
     const dialog = Dialog({
          content: <AllotDialog  row={row} ref={v=>{ v && (v.handler = dialog)}} refreshTable={this.onSearch}/>,
          width: 1100,
          confirmLoading: false,
          footer: null,
          title: row.CompanyName
      })
      dialog.result.then(()=>{
        this.onSearch(this.state.searchParams);
      },()=>{
        // this.onSearch(this.state.searchParams);
      });
  }
  render() {
    const columns = [{
      title: '订单号',
      dataIndex: 'OrderNo',
      render:(val,record)=>{
        return (<div style={{position:"relative"}}>
                  <a href="javascript:;" onClick={this.viewOrder.bind(this,record)}>{val}</a>
                  <RIf if={record.AgentCompanyId>0} key={val+'_2'}><span className="newFlag">补</span></RIf>
                </div>);
      }
    }, {
      title: '公司名称',
      dataIndex: 'CompanyName',
      render: (val,record)=>{
        return <a href="javascript:;" onClick={this.viewOrder.bind(this,record)}>{val}</a>;
      }
    }, {
      title: '所属区域',
      dataIndex: 'AreaName',
    }, {
      title: '当前负责销售',
      dataIndex: 'SalesName',
    }, {
      title: '签订日期',
      dataIndex: 'ContractDate',
      render: val=> fDate(val)
    }, {
      title: '服务状态',
      dataIndex: 'ServiceStatus',
      render: val=>fServiceStatus(val)
    }, {
      title: '外勤处理状态',
      dataIndex: 'OutWorkerStatus',
      render: val=>fCheckStatus(val)
    }, {
      title: '会计处理状态',
      dataIndex: 'AccountantStatus',
      render: val=>fAccountantStatus(val)
    }];

    return (
        <div>
          <SearchForm items={search.items} buttons={search.buttons} onSearch={this.onSearch}/>
          <Tabs defaultActiveKey="NOALL">
            <TabPane tab="待处理订单" key="NOALL" forceRender={true}>
              <OrderTable SearchParams={this.state.searchParams} searchUrl="taskdistributionlist" columns={columns} isAll={false}/>
            </TabPane>
            <TabPane tab="全部订单" key="ALL" forceRender={true}>
              <OrderTable SearchParams={this.state.searchParams} searchUrl="taskdistributionlist" columns={columns} isAll={true}/>
            </TabPane>
          </Tabs>
        </div>
    );
  }
}

export default Main
