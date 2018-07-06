import React from 'react'
import PropTypes from 'prop-types'
import { Tree, Row, Col, message } from 'antd'
import { strageApi } from '@/utils/api'
import { clearTreeData as clear } from '@/utils/filters'
const TreeNode = Tree.TreeNode

class Main extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      strategy: {}
    }
    this.getDetail = this.getDetail.bind(this)
    this.renderTreeNodes = this.renderTreeNodes.bind(this)
  }
  static get propTypes () {
    return {
      strategyId: PropTypes.string.isRequired
    }
  }
  async getDetail (id) {
    if (!id) {
      message.error('策略id不能为空')
      return false
    }
    const {status, data} = await strageApi.get({id})
    if (status && Array.isArray(data)) {
      this.setState({
        strategy: data[0]
      })
    } else {
      message.error('获取策略详情失败')
    }
  }
  componentDidMount () {
    const { strategyId: id } = this.props
    this.getDetail(id)
  }
  renderTreeNodes (data) {
    if (!Array.isArray(data)) {
      return null
    }
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.name} key={item.id} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        )
      }
      return <TreeNode title={item.name} key={item.id} dataRef={item} />
    })
  }
  render () {
    const { name, desc, resources } = this.state.strategy
    return (
      <div>
        <Row>
          <Col span={4}>
            策略名称：
          </Col>
          <Col offset={4}>
            {name}
          </Col>
        </Row>
        <Row>
          <Col span={4}>
            策略描述：
          </Col>
          <Col offset={4}>
            {desc}
          </Col>
        </Row>
        <Row>
          <Col span={4}>
            策略资源：
          </Col>
          <Col offset={4}>
            <Tree
            >
              {this.renderTreeNodes(resources)}
            </Tree>
          </Col>
        </Row>
      </div>
    )
  }
}

export default Main
