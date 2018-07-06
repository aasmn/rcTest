import React, { Component } from 'react'
import SearchForm from '@/erp/container/SearchForm'
import { getListData } from '@/erp/api'
import { message, Table, Button } from 'antd'

// import OrderTable from '@/erp/container/Contract/OrderTable'

import _ from 'lodash'
import { fDate, fServiceStatus, fContractStatus } from '@/erp/config/filters'

import Dialog from '@/erp/container/Dialog'

import ServiceStatusSelect from '@/erp/container/searchComponent/ServiceStatusSelect'
import SalerSelect from '@/erp/container/searchComponent/SalerSelect'

import OrderViewDialog from '@/erp/container/Contract2/OrderViewDialog'
import CustomerViewDialog from '@/erp/container/Contract2/CustomerViewDialog'
import DiscontinueDialog from '@/erp/container/Contract2/DiscontinueDialog'
import LingYongDialog from '@/erp/container/Contract2/LingYongDialog'
import ContractChangeDailog from '@/erp/container/Contract/ContractChangeDailog'
import RIf from '@/erp/component/RIF'



// const TabPane = Tabs.TabPane;

let search = {
  items: [{
    label: '甲方/联系人',
    type: 'text',
    field: 'contracts'
  }, {
    label: '合同/订单编号',
    type: 'text',
    field: 'contractNo'
  }, {
    label: '签单/负责销售',
    type: 'custom',
    field: 'sales',
    view: SalerSelect,
    more: true
  }, {
    label: '合同类型',
    type: 'select',
    field: 'contractType',
    data: {
      ' ': "全部",
      1: "记账报税",
      2: "增值",
      3: "代收"
    },
    more: true
  }, {
    label: '记账子项目',
    type: 'select',
    field: 'childItemId',
    data: {
      ' ': "全部",
      1: "小规模",
      2: "一般纳税人",
      3: "其他"
    },
    more: true
  }, {
    label: '服务状态',
    type: 'custom',
    field: 'serviceStatus',
    view: ServiceStatusSelect,
    more: true
  }, {
    label: '合同状态',
    type: 'select',
    field: 'contractStatus',
    data: {
      ' ': "全部",
      1: '正常',
      2: '结束',
      3: '已中止',
      4: '已作废',
      5: '已变更',
      6: '变更中',
      7: '中止中'
    },
    more: true
  }, {
    label: '合同性质',
    type: 'select',
    field: 'contractNature',
    data: {
      ' ': "全部",
      2: "续费",
      1: "变更",
      3: "其他"
    },
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
  }, {
    label: '服务开始日期',
    type: 'date',
    field: 'serviceStart1',
    more: true
  }, {
    label: '至',
    type: 'date',
    field: 'serviceStart2',
    more: true
  }, {
    label: '结束日期',
    type: 'date',
    field: 'serviceEnd1',
    more: true
  }, {
    label: '至',
    type: 'date',
    field: 'serviceEnd2',
    more: true
  }],
  buttons: []
};

