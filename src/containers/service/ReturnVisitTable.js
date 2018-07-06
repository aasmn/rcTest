import { Tabs, Table, Button } from 'antd'
import React from 'react'
import _ from 'lodash'
import { fetchReturnVisitList } from '@/utils/api'
export default class extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      dataSource: [],
      pagination: {
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        showSizeChanger: true,
        pageSizeOptions: ['15', '30', '50', '80', '100', '200'],
        showTotal (total) {
          return `共计 ${total} 条`
        }
      }
    }
    this.handleTableChange = this.handleTableChange.bind(this)
    this.fetchData(this.props.params)
  }
  componentWillReceiveProps (nextProps) {
    const pagination = this.state.pagination
    if (!_.isEqual(nextProps.params, this.props.params)) {
      pagination.current = 1
      this.fetchData(nextProps.params)
    }
  }
  handleTableChange (pagination) {
    this.setState({ pagination: pagination }, () => {
      this.fetchData(this.props.params)
    })
  }
  fetchData (vals = {}) {
    const pagination = this.state.pagination
    vals.type = vals.type ? vals.type : '2'
    vals.limit = pagination.pageSize
    vals.offset = (pagination.current - 1) * pagination.pageSize
    console.log(vals, 'vals')
    fetchReturnVisitList(vals).then(res => {
      if (res.status) {
        const pagination = { ...this.state.pagination }
        pagination.total = res.Count
        this.setState({
          dataSource: res.data,
          pagination
        })
      }
    })
  }
  render () {
    return (
      <div style={{ background: '#fff' }}>
        <Table
          rowKey={record => (record._id)}
          dataSource={this.state.dataSource}
          columns={this.props.columns}
          pagination={this.state.pagination}
          onChange={this.handleTableChange}
        />
      </div>
    )
  }
}
