import React from 'react'
import { Input } from 'antd'
import TaskConfItem from './TaskConfItem'
import { connect } from 'react-redux'
import store from '@/erp/store'
import _ from 'lodash'
import $ from 'jquery'
class TaskConfDetail extends React.Component {
  processData () {
    const checkedData = this.props.selectedTask
    const checkedIds = []
    const { common } = store.getState()
    const data = common.sub_task

    checkedData.map((item) => {
      checkedIds.push(item.OuterTaskId)
    })

    const processData = {
      '税务任务': [],
      '工商任务': [],
      '其他任务': [],
      '特殊任务': []
    }
    for (let key in data) {
      let BusinessType = data[key].BusinessType
      data[key].checked = checkedIds.indexOf(data[key].Id) > -1
      if (data[key].Status == 1) {
        if (BusinessType == 1) {
          processData['税务任务'].push(data[key])
        } else if (BusinessType == 2) {
          processData['工商任务'].push(data[key])
        } else if (BusinessType == 3) {
          processData['其他任务'].push(data[key])
        } else if (BusinessType == 4) {
          processData['特殊任务'].push(data[key])
        }
      }
    }
    return processData
  }
  getTaskNode () {
    const processData = this.processData()
    const node = []
    let i = 0
    for (let key in processData) {
      node.push(<TaskConfItem key={'task-conf-item-d' + i} title={key} data={processData[key]} type="modal"/>)
      i++
    }
    return node
  }
  toEditWeight (index, e) {
    const selectedTask = _.cloneDeep(this.props.selectedTask)
    selectedTask[index].Weight = parseInt(e.target.value) || 0
    store.dispatch({
      type: 'change outworker task config selected task',
      data: selectedTask
    })
    this.toChangeInput()
    setTimeout(() => {
      const n = _.findIndex(this.props.selectedTask, (chr) => {
        return chr.OuterTaskId == selectedTask[index].OuterTaskId;
      })
      $('.task-conf-table table tbody tr').map((k, el) => {
        $(el).find('input').val(this.props.selectedTask[k].Weight)
      })
      $('.task-conf-table table tbody tr').eq(n).find('input').focus()
      // console.log(this.props, 'selectedTask')
    }, 100)
  }
  toCancel (index, item) {
    const selectedTask = _.cloneDeep(this.props.selectedTask)
    const id = item.OuterTaskId
    selectedTask.splice(index, 1)
    this.props.dispatch({
      type: 'change outworker task config selected task',
      data: selectedTask
    })
    this.toChangeInput()
  }
  toChangeInput () {
    this.props.dispatch({
      type: 'change outworker task config detail info',
      payload: {
        CommonTaskName: $('.task-conf-modal input')[0].value,
        Weight: $('.task-conf-modal input')[1].value,
        Status: 2,
        Id: this.props.CommonTaskId
      }
    })
  }
  render () {
    const { selectedTask, detailInfo } = this.props
    const title = detailInfo.CommonTaskName
    const weight = detailInfo.Weight
    return (
      <div className='task-conf-modal'>
        <div>
          <label><span className='required'>*</span>通办任务名称</label>
          <Input onChange={this.toChangeInput.bind(this)} defaultValue={title} style={{width: '150px', marginRight: '40px'}} maxLength="15"/>
          <label><span className='required'>*</span>排序权重</label>
          <Input onChange={this.toChangeInput.bind(this)} defaultValue={weight} style={{width: '50px'}} maxLength="2"/>
        </div>
        <div className='task-conf-items'>
          {this.getTaskNode()}
        </div>
        <div className='task-conf-table'>
          <table>
            <thead>
              <tr>
                <th>序号</th>
                <th>子任务名称</th>
                <th>权重</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {
                selectedTask.map((item, index) => {
                  return (
                    <tr key={'task-conf-detail-tr-' + index}>
                      <td>{index + 1}</td>
                      <td>{item.TaskName}</td>
                      <td><Input style={{width: '50px'}} value={item.Weight} onChange={this.toEditWeight.bind(this, index)}/></td>
                      <td>
                        <span className='task-conf-handlable' onClick={this.toCancel.bind(this, index, item)}>删除</span>
                      </td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}
export default connect(({taskConf}) => {
  return {
    ...taskConf
  }
})(TaskConfDetail)
