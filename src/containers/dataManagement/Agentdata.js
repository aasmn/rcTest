import React from 'react'
import PropTypes from 'prop-types'
import styles from '@/stylus/modifydata'
import { Row, Col } from 'antd'
import { fAddedValue, fDate, fMonth, fInfoSource } from '@/utils/filters'
import http from '../../utils/http'
// 记账状态
const ACCOUNT_STATUS_MAP = {
  1: '正常',
  2: '挂起',
  5: '建账中'
}
// 是否分配
const ASSIGN_MAP = {
  0: '未分配',
  1: '已分配'
}
// 是否分配
const RECALL_MAP = {
  0: '是',
  1: '否'
}
export default class AgentData extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      data: {}
    }
    this.getAgentStatus = this.getAgentStatus.bind(this)
  }
  static get propTypes () {
    return {
      companyId: PropTypes.any.isRequired
    }
  }
  async getAgentStatus () {
    const { companyId } = this.props
    const url = `/api/fromAgent/${companyId}`
    const { status, data } = await http(url)
    if (status) {
      this.setState({
        data
      })
    }
  }
  componentWillMount () {
    this.getAgentStatus()
  }
  render () {
    const { customerId, businessDate, accountantName, status, isAssign, recall } = this.state.data
    return (
      <div>
        <Row className={styles['mt10']}>
          <Col span={4}>
            <label>客户ID：</label>
            <span>{customerId}</span>
          </Col>
          <Col span={4}>
            <label>开始账期：</label>
            <span>{fMonth(businessDate)}</span>
          </Col>
          <Col span={4}>
            <label>主办会计：</label>
            <span>{accountantName}</span>
          </Col>
          <Col span={4}>
            <label>是否分配：</label>
            <span>{ASSIGN_MAP[isAssign]}</span>
          </Col>
          <Col span={4}>
            <label>记账状态：</label>
            <span>{ACCOUNT_STATUS_MAP[status]}</span>
          </Col>
          <Col span={4}>
            <label>是否建账：</label>
            <span>{RECALL_MAP[recall]}</span>
          </Col>
        </Row>
      </div>
    )
  }
}
