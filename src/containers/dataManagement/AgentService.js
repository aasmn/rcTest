import React from 'react'
import { Row, Col, Table } from 'antd'
import styles from '@/stylus/modifydata'
import { fDate, fAgentStatus } from '@/utils/filters'
import { fetchAgentServiceData, fetchAgentServiceList } from '@/utils/api'
export default class AgentService extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      headData: {},
      listData: [],
      customerId: ''
    }
    this.getAgentData = this.getAgentData.bind(this)
    this.getAgentList = this.getAgentList.bind(this)
  }
  componentWillMount () {
    this.setState({
      customerId: this.props.Id
    }, () => {
      this.getAgentData(this.state.customerId)
      this.getAgentList(this.state.customerId)
    })
  }
  getAgentData (id) {
    fetchAgentServiceData(id).then(res => {
      if (res.status) {
        this.setState({
          headData: res.data[0]
        })
      }
    })
  }
  getAgentList (id) {
    fetchAgentServiceList(id).then(res => {
      if (res.status) {
        this.setState({
          listData: res.data
        })
      }
    })
  }
  render () {
    const data = this.state.headData || {}
    const listData = this.state.listData
    const columns = [{
      title: '合同编号',
      dataIndex: 'ContractNo'
    }, {
      title: '纳税类别',
      dataIndex: 'kind'
    }, {
      title: '费用',
      dataIndex: 'Amount'
    }, {
      title: '服务期限',
      dataIndex: 'OrderMonths'
    }, {
      title: '签单日期',
      dataIndex: 'CreateDate',
      render: val => fDate(val)
    }, {
      title: '开始服务日期',
      dataIndex: 'ServiceStart'
    }, {
      title: '结束日期',
      dataIndex: 'serviceEnd'
    }, {
      title: '合同状态',
      dataIndex: 'orderstatus'
    }, {
      title: '服务状态',
      dataIndex: 'ServiceStatus'
    }]
    return (
      <div>
        <Row className={styles['mt10']}>
          <Col span={4}>
            <label>记账报税总额：</label>
            <span>{data.amount}</span>
          </Col>
          <Col span={4}>
            <label>记账合同：</label>
            <span>{data.count}</span>
            <span>个</span>
          </Col>
          <Col span={4}>
            <label>服务期限：</label>
            <span>{data.timespan || 0}</span>
            <span>个月</span>
          </Col>
          <Col span={4}>
            <label>报税状态：</label>
            <span>{fAgentStatus(data.AgentStatus)}</span>
          </Col>
          <Col span={4}>
            <label>开始服务日期：</label>
            <span>{fDate(data.ServiceStart)}</span>
          </Col>
          <Col span={4}>
            <label>结束日期：</label>
            <span>{fDate(data.ServiceEnd)}</span>
          </Col>
        </Row>
        <Table
          rowKey={record => (record.ContractNo)}
          dataSource={listData}
          columns={columns}
          pagination={false}
        />
      </div>
    )
  }
}
