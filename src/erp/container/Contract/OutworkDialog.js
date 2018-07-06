import React, { Component } from 'react'
import { getListData } from '@/erp/api'
import { Table } from 'antd'
import { fSubTaskStatus, fDateT } from '@/erp/config/filters'

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: false
    }
    this.onSearch = this.onSearch.bind(this);
  }
  onSearch() {
    getListData('maintask/' + this.props.Id).then(res => {
      if (res.status) {
        this.setState({data: res.data, loading: false})
      }
    })
  }
  componentWillMount() {
      this.onSearch();
  }
  render() {
    const columns = [{
      title: '序列ID',
      dataIndex: 'Id'
    }, {
      title: '子任务名称',
      dataIndex: 'TaskName'
    }, {
      title: '当前外勤人员',
      dataIndex: 'OutWorkerName'
    }, {
      title: '开始时间',
      dataIndex: 'StartTime',
      render: val => fDateT(val)
    }, {
      title: '完成时间',
      dataIndex: 'EndTime',
      render: val => fDateT(val)
    }, {
      title: '状态',
      dataIndex: 'Status',
      render: val => fSubTaskStatus(val)
    }]
    return(
      <Table columns={columns}
          rowKey={record => record.Id}
          dataSource={this.state.data}
          loading={this.state.loading}
          size="middle"
          bordered={true}
      />
    )
  }
}

export default Main
