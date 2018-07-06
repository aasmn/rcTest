import React from 'react'
import { Tree, Button, Input, Icon, Row, Col, message } from 'antd'
import styles from '@/stylus/strategy'
import { getDepartments, addDepartment, deleteDepartment, modifyDepartment } from '@/utils/api'
import Modal from '@/components/common/Modal'
import { clearTreeData as clear } from '@/utils/filters'

const TreeNode = Tree.TreeNode

class TreeTitle extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isEditing: false,
      data: props.data
    }
    this.onEdit = this.onEdit.bind(this)
    this.add = this.add.bind(this)
    this.delete = this.delete.bind(this)
  }
  onEdit () {
    this.setState({
      isEditing: true
    })
  }
  add () {
    let depName
    const modal = Modal.show({
      content: <Row><Col span={6}>部门名称:</Col><Col><Input onChange={e => { depName = e.target.value }} /></Col></Row>,
      title: '添加部门',
      mask: true,
      onOk: () => {
        // console.log(depName)
        return addDepartment({
          name: depName,
          pid: this.state.data.id || undefined
        }).then(res => {
          this.props.refresh()
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
      content: <span>您确认要删除该部门吗？</span>,
      title: '删除部门',
      mask: true,
      onOk: () => {
        // console.log(depName)
        return deleteDepartment(this.state.data.id).then(res => {
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
      name: name,
      id: data.id
      // pid: data.pid
    }
    modifyDepartment(newData).then(res => {
      if (res.status) {
        this.props.refresh()
        message.info('操作成功！')
      }
      this.setState({
        data: { ...this.state.data, name: newData.name },
        isEditing: false
      })
    })
  }
  render () {
    const { isEditing, data } = this.state
    return (
      <div className={styles.editableTreeTitle}>
        {(!isEditing) && <span onDoubleClick={this.onEdit}>{data.name}</span>}
        {isEditing && <Input size="small" defaultValue={data.name} autoFocus onPressEnter={e => { this.save(e.target.value) }} onBlur={e => { this.save(e.target.value) }} />}
        <Button.Group>
          <Icon onClick={this.add} type="plus-circle-o" size="small" className={styles.optIcon}/>
          {(!data.isRoot) && <Icon type="minus-circle-o" size="small" className={styles.optIcon} onClick={this.delete}></Icon>}
        </Button.Group>
      </div>
    )
  }
}
class Departments extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      data: []
    }
    this.getDepartments = this.getDepartments.bind(this)
    this.renderTreeNodes = this.renderTreeNodes.bind(this)
    this.onDrop = this.onDrop.bind(this)
    this.getDepartments()
  }
  getDepartments () {
    getDepartments().then(res => {
      if (res.data.length > 0) {
        this.setState({
          data: [{ name: '全部', isRoot: true, children: clear(res.data), id: 0 }]
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
          <TreeNode title={<TreeTitle data={item} refresh={this.getDepartments.bind(this)} />} key={item.id} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        )
      }
      return <TreeNode title={<TreeTitle data={item} refresh={this.getDepartments.bind(this)} />} key={item.id} dataRef={item} />
    })
  }
  onDrop (info) {
    console.log(info, 'info')
    const dropKey = info.node.props.eventKey // 要移入的组织的父id
    const dragKey = info.dragNode.props.eventKey // 被移动的整个组织部门id
    const dragNodeName = info.dragNode.props.dataRef.name // 被移动的整个组织部门name
    const dropPos = info.node.props.pos.split('-')
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1])
    const loop = (data, key, callback) => {
      data.forEach((item, index, arr) => {
        if (item.id === key) {
          return callback(item, index, arr)
        }
        if (item.children) {
          return loop(item.children, key, callback)
        }
      })
    }
    const data = this.state.data[0].children
    let dragObj
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1)
      dragObj = item
    })
    if (info.dropToGap) {
      let ar
      let i
      loop(data, dropKey, (item, index, arr) => {
        ar = arr
        i = index
      })
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj)
      } else {
        ar.splice(i + 1, 0, dragObj)
      }
    } else {
      loop(data, dropKey, (item) => {
        item.children = item.children || []
        item.children.push(dragObj)
      })
    }
    this.setState({
      data: [{ name: '全部', isRoot: true, children: data, id: 0 }]
    })
    const newData = {
      name: dragNodeName,
      id: dragKey,
      pid: dropKey
    }
    modifyDepartment(newData).then(res => {
      if (res.status) {
        message.info('操作成功！')
      }
    })
  }
  render () {
    return (
      <Tree
        className="draggable-tree"
        showLine
        defaultExpandedKeys={['0']}
        draggable
        onDrop={this.onDrop}
      >
        {this.renderTreeNodes(this.state.data)}
      </Tree>
    )
  }
}
export default Departments
