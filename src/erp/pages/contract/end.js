import React, { Component } from 'react'
import SearchForm from '@/erp/container/SearchForm'


// import { Tabs } from 'antd'

import OrderTable from '@/erp/container/Contract/OrderTable'

import { fDate } from '@/erp/config/filters'

import Dialog from '@/erp/container/Dialog'


import OrderDialog from '@/erp/container/Contract/OrderDialog'


let search = {
    items: [ {
        label: '公司名称',
        type: 'text',
        field: 'companyname'
    },  {
        label: '销售',
        type: 'text',
        field: 'OrderSalesName',
        more: true
    },{
        label: '合同结束期',
        type: 'select',
        field: 'contractEndPeriod',
        data:{
          0: "全部",
          1: "近一个月",
          2: "近两个月",
          3: "近三个月"
        },
        more: true
    }, {
        label: '合同签订日期',
        type: 'date',
        field: 'contractDateStart',
        more: true
    }, {
        label: '至',
        type: 'date',
        field: 'contractDateEnd',
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
    this.setState({searchParams: res});
  }
  viewOrder(row){
     const dialog = Dialog({
         content: <OrderDialog id={row.OrderId} readOnly={true}/>,
          width: 1100,
          confirmLoading: false,
          footer: null,
          title: row.CompanyName
      })
      dialog.result.then(()=>{
          this.onSearch()
      },()=>{});
  }
  render() {
    const columns = [{
      title: '合同编号',
      dataIndex: 'ContractNo',
      render: (val,record)=>{
        return <a href="javascript:;" onClick={this.viewOrder.bind(this,record)}>{val}</a>;
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
      title: '公司联系人',
      dataIndex: 'Connector',
    }, {
      title: '销售人员',
      dataIndex: 'OrderSalesName'
    }, {
      title: '合同签订日期',
      dataIndex: 'ContractDate',
      render: val=>fDate(val)
    }, {
      title: '服务开始',
      dataIndex: 'ServiceStart',
      render: val=>fDate(val)
    }, {
      title: '服务结束',
      dataIndex: 'ServiceEnd',
      render: val=>fDate(val)
    }];
    
    return (
        <div>
          <SearchForm items={search.items} buttons={search.buttons} onSearch={this.onSearch}/>
          <OrderTable SearchParams={this.state.searchParams} searchUrl="order/expire/list" columns={columns} isAll={true}/>
        </div>
    );
  }
}

export default Main
