import React, { Component } from 'react'
import { Table, Button } from 'antd'
import { getListData } from '@/erp/api'
import { fDateT } from '@/erp/config/filters'

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
      vals.customerId = this.props.companyId
      return getListData('customer/rz', vals).then(res => {
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

  componentWillMount() {
      this.onSearch();
  }

  render() {
    const columns = [{
      title: '序列号',
      dataIndex: 'Id'
    }, {
      title: '操作内容',
      dataIndex: 'Content',
      width: 300
    }, {
      title: '操作人',
      dataIndex: 'RealName'
    }, {
      title: '操作时间',
      dataIndex: 'OperationTime',
      render: val => fDateT(val)
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
