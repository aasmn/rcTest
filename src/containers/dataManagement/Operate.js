import React from 'react'
import { Table } from 'antd'
import { fetchOperateList } from '@/utils/api'
import { fDateT } from '@/utils/filters'
export default class Operate extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      tabData: []
    }
  }
  componentWillMount () {
    console.log(this.props.Id, 'this.props.Id')
    fetchOperateList(this.props.Id).then(res => {
      if (res.status) {
        this.setState({
          tabData: res.data
        })
      }
    })
  }
  render () {
    const columns = [{
      title: '序列号',
      dataIndex: 'Id'
    }, {
      title: '操作内容',
      dataIndex: 'Content',
      width: 450
    }, {
      title: '操作人',
      dataIndex: 'RealName'
    }, {
      title: '操作时间',
      dataIndex: 'OperationTime',
      render: val => fDateT(val)
    }]
    return (
      <Table
        rowKey={record => (record.Id)}
        dataSource={this.state.tabData}
        columns={columns}
        pagination={false}
      />
    )
  }
}
