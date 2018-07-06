import React, { Component } from 'react'
import SearchForm from '@/erp/container/SearchForm'
import { Tabs } from 'antd'
import OrderTable from '@/erp/container/Contract/OrderTable'
import _ from 'lodash'
import AreaSelect from '@/erp/container/searchComponent/AreaSelect'
import { connect } from 'react-redux'
import { fServiceStatus, fAccountantStatus, fAssigningObject } from '@/erp/config/filters'
import Dialog from '@/erp/container/Dialog'
// import store from '@/erp/store'
// import AccountDetailDialog from '@/erp/container/Contract/AccountDetailDialog'
import RIf from '@/erp/component/RIF'
import ViewTaskDialog from '@/erp/container/task/ViewTaskDialog'
import AccountReview from '@/erp/container/task/AccountReview'

const TabPane = Tabs.TabPane;
let search = {
    items: [ {
      label: '甲方/联系人',
      type: 'text',
      field: 'companyName',
      tab: '12'
    }, {
      label: '合同/任务单号',
      type: 'text',
      field: 'contractNO',
      tab: '12'
    },{
      label: '销售人员',
      type: 'text',
      field: 'salesName',
      more: true,
      tab: '12'
    }, {
      label: '所属区域',
      type: 'custom',
      field: 'areaCode',
      view: AreaSelect,
      defaultValue: '',
      more: true,
      tab: '12'
    },{
        label: '任务状态',
        type: 'select',
        field: 'taskStatus',
        data: {
            0: "全部",
            1: "未开始",
            2: "外勤服务",
            3: "会计服务",
            4: "外勤会计服务",
            5: "结束",
            6: "中止"
        },
        defaultValue: 0,
        more: true,
        tab: '2'
    },{
      label: '分配对象',
      type: 'select',
      field: 'assigningobject',
      data:{
        0:"全部",
        2: "会计",
        1: "外勤",
        3: "会计外勤"
      },
      defaultValue: '',
      tab: '12',
      more: true
    },{
      label: '会计审核状态',
      type: 'select',
      field: 'accountantStatus',
      data: [{ id: ' ', label: "全部" },
        { id: '1', label: "待审核" },
        { id: '2', label: "已审核" },
        { id: '3', label: "已驳回" },
        { id: '5', label: "部分审核" },
        { id: '-1', label: "其他" }
      ],
      defaultValue: '',
      more: true,
      tab: '2'
    }, {
      label: '有无财务服务',
      type: 'select',
      field: 'isAccount',
      data:{
        0:"全部",
        1: "有",
        2: "无"
      },
      defaultValue: '',
      more: true,
      tab: '2'
    }, {
      label: '创建日期',
      type: 'date',
      field: 'starttime',
      tab: '1',
      more: true
    }, {
      label: '至',
      type: 'date',
      field: 'endtime',
      tab: '1',
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
    this.onSearch1 = this.onSearch1.bind(this);
    this.onSearch2 = this.onSearch2.bind(this);
  }

  onSearch() {
    this.onSearch1(this.state.searchParams1);
    this.onSearch2(this.state.searchParams2);
  }
  onSearch1(res) {
    if (!res) res = this.state.searchParams1;
    const params = { ...res };
    params._id = _.uniqueId('sq_');
    this.setState({ searchParams1: params });

  }
  onSearch2(res) {
    if (!res) res = this.state.searchParams2;
    const params = { ...res };
    params._id = _.uniqueId('sq_');
    this.setState({ searchParams2: params });

  }
  accountview(row){
    const content = (<div>
      {row.AccountantStatus ===1 && <AccountReview data={row} id={row.TaskBillId} close={() => { dialog.close()}}/>}
      <ViewTaskDialog readOnly={true} row={row} close={v => { dialog.close(true) }} />
    </div>);

    const dialog = Dialog({
      content: content,
      width: 1100,
      confirmLoading: false,
      footer: null,
      title: row.CompanyName
    })
    dialog.result.then(() => {
      this.onSearch(this.state.searchParams);
    }, () => {
      // this.onSearch(this.state.searchParams);
    });
  }

  render() {
    const columns = [{
      title: '任务单号',
      dataIndex: 'TaskBillNo',
      tab: '12',
      render:(val,record)=>{
        return (<div style={{position:"relative"}}>
          <a href="javascript:;" onClick={e=>{this.accountview(record)}}>{val}</a>
          <RIf if={record.AgentCompanyId>0}><span className="newFlag">补</span></RIf>
          <RIf if={record.ContractNature}><span className="newFlag" style={{ left: 0, top: 0, right: 'auto' }}>{record.ContractNature}</span></RIf>
        </div>);
      }
    }, {
      title: '甲方',
      dataIndex: 'CompanyName',
      tab: '12',
      render: (val,record) => {
        let part;
        if(record.PartTax>0){
          part = record.PartTax === 1? '国税': '地税'
        }
        return <div>
            <a href="javascript:;" onClick={e=>{this.accountview(record)}}>{val}</a>
            <RIf if={part}><span className="taxFlag">{part}</span></RIf>
          </div>
      }
    }, {
      title: '联系人',
      tab: '12',
      dataIndex: 'Connector',
    }, {
      title: '任务状态',
      dataIndex: 'ServiceStatus',
      render: fServiceStatus,
      tab: '12'
    }, {
      title: '分配对象',
      dataIndex: 'AssigningObject',
      render: (val)=>{
        if(val == 1){
          return <span style={{ color:'#1890ff'}}>{fAssigningObject(val)}</span>;
        }
        return fAssigningObject(val);
      },
      tab: '12',
    }, {
      title: '会计审核状态',
      dataIndex: 'AccountantStatus',
      render: val=> fAccountantStatus(val),
      tab: '2',
    }];
    const searchItems1 = _.filter(search.items, t => (t.tab.indexOf('1') > -1));
    const searchItems2 = _.filter(search.items, t => (t.tab.indexOf('2') > -1));
    const columns1 = _.filter(columns, t => (t.tab.indexOf('1') > -1));
    const columns2 = _.filter(columns, t => (t.tab.indexOf('2') > -1));
    return (
        <div>
          <Tabs defaultActiveKey="NOALL" onChange={this.callback} >
            <TabPane tab="待处理" key="NOALL" forceRender={true}>
              <SearchForm items={searchItems1} buttons={search.buttons} onSearch={this.onSearch1} ref="searchForm" />
              <OrderTable SearchParams={this.state.searchParams1} searchUrl={'order/audit/list'} columns={columns1} isAll={false}/>
            </TabPane>
            <TabPane tab="全部任务单" key="ALL" forceRender={true}>
              <SearchForm items={searchItems2} buttons={search.buttons} onSearch={this.onSearch2} ref="searchForm" />
              <OrderTable SearchParams={this.state.searchParams2} searchUrl={'order/audit/list'} columns={columns2} isAll={true}/>
            </TabPane>
          </Tabs>
        </div>
    );
  }
}

export default connect(({account}) => {
  return {
    account
  }
})(Finance)
