import React from 'react'
import { Tree, Button, Input, Icon, Row, Col, Select, message } from 'antd'
import styles from '@/stylus/strategy'
import { resourceApi } from '@/utils/api'
import Modal from '@/components/common/Modal'
import _ from 'lodash'
import { clearTreeData as clear } from '@/utils/filters'

const TreeNode = Tree.TreeNode

class ResourceDetail extends React.Component {
  constructor (props) {
    super(props)
    this.state = _.extend({
      name: '',
      pid: props.pid,
      code: '',
      desc: ''
    }, props.data || {})
    // this.onChange = this.onChange.bind(this)
  }
  render () {
    const data = this.props.data || {}
    return (
      <div>
        <Row>
          <Col span={6}>资源名称</Col>
          <Col span={18}><Input defaultValue={data.name} onChange={e => { this.setState({ name: e.target.value }) }} /></Col>
        </Row>
        <Row>
          <Col span={6}>资源代码</Col>
          <Col span={18}><Input defaultValue={data.code} onChange={e => { this.setState({ code: e.target.value }) }} onBlur={e => { e.target.value = e.target.value.toUpperCase() }} /></Col>
        </Row>
        <Row>
          <Col span={6}>资源描述</Col>
          <Col span={18}><Input defaultValue={data.desc} onChange={e => { this.setState({ desc: e.target.value }) }} /></Col>
        </Row>
        <Row>
          <Col span={6}>Url</Col>
          <Col span={18}><Input defaultValue={data.url} onChange={e => { this.setState({ url: e.target.value }) }} /></Col>
        </Row>
        <Row>
          <Col span={6}>类型</Col>
          <Col span={18}>
            <Select defaultValue={data.type} onChange={e => { this.setState({ type: e }) }} style={{ width: 200 }}>
              <Select.Option value={1}>菜单</Select.Option>
              <Select.Option value={2}>按钮</Select.Option>
            </Select>
          </Col>
        </Row>
        <Row>
          <Col span={6}>排序</Col>
          <Col span={18}><Input defaultValue={data.order} onChange={e => { this.setState({ order: e.target.value }) }} /></Col>
        </Row>
      </div>
    )
  }
}

class TreeTitle extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isEditing: false,
      data: props.data
    }
    this.edit = this.edit.bind(this)
    this.add = this.add.bind(this)
    this.delete = this.delete.bind(this)
  }
  add (item = {}) { // 新增，修改
    let rc
    const modal = Modal.show({
      content: <ResourceDetail pid={this.state.data.id} ref={v => { rc = v }} />,
      title: '添加资源',
      mask: true,
      onOk: () => {
        if (rc.state.code.toLowerCase === 'cos_superadmin') {
          message.error('资源代码不允许为cos_superadmin')
          return false
        }
        // console.log(rc)
        let data = _.pick(rc.state, ['pid', 'name', 'desc', 'code', 'url', 'order', 'type'])
        data.code = data.code.toUpperCase()
        if (data.pid === 0) delete data.pid
        return resourceApi.post(data).then(res => {
          this.props.refresh()
          this.setState({ data })
          message.info('操作成功！')
          modal.hide()
        })
      },
      onCancel: () => {
        modal.hide()
      }
    })
  }
  edit (item = {}) { // 新增，修改
    let rc
    const modal = Modal.show({
      content: <ResourceDetail data={item} ref={v => { rc = v }} />,
      title: '修改资源',
      mask: true,
      onOk: () => {
        // console.log(rc)
        let data = _.pick(rc.state, ['id', 'pid', 'name', 'desc', 'code', 'url', 'order', 'type'])
        data.code = data.code.toUpperCase()
        if (!data.pid) data.pid = '0'
        return resourceApi.put(data).then(res => {
          this.props.refresh()
          if (data.id) this.setState({ data })
          message.info('操作成功！')
          modal.hide()
        })
      },
      onCancel: () => {
        modal.hide()
      }
    })
  }
  delete () {
    let depName
    const modal = Modal.show({
      content: <span>您确认要删除该资源吗？</span>,
      title: '删除资源',
      mask: true,
      onOk: () => {
        // console.log(depName)
        return resourceApi.delete(this.state.data.id).then(res => {
          if (res.status) {
            this.props.refresh()
            message.info('操作成功！')
          }
          modal.hide()
        })
      },
      onCancel: () => {
        modal.hide()
      }
    })
  }
  save (name) {
    const data = this.state.data
    const newData = {
      name: data.name,
      id: data.id,
      pid: data.pid
    }
    resourceApi.put(newData).then(res => {
      if (res.status) {
        this.props.refresh()
        this.setState({
          isEditing: false
        })
        message.info('操作成功！')
      }
    })
  }
  render () {
    const { isEditing, data } = this.state
    return (
      <div className={styles.editableTreeTitle}>
        <span onDoubleClick={e => { this.edit(this.state.data) }}>{data.name}</span>
        <Button.Group>
          <Icon className={styles.optIcon} onClick={e => { this.add() }} type="plus-circle-o" size="small" />
          {(!data.isRoot) && <Icon className={styles.optIcon} type="minus-circle-o" size="small" onClick={this.delete}></Icon>}
        </Button.Group>
      </div>
    )
  }
}
class Resources extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      data: []
    }
    this.getResources = this.getResources.bind(this)
    this.renderTreeNodes = this.renderTreeNodes.bind(this)
    this.getResources()
  }
  getResources () {
    resourceApi.get().then(res => {
      console.log(res.data, 'res.data')
      const data = clear(res.data)
      if (res.data.length > 0) {
        this.setState({
          data: [{ name: '全部', isRoot: true, children: res.data, id: 0 }]
        })
      } else {
        this.setState({
          data: [{ name: '全部', isRoot: true, id: 0 }]
        })
      }
    })
  }
  renderTreeNodes (data) {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={<TreeTitle data={item} refresh={this.getResources} />} key={item.id} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        )
      }
      return <TreeNode title={<TreeTitle data={item} refresh={this.getResources} />} key={item.id} dataRef={item} />
    })
  }
  render () {
    return (
      <Tree
        showLine
        defaultExpandedKeys={['0']}
      >
        {this.renderTreeNodes(this.state.data)}
      </Tree>
    )
  }
}
export default Resources
