import React, { Component } from 'react'
import { Table, Button } from 'antd'
import { getListData } from '@/erp/api'
import Dialog from '@/erp/container/Dialog'
import OrderDialog from '@/erp/container/Contract/OrderDialog'

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
        data: [],
        pagination: {
            current: 1,
            pageSize: 10,
            pageSizeOptions: ['20','50','80','100','200'],
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal(total) {
              return `共计 @/erp{total} 条`;
            }
        },
        loading: false,
    };
    this.onSearch = this.onSearch.bind(this);
    this.handleTableChange = this.handleTableChange.bind(this);
    this.openDialog = this.openDialog.bind(this);
  }
  handleTableChange (pagination){
      this.setState({pagination: pagination}, ()=>{this.onSearch()})
  }
  onSearch() {
      this.setState({loading: true});
      const pagination = this.state.pagination;
      let vals = {}
      vals.limit = pagination.pageSize;
      vals.offset = (pagination.current - 1) * pagination.pageSize;
      return getListData('customer/' + this.props.companyId + '/orders', vals).then(res => {
          if(res.status){
              const pagination = { ...this.state.pagination };
              pagination.total = res.data.total;
              this.setState({
                  loading: false,
                  data: res.data.list,
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
  openDialog(customer,title,width){

  }
  componentWillMount() {
      this.onSearch();
  }
  view(row) {
    const dialog = Dialog({
        content: <OrderDialog id={row.OrderId} readOnly={true}/>,
        width: 1100,
        confirmLoading: false,
        footer: null,
        title: '查看订单'
    })
    dialog.result.then((res)=>{
        console.log(res)
    },()=>{});
  }
  render() {
    const columns = [{
      title: '订单号',
      dataIndex: 'OrderNo',
      width: 150
    }, {
      title: '订单总金额',
      dataIndex: 'Amount'
    }, {
      title: '记账报税费用',
      dataIndex: 'AgentFeed'
    }, {
      title: '会计服务费用',
      dataIndex: 'FinanceServiceFeed'
    }, {
      title: '外勤服务费',
      dataIndex: 'OutWorkServiceFeed'
    }, {
      title: '代收费用',
      dataIndex: 'BookKeepFeed'
    }, {
      title: '签单销售',
      dataIndex: 'OrderSalesName'
    }, {
      title: '签订日期',
      dataIndex: 'ContractDate'
    }, {
      title: '备注信息',
      dataIndex: 'Remark',
      width: 150
    }, {
      title: '操作',
      render: (text, record) => (
          <Button size="small" onClick={e=>{this.view(record)}}>查看</Button>
      ),
    }];

    return (
      <Table columns={columns}
          rowKey={record => record.OrderId}
          dataSource={this.state.data}
          pagination={this.state.pagination}
          loading={this.state.loading}
          onChange={this.handleTableChange}
          size="middle"
          bordered={true}
      />
    )
  }
}

export default Main
