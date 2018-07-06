import React from 'react'
import { Table } from 'antd'
import ModalTable from '@/containers/customer/ModalTable'
import Modal from '@/components/common/Modal'
import { fDate, fMainTaskStatus, fSubTaskStatus } from '@/utils/filters'
import { fetchCustomerServiceOutworkDetail } from '@/utils/api'
export default class Outwork extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      CusType: 1,
      tabData: [],
      params: {
        systemflag: 1
      }
    }
    this.viewChildTask = this.viewChildTask.bind(this)
  }
  componentWillMount () {
    console.log(this.props.Id, 'this.props.Id')
    fetchCustomerServiceOutworkDetail(this.props.Id, this.state.params).then(res => {
      if (res.status) {
        this.setState({
          tabData: res.data
        })
      }
    })
  }
  viewChildTask (record) {
    const ChildTaskcolumns = [{
      title: '任务ID',
      dataIndex: 'Id'
    }, {
      title: '子任务名称',
      dataIndex: 'TaskName'
    }, {
      title: '当前外勤人员',
      dataIndex: 'OutWorker'
    }, {
      title: '开始时间',
      dataIndex: 'StartTime',
      render: val => fDate(val)
    }, {
      title: '完成时间',
      dataIndex: 'EndTime',
      render: val => fDate(val)
    }, {
      title: '状态',
      dataIndex: 'Status',
      render: val => fSubTaskStatus(val)
    }]
    const modal = Modal.show({
      content: (
        <ModalTable
          type='childTask'
          Id={record.Id}
          params={this.state.params}
          columns={ChildTaskcolumns}
        />
      ),
      title: '子任务',
      mask: true,
      width: 800,
      okText: '',
      cancelText: '',
      footer: null,
      onCancel: () => {
        modal.hide()
      }
    })
  }
  render () {
    const columns = [{
      title: '任务ID',
      dataIndex: 'Id'
    }, {
      title: '任务名称',
      dataIndex: 'MainTaskName'
    }, {
      title: '当前子任务',
      dataIndex: 'childTaskName'
    }, {
      title: '主任务状态',
      dataIndex: 'MainTaskStatus',
      render: val => fMainTaskStatus(val)
    }, {
      title: '当前子任务状态',
      dataIndex: 'Status',
      render: val => fSubTaskStatus(val)
    }, {
      title: '任务提交时间',
      dataIndex: 'SubmitTaskTime',
      render: val => fDate(val)
    }, {
      title: '操作',
      render: (text, record) => {
        return (
          <span>
            {
              (this.state.CusType === 1) && <a onClick={e => { this.viewChildTask(record) }}>子任务</a>
            }
            {
              (this.state.CusType === 2) && <a style={{ cursor: 'not-allowed' }}>子任务</a>
            }
          </span>
        )
      }
    }]
    return (
      <Table
        rowKey={record => (record.Id)}
        dataSource={this.state.tabData}
        columns={columns}
        pagination={false}
      />
    )
  }
}
