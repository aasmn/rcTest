import React from 'react'
import { Button, Checkbox } from 'antd'
import $ from 'jquery'
import { putData } from '@/erp/api'
import { getTaskConfigList } from '@/erp/store/actions'
import { connect } from 'react-redux'
import store from '@/erp/store'
import Dialog from '@/erp/container/Dialog'
import TaskConfDetail from './TaskConfDetail'
import _ from 'lodash'
class TaskConfItem extends React.Component {
  toToggle (e) {
    $(e.target).parent().siblings('.task-config-item-body').slideToggle(100)
  }
  changeStatus (item) {
    const params = {
      isstop: item.Status == 1 ? 2 : 1,
      id: item.CommonTaskId
    }
    putData('commontask/commontaskisstop?' + $.param(params), null).then(() => {
      store.dispatch(getTaskConfigList())
    })
  }
  toEdit (data) {
    const dialog = Dialog({
      content: <TaskConfDetail CommonTaskId={data[0].CommonTaskId}/>,
      width: 900,
      handleOk: () => {
        return new Promise((resolve, reject) => {
          putData('commontask', store.getState().taskConf.detailInfo).then((res) => {
            store.dispatch(getTaskConfigList())
            resolve()
          })
        })
      },
      confirmLoading: false,
      handleCancel (){
        console.log(this)
      },
      title: "编辑任务"
    });
    this.props.dispatch({
      type: 'change outworker task config selected task',
      data: data
    })
    this.props.dispatch({
      type: 'change outworker task config detail info',
      payload: {
        CommonTaskName: data[0].CommonTaskName,
        Weight: data[0].CommonWeight,
        Status: 2,
        Id: data[0].CommonTaskId
      }
    })
  }
  toSelectItem (item) {
    const selectedTask = _.cloneDeep(this.props.selectedTask)
    console.log(selectedTask, 'toSelectItem')
    const index = _.findIndex(selectedTask, (chr) => {
      return chr.OuterTaskId == item.Id;
    })
    if (index > -1) {
      selectedTask.splice(index, 1)
    } else {
      selectedTask.push({
        OuterTaskId: item.Id,
        TaskName: item.TaskName,
        Weight: selectedTask.length + 1
      })
    }
    store.dispatch({
      type: 'change outworker task config selected task',
      data: selectedTask
    })
    this.props.dispatch({
      type: 'change outworker task config detail info',
      payload: {
        CommonTaskName: this.props.detailInfo.CommonTaskName,
        Weight: this.props.detailInfo.Weight,
        Status: 2,
        Id: this.props.detailInfo.Id
      }
    })
  }
  getContent () {
    const node = []
    if (this.props.type == 'modal') {
      this.props.data.length > 0 && this.props.data.map((item, index) => {
        node.push(
          <div className={'task-config-item-with-checkbox' + ' task-config-item-checkbox-' + item.Id} key={'task-conf-item-modal-' + index}>
              <Checkbox
                checked={item.checked}
                onChange={this.toSelectItem.bind(this, item)}>
                {item.TaskName}
              </Checkbox>
          </div>
        )
      })
    } else {
      this.props.data.length > 0 && this.props.data.map((item, index) => {
         node.push(<div className='task-config-item-no-checkbox' key={'task-conf-item-' + index}>{index + 1}.{item.TaskName}</div>)
      })
    }
    return node
  }
  render () {
    return (
      <div className="task-config-item">
        <div className="task-config-heading">
          <span className="task-config-title" onClick={this.toToggle.bind(this)}>{this.props.title}</span>
          {
            this.props.type == 'modal' ? '' : (
              <div className="task-config-btns">
                <Button type="primary" onClick={this.toEdit.bind(this, this.props.data)}>编辑</Button>
                <Button type="primary" onClick={this.changeStatus.bind(this, this.props.data[0])}>
                  {this.props.data[0]['Status'] == 2 ? '启用' : '禁用'}
                </Button>
              </div>
            )
          }
        </div>
        <div className='task-config-item-body'>
          {this.getContent()}
        </div>
      </div>
    )
  }
}
export default connect(({taskConf}) => {
  return {
    ...taskConf
  }
})(TaskConfItem)
