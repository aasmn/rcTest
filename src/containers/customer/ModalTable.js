import { Tabs, Table, Button } from 'antd'
import React from 'react'
import { fetchOutworkDetail, fetchOrderDetail } from '@/utils/api'
export default class extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      dataSource: []
    }
    this.fetchData()
  }
  fetchData () {
    const { Id, params, type } = this.props
    switch (type) {
    case 'order':
      fetchOrderDetail(Id, params).then(res => {
        if (res.status) {
          const list = res.data
          this.setState({
            dataSource: list
          })
        }
      })
      break
    case 'childTask':
      fetchOutworkDetail(Id, params).then(res => {
        if (res.status) {
          this.setState({
            dataSource: res.data
          })
        }
      })
      break
    }
  }
  render () {
    return (
      <Table
        rowKey={record => (record.Id)}
        dataSource={this.state.dataSource}
        columns={this.props.columns}
        pagination={false}
      />
    )
  }
}
