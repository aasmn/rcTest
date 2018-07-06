import React from 'react'
import '@/erp/style/main.less'
import { Table, Button } from 'antd'
import { getListData } from '@/erp/api'
// import { fDate } from '@/erp/config/filters'
import SearchForm from '@/erp/container/SearchForm'
import Dialog from '@/erp/container/Dialog'
import ViewOrder from '@/erp/container/channel/ViewOrder'
import YTviewOrder from '@/erp/container/channel/YTviewOrder'
import ChannelSelect from '@/erp/container/searchComponent/ChannelSelect'

let search = {
  items: [{
    label: '账单编号',
    type: 'text',
    field: 'billid'
  }, {
    label: '选择代理商',
    type: 'custom',
    field: 'channelId',
    view: ChannelSelect,
    defaultValue: ''
  }, {
    label: '资金流向',
    type: 'select',
    field: 'type',
    data: [{ id: 1, label: '支付' }, { id: 2, label: '充值' }]
  }, {
    label: '',
    type: 'date',
    field: 'starttime'
  }, {
    label: '',
    type: 'date',
    field: 'endtime'
  }],
  buttons:[]
};
export default class Main extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      pagination: {
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal(total) {
          return `共计 @/erp{total} 条`;
        }
      },
      searchParams: {},
      loading: false,
      data: []
    }
    this.handleTableChange = this.handleTableChange.bind(this)
    this.onSearch = this.onSearch.bind(this)
    this.view = this.view.bind(this)
  }
  handleTableChange (pagination){
    this.setState({pagination: pagination}, ()=>{this.onSearch(this.state.searchParams)})
  }
  onSearch(vals={}) {
    this.setState({searchParams: vals, loading: true});
    const pagination =this.state.pagination;
    vals.limit = pagination.pageSize;
    vals.offset = (pagination.current - 1) * pagination.pageSize;
    console.log(vals, 'vals')
    return getListData('finance/agent/detaillist', vals).then(res => {
      if(res.status){
        const pagination = { ...this.state.pagination };
        pagination.total = res.Count;
        this.setState({
          loading: false,
          data: res.data,
          pagination,
        });
      }
      return res;
    },err=>{
      this.setState({
        loading: false
      });
    })
  }
  view (item) {
    Dialog({
      content: <ViewOrder OrderId={item.OrderId} Channelid={item.Channelid}/>,
      width: 1000,
      confirmLoading: false,
      handleCancel (){
        console.log('onCancel')
      },
      title: '订单查看'
    }).result.then(()=>{
      // this.onSearch(this.state.searchParams)
    },()=>{});
  }
  YTview (item) {
    Dialog({
      content: <YTviewOrder OrderId={item.OrderId} Channelid={item.Channelid}/>,
      width: 1000,
      confirmLoading: false,
      handleCancel (){
        console.log('onCancel')
      },
      title: '订单查看'
    }).result.then(()=>{
      // this.onSearch(this.state.searchParams)
    },()=>{});
  }
  componentWillMount() {
    this.onSearch()
  }
  render () {
    const columns = [{
      title: '账单编号',
      dataIndex: 'BillId'
    }, {
      title: '操作时间',
      dataIndex: 'BillTime'
    }, {
      title: '一级代理商',
      dataIndex: 'ChannelName1'
    }, {
      title: '二级代理商',
      dataIndex: 'ChannelName2'
    }, {
      title: '描述',
      dataIndex: 'Description'
    }, {
      title: '收入',
      dataIndex: 'Income'
    }, {
      title: '支出',
      dataIndex: 'Amount'
    }, {
      title: '余额',
      dataIndex: 'Balance'
    }, {
      title: '操作',
      render: (text, record) => (
        <Button.Group>
          {
            this.state.searchParams && this.state.searchParams.type != 2 && record.Category == 1 && record.Status && record.OrderCategory != 2 &&
            <Button size="small" onClick={e => {this.view(record)}}>查看订单</Button>
          }
          {
            this.state.searchParams && this.state.searchParams.type != 2 && record.Category == 1 && record.Status && record.OrderCategory == 2 &&
            <Button size="small" onClick={e => {this.YTview(record)}}>查看订单</Button>
          }
        </Button.Group>
      )
    }]
    return (
      <div className="more-notice" style={{ background: '#fff', padding: '10px' }}>
        <h3 className="vheader">财务明细</h3>
        <SearchForm items={search.items} buttons={search.buttons} onSearch={this.onSearch}/>
        <Table columns={columns}
            rowKey={record => record.BillId}
            dataSource={this.state.data}
            pagination={this.state.pagination}
            loading={this.state.loading}
            onChange={this.handleTableChange}
            size="middle"
            bordered={true}
        />
      </div>
    )
  }
}