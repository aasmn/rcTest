import React from 'react'
import { Tabs, Table, Button, message } from 'antd'
import { notification } from 'pilipa'
import { fDate, fMainTaskStatus, fSubTaskStatus, fOutworkStatus, fContractStatus } from '@/utils/filters'
import styles from '@/stylus/serviceCard'
import CusDetail1 from '@/containers/service/cusDetail1'
import ModalTable from '@/containers/customer/ModalTable'
import Modal from '@/components/common/Modal'
import { fetchCustomerServiceDetail, fetchCustomerServiceOrderDetail, fetchCustomerServiceOutworkDetail, fetchOrderDetail, fetchOutworkDetail, fetchAgentDetail } from '@/utils/api'
const TabPane = Tabs.TabPane
export default class CustomerDetail extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      curKey: '1',
      item: {},
      params: {},
      tabData1: {},
      tabData2: [],
      tabData3: [],
      tabData4: [],
      ChildTaskData: []
    }
    this.callback = this.callback.bind(this)
    this.viewOrder = this.viewOrder.bind(this)
    this.viewChildTask = this.viewChildTask.bind(this)
    this.back = this.back.bind(this)
  }
  componentWillMount () {
    console.log(this.props.location, 'key')
    if (!this.props.location.state) {
      this.props.history.push('/customer')
      return
    }
    this.setState({
      item: this.props.location.state.key
    }, () => {
      console.log(this.state.item, 'item')
      let params = {
        systemflag: this.state.item.CusType
      }
      this.setState({
        params: params
      })
      fetchCustomerServiceDetail(this.state.item.Id, params).then(res => {
        if (res.status) {
          this.setState({
            tabData1: res.data[0]
          })
        }
      })
    })
  }
  callback (key) {
    console.log(key)
    this.setState({
      curKey: key
    })
    if (key === '3') {
      fetchCustomerServiceOrderDetail(this.state.item.Id, this.state.params).then(res => {
        if (res.status) {
          this.setState({
            tabData2: res.data
          })
        }
      })
    } else if (key === '4') {
      console.log(this.state.params.systemflag, this.state.params.systemflag === 2, 'system')
      if (this.state.params.systemflag === 2) return
      fetchCustomerServiceOutworkDetail(this.state.item.Id, this.state.params).then(res => {
        if (res.status) {
          this.setState({
            tabData3: res.data
          })
        }
      })
    } else if (key === '5') {
      if (this.state.item && !this.state.item.ServiceCompanyCode) {
        notification.warning({
          message: '基础库统一编码为空'
        })
        return false
      }
      fetchAgentDetail(this.state.item.ServiceCompanyCode).then(res => {
        if (res.status) {
          this.setState({
            tabData4: res.data.data
          })
        }
      })
    }
  }
  back () {
    console.log(this.props, 'this.props')
    this.props.history.go(-1)
  }
  viewOrder (record) {
    const orderModalcolumns = [{
      title: '合同ID',
      dataIndex: 'Id'
    }, {
      title: '项目',
      dataIndex: 'ItemName'
    }, {
      title: '子项目',
      dataIndex: 'ChildItemName'
    }, {
      title: '费用',
      dataIndex: 'Amount'
    }, {
      title: '领用金额',
      dataIndex: 'ReceiveAmount'
    }, {
      title: '退费金额',
      dataIndex: 'RefundAmount'
    }, {
      title: '合同状态',
      dataIndex: 'Status',
      render: val => fContractStatus(val)
    }, {
      title: '备注',
      dataIndex: 'Remark'
    }]
    const modal = Modal.show({
      content: (
        <ModalTable
          type='order'
          Id={record.OrderId}
          params={this.state.params}
          columns={orderModalcolumns}
        />
      ),
      title: '合同详情',
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
    const columns1 = [{
      title: '订单ID',
      dataIndex: 'OrderId'
    }, {
      title: '订单来源',
      dataIndex: 'SourceName'
    }, {
      title: '订单总金额',
      dataIndex: 'Amount'
    }, {
      title: '记账报税费用',
      dataIndex: 'AgentFeed'
    }, {
      title: '外勤服务费用',
      dataIndex: 'OutWorkServiceFeed'
    }, {
      title: '代收费用',
      dataIndex: 'BookKeepFeed'
    }, {
      title: '签单销售',
      dataIndex: 'OrderSalesName'
    }, {
      title: '签定日期',
      dataIndex: 'ContractDate',
      render: val => fDate(val)
    }, {
      title: '备注',
      dataIndex: 'Remark'
    }, {
      title: '操作',
      render: (text, record) => {
        return (
          <span>
            {
              (this.state.item.CusType === 1) && <a onClick={e => { this.viewOrder(record) }}>合同</a>
            }
            {
              (this.state.item.CusType === 2) && <a style={{ cursor: 'not-allowed', color: '#ccc' }}>合同</a>
            }
          </span>
        )
      }
    }]
    const columns2 = [{
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
        console.log(this.state.item, 'this.state.item.')
        return (
          <span>
            {
              (this.state.item.CusType === 1) && <a onClick={e => { this.viewChildTask(record) }}>子任务</a>
            }
            {
              (this.state.item.CusType === 2) && <a style={{ cursor: 'not-allowed' }}>子任务</a>
            }
          </span>
        )
      }
    }]
    return (
      <div className={styles['customer-detail']}>
        <div style={{position: 'relative'}}>
          <h4 className={styles.title}>{this.state.item.CompanyName}</h4>
          <Button className={styles.btn} type="primary" onClick={this.back}>
            返回
          </Button>
        </div>
        <div className={styles.con} style={{ margin: '24px 24px 0' }}>
          <Tabs defaultActiveKey="1" onChange={this.callback}>
            <TabPane className={styles['basic-info']} tab="客户基本信息" key="1">
              <CusDetail1
                data={this.state.tabData1}
                curKey={this.state.curKey}
              />
            </TabPane>
            <TabPane className={styles['basic-info']} tab="客户工商信息" key="2">
              <CusDetail1
                data={this.state.tabData1}
                curKey={this.state.curKey}
              />
            </TabPane>
            <TabPane className={styles['basic-info']} tab="订单合同信息" key="3">
              <Table
                rowKey={record => (record.OrderId)}
                dataSource={this.state.tabData2}
                columns={columns1}
                pagination={false}
              />
            </TabPane>
            <TabPane className={styles['basic-info']} tab="外勤任务信息" key="4">
              <Table
                rowKey={record => (record.Id)}
                dataSource={this.state.tabData3}
                columns={columns2}
                pagination={false}
              />
            </TabPane>
            <TabPane className={styles['basic-info']} tab="会计做账信息" key="5">
              <CusDetail1
                data={this.state.tabData4}
                curKey={this.state.curKey}
              />
            </TabPane>
          </Tabs>
        </div>
      </div>
    )
  }
}
