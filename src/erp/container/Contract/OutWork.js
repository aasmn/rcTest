import React, { Component } from 'react'
import { Table, Button } from 'antd'
import { getListData } from '@/erp/api'
import { fMainTaskStatus, fSubTaskStatus, fDateT } from '@/erp/config/filters'
import OutworkDialog from '@/erp/container/Contract/OutworkDialog'
import Dialog from '@/erp/container/Dialog'

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
      return getListData('maintask/listforCustomerId/' + this.props.companyId, vals).then(res => {
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
        content: <OutworkDialog Id={row.Id}/>,
        width: 1100,
        confirmLoading: false,
        footer: null,
        title: '查看详情'
    }).result.then(()=>{
        this.onSearch()
    },()=>{});
  }
  render() {
    const columns = [{
      title: '序列ID',
      dataIndex: 'Id',
      width: 150
    }, {
      title: '任务名称',
      dataIndex: 'MainTaskName'
    }, {
      title: '主任务状态',
      dataIndex: 'MainTaskStatus',
      render: val=> fMainTaskStatus(val)
    }, {
      title: '当前子任务',
      dataIndex: 'childTaskName'
    }, {
      title: '当前子任务状态',
      dataIndex: 'Status',
      render: val=> fSubTaskStatus(val)
    }, {
      title: '当前外勤人员',
      dataIndex: 'OutWorkerName'
    }, {
      title: '任务提交时间',
      dataIndex: 'SubmitTaskTime',
      render: val => fDateT(val)
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