class Main extends Component {
  constructor (props) {
    super(props);
    this.state = {
      searchParams: {},
      loading: true,
      data: [],
      selectedRowKeys: [],
      pagination: {
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        showSizeChanger: true,
        pageSizeOptions: ['15', '30', '50', '80', '100', '200'],
        showTotal (total) {
          return `共计 @/erp{total} 条`;
        }
      }
    };
    this.handleTableChange = this.handleTableChange.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.viewOrder = this.viewOrder.bind(this);
    this.viewCustomer = this.viewCustomer.bind(this);
  }
  componentWillMount () {
    this.onSearch()
  }
  handleTableChange (pagination) {
    this.setState({ pagination: pagination }, () => {
      this.onSearch(this.state.searchParams)
    })
  }
  onSearch (vals = {}) {
    // this.? setState({s loading: true});
    const pagination = this.state.pagination;
    if (!_.isEqual(vals, this.state.searchParams)) {
      pagination.current = 1
    }
    vals.limit = pagination.pageSize;
    vals.offset = (pagination.current - 1) * pagination.pageSize;
    return getListData('order/allcontractList', vals).then(res => {
      if (res.status) {
        const pagination = { ...this.state.pagination };
        pagination.total = res.data.total;
        this.setState({
          loading: false,
          data: res.data.list,
          pagination,
          searchParams: vals,
          selectedRowKeys: [],
          selectedRows: []
        })
      }
      return res;
    }, err => {
      this.setState({
        loading: false
      });
    })
  }
  viewOrder (row) {
    const dialog = Dialog({
      content: <OrderViewDialog id={row.OrderId} contractId={row.OrderItemId} ref={v => { v && (v.handler = dialog) }} />,
      width: 1100,
      confirmLoading: false,
      footer: null,
      title: row.CompanyName
    })
    dialog.result.then(() => {

    }, () => {
      // this.onSearch(this.state.searchParams);
    });
  }
  viewCustomer (row) {
    const dialog = Dialog({
      content: <CustomerViewDialog data={row} ref={v => { v && (v.handler = dialog) }} />,
      width: 1100,
      confirmLoading: false,
      footer: null,
      title: row.CompanyName
    })
    dialog.result.then(() => {

    }, () => {
      // this.onSearch(this.state.searchParams);
    });
  }
  discontinue = (row) => {
    if (row.SuspensionId > 0) {
      message.info('该合同正在中止流程中！')
      return;
    }

    const dialog = Dialog({
      content: <DiscontinueDialog close={() => { dialog.close() }} data={row} contractId={[row.Id]} ref={v => { v && (v.handler = dialog) }} />,
      width: 1100,
      confirmLoading: false,
      footer: null,
      title: row.CompanyName || '中止合同'
    })
    dialog.result.then(() => {
      this.onSearch(this.state.searchParams, true);
    }, () => {
      // this.onSearch(this.state.searchParams);
    });
  }
  plDiscontinue = (type) => {
    const selected = this.state.selectedRows
    if (selected.length === 0) {
      message.error('没有选择合同！')
      return;
    }
    if (_.keys(_.groupBy(selected, 'CustomerId')).length > 1) {
      message.error('批量操作只能选择一个公司！');
      return false
    }
    if (type == 2) {
      if (_.find(selected, { Status: 5 })) {
        message.error('请先作废变更后的合同!')
        return;
      }
    }
    const dialog = Dialog({
      content: <DiscontinueDialog isNew={true} type={type} close={() => { dialog.close() }} data={selected[0]} contractId={this.state.selectedRowKeys} ref={v => { v && (v.handler = dialog) }} />,
      width: 1100,
      confirmLoading: false,
      footer: null,
      title: selected[0].CompanyName || '中止合同'
    })
    dialog.result.then(() => {
      this.onSearch(this.state.searchParams, true);
    }, () => {
      // this.onSearch(this.state.searchParams);
    });
  }
  onChange = (row) => {
    getListData('order/ChangeTaxpayer/' + row.CustomerId).then(res => {
      if (res.status) {
        res.data.OrderSalesId = res.data.SalesId;
        res.data.OrderSalesName = res.data.SalesName;
        let dialog = Dialog({
          content: <ContractChangeDailog data={res.data} onClose={(p) => { dialog.close(p) }} />,
          width: 1100,
          confirmLoading: false,
          handleCancel () {
            console.log('onCancel')
          },
          title: "选择变更类别",
          footer: null
        });
        dialog.result.then(res => {
          this.onSearch(this.state.searchParams);
        });
      } else {
        // message.error(res.message)
      }

    }, error => {

    })
  }
  viewChange = (row) => {
    getListData('order/taxpayeredit/' + row.OrderId + '?type=1').then(res => {
      const dialog = Dialog({
        content: <ContractChangeDailog readOnly={true} data={res.data} onClose={e => { dialog.close() }} />,
        width: 1100,
        confirmLoading: false,
        footer: null,
        title: '查看订单'
      })
      dialog.result.then((res) => {
        this.onSearch(this.state.searchParams);
      }, () => { });
    });
  }
  viewDiscontinue = (row) => {
    const type = (row.Status == 3 || row.Status == 7) ? 1 : 2
    const dialog = Dialog({
      content: <DiscontinueDialog type={type} close={() => { dialog.close(true) }} data={row} reviewable={false} ref={v => { v && (v.handler = dialog) }} />,
      width: 1100,
      confirmLoading: false,
      footer: null,
      title: row.CompanyName || '中止合同'
    })
    dialog.result.then(() => {
      this.onSearch(this.state.searchParams);
    }, () => {
      // this.onSearch(this.state.searchParams);
    });
  }
  lingYong = (row)=>{ // 领用
    const dialog = Dialog({
      content: <LingYongDialog close={() => { dialog.close(true) }} data={row} ref={v => { v && (v.handler = dialog) }} />,
      width: 1100,
      confirmLoading: false,
      footer: null,
      title: row.CompanyName + '-领用单'
    })
    dialog.result.then(() => {
      this.onSearch(this.state.searchParams);
    }, () => {
      // this.onSearch(this.state.searchParams);
    });
  }
  render () {
    const columns = [{
      title: '合同编号',
      dataIndex: 'ContractNo',
      render: (val, record) => {
        const colorMap = {
          1: 'contract-blue',
          2: 'contract-green',
          3: 'contract-green',
          4: 'contract-gray'
        }

        return (<div style={{ position: "relative", paddingLeft: '24px' }}>
          <a href="javascript:;" className={colorMap[record.MainItemId] || ''} onClick={this.viewOrder.bind(this, record)}>{val}</a>
          <RIf if={record.ContractNature} key={val + '_2'}><span className="newFlag" style={{ left: 0, top: 0, right: 'auto' }}>{record.ContractNature}</span></RIf>
        </div>);
      }
    }, {
      title: '公司名称',
      dataIndex: 'CompanyName',
      render: (val, record) => {
        return <a href="javascript:;" onClick={this.viewCustomer.bind(this, record)}>{val}</a>;
      }
    }, {
      title: '项目',
      dataIndex: 'MainItemName',
    }, {
      title: '子项目',
      dataIndex: 'ChildItemName',
    }, {
      title: '签订日期',
      dataIndex: 'ContractDate',
      render: val => fDate(val)
    }, {
      title: '费用',
      dataIndex: 'Amount'
    }, {
      title: '服务状态',
      dataIndex: 'ServiceStatus',
      render: val => fServiceStatus(val)
    }, {
      title: '合同状态',
      dataIndex: 'Status',
      render: (val, record) => {
        let icon = null;
        if (val == 1 || val == 5) {
          icon = <div key="1" className="contract-nomal"></div>
        } else if (val == 2 || val == 3 || val == 4) {
          icon = <div key="1" className="contract-end"></div>
        } else {
          icon = <div key="1" className="contract-zz"></div>
        }
        const action = <span key="2">&nbsp;&nbsp;{fContractStatus(val)}</span>
        return <div>{[icon, action]}</div>
      }
    }, {
      title: '操作',
      render: (val, record) => {
        const status = record.Status
        if (status == 1 && record.MainItemId == 1) {
          return <a href="javascript:;" onClick={this.onChange.bind(this, record)}> 变更 </a>
        } else if (status == 5 || status == 6) {
          return <a href="javascript:;" onClick={this.viewChange.bind(this, record)}> 查看详情 </a>
        } else if (status == 3 || status == 4 || status == 7) {
          return <a href="javascript:;" onClick={this.viewDiscontinue.bind(this, record)}> 查看详情 </a>
        } else if(status == 1 && record.MainItemId == 4){
          return <a key={1} href="javascript:;" onClick={ this.lingYong.bind(this,record,false)}>领用</a>
        }
      }
    }];
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedRowKeys: selectedRowKeys,
          selectedRows: selectedRows
        })
      },
      hideDefaultSelections: true,
      selectedRowKeys: this.state.selectedRowKeys,
      getCheckboxProps: record => ({
        disabled: record.Status > 1 && record.Status != 5,
      }),
    };

    return (
      <div>
        <SearchForm items={search.items} buttons={search.buttons} onSearch={this.onSearch} />
        <Table columns={columns}
          rowKey={record => record.Id}
          dataSource={this.state.data}
          pagination={this.state.pagination}
          loading={this.state.loading}
          onChange={this.handleTableChange}
          size="middle"
          bordered={true}
          rowSelection={rowSelection}
        />
        <div>
          <Button type="primary" key='pzz' onClick={this.plDiscontinue.bind(this, 1)}>批量中止</Button>
          <Button type="primary" key='pzf' onClick={this.plDiscontinue.bind(this, 2)} style={{ marginLeft: '12px' }}>批量作废</Button>
        </div>
      </div>
    );
  }
}

export default Main
