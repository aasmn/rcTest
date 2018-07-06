import React from 'react'
import { Tree, Row, Col } from 'antd'
import { resourceApi } from '@/utils/api'
import { clearTreeData as clear } from '@/utils/filters'
const TreeNode = Tree.TreeNode

class StrategyCon2 extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      res: [],
      selected: [],
      isreadonly: false
    }
    this.getValue = this.getValue.bind(this)
    this.onCheck = this.onCheck.bind(this)
    this.renderTreeNodes = this.renderTreeNodes.bind(this)
    this.getResources()
  }
  componentWillMount () {
    console.log(this.props.data)
    if (this.props.data && this.props.data.length) {
      this.setState({
        selected: this.props.data,
        isreadonly: true
      })
    }
  }
  getValue () {
    return this.state.selected
  }
  getResources () {
    resourceApi.get().then(res => {
      this.setState({ res: clear(res.data) })
    }, () => {
      if (this.props.data && this.props.data.length) {
        this.setState({
          selected: this.props.data,
          isreadonly: true
        })
      }
    })
  }
  onCheck (checkedKeys, info) {
    console.log(checkedKeys, 'checkedKeys')
    this.setState({ selected: checkedKeys })
  }
  renderTreeNodes (data) {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.name} key={item.id} dataRef={item} disabled={this.state.isreadonly}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        )
      }
      return <TreeNode title={item.name} key={item.id} dataRef={item} />
    })
  }
  render () {
    console.log(this.state.selected, 'checkedKeys')
    return (
      <Row>
        <Col offset={4}>
          <Tree
            checkable
            onCheck={this.onCheck}
            defaultExpandAll={true}
            checkedKeys={this.state.selected}
          >
            {this.renderTreeNodes(this.state.res)}
          </Tree>
        </Col>
      </Row>
    )
  }
}

export default StrategyCon2
