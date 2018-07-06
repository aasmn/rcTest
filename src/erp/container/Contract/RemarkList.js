import React, { Component } from 'react'
import { Table, Button } from 'antd'
import { getListData } from '@/erp/api'
import { fDate, fOperation } from '@/erp/config/filters'
import Dialog from '@/erp/container/Dialog'
import RemarkDialog from '@/erp/container/Contract/RemarkDialog'

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
        data: [],
        pagination: {
            current: 1,
            pageSize: 15,
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
      return getListData('customer/remark/list/' + this.props.companyId, vals).then(res => {
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
    Dialog({
        content: <RemarkDialog row={row}/>,
        width: 500,
        confirmLoading: false,
        footer: null,
        title: '查看详情'
    }).result.then(()=>{
        this.onSearch()
    },()=>{});
  }
  render() {
    const columns = [{
      title: '序列号',
      dataIndex: 'Id'
    }, {
      title: '备注',
      dataIndex: 'Content',
      width: 200
    }, {
      title: '操作',
      dataIndex: 'Operation',
      render: val => fOperation(val)
    }, {
      title: '操作人',
      dataIndex: 'RealName'
    }, {
      title: '操作时间',
      dataIndex: 'OperationTime',
      render: val => fDate(val)
    }, {
      title: '操作',
      render: (text, record) => (
          <Button size="small" onClick={e=>{this.view(record)}}>查看</Button>
      ),
    }];

    return (
      <Table columns={columns}
          rowKey={record => record.Id}
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
