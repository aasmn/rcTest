import React from 'react';
import { Button, message } from 'antd';
import { getSubTask, getTaskConfigList } from '@/erp/store/actions'
import store from '@/erp/store'
import { postData } from '@/erp/api'
import { connect } from 'react-redux'
import Dialog from '@/erp/container/Dialog'
import TaskConfItem from '@/erp/container/Outworker/TaskConfItem'
import TaskConfDetail from '@/erp/container/Outworker/TaskConfDetail'
class TaskConfig extends React.Component {
  componentWillMount () {
    this.props.dispatch(getSubTask())
    this.props.dispatch(getTaskConfigList())
  }
  mapList () {
    const { list } = this.props
    const node = []
    let i = 0
    for (let key in list) {
      node.push((<TaskConfItem key={'task-conf-item-' + i} title={list[key][0].CommonTaskName} data={list[key]}/>))
      i++
    }
    return node
  }
  addConf () {
    Dialog({
      content: <TaskConfDetail data={[]}/>,
      width: 900,
      handleOk: ()=>{
        return new Promise((resolve, reject) => {
          const data = store.getState().taskConf.detailInfo;
          if(!data.CommonTaskName){
            message.error("请输入通办任务名称");
            reject();
            return;
          }
          if(!data.Weight){
            message.error("请输入通办任务权重");
            reject();
            return;
          }

          postData('commontask', store.getState().taskConf.detailInfo).then((res) => {
            this.props.dispatch(getTaskConfigList())
            resolve()
          })
        })
      },
      confirmLoading: false,
      handleCancel (){
          console.log('onCancel')
      },
      title: "新增通办任务"
    }).result;
    this.props.dispatch({
      type: 'change outworker task config selected task',
      data: []
    })
    this.props.dispatch({
      type: 'change outworker task config detail info',
      payload: {
        CommonTaskName: '',
        Weight: 0,
        Status: 2
      }
    })
  }
  render () {
    console.log(this.props)
    return (
      <div className="task-config-container">
        <div className="task-config-top well">
          <Button type="primary" onClick={this.addConf.bind(this)}>新增</Button>
        </div>
        {this.mapList()}
      </div>
    )
  }
}
export default connect(({common, taskConf}) => {
  return {
    ...common,
    list: taskConf.list
  }
})(TaskConfig)
