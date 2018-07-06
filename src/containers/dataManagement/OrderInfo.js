import { Row, Col, Icon, Table, Form, Select, Button } from 'antd'
import { notification } from 'pilipa'
import React from 'react'
import { connect } from 'react-redux'
import styles from '@/stylus/modifydata'
import Modal from '@/components/common/Modal'
import ContractModify from '@/containers/dataManagement/ContractModify'
import { updateGetmainitemList, updateOrderList, updateOrderItem } from '@/actions/dataedit'
import { fDate, fOrderStatus, fOrderSource, fServiceStatus, fCheckStatus, fAccountantStatus, fContractStatus, fAssigningObject } from '@/utils/filters'
import { saveDataEditOrderList } from '@/utils/api'
const FormItem = Form.Item
const Option = Select.Option

class OrderInfo extends React.Component {
  componentWillMount () {
    this.props.dispatch(updateGetmainitemList())
    this.props.dispatch(updateOrderList(this.props.Id))
  }
  editOrder (item, index) {
    item = $.extend(true, {}, item)
    this.props.dispatch(updateOrderItem(item))
    const modal = Modal.show({
      content: (
        <ContractModify />
      ),
      title: '修改订单',
      mask: true,
      width: 1100,
      okText: '保存',
      cancelText: '',
      onOk: () => {
        const { orderList, orderItem } = this.props
        if (!this.toValidOrderItem()) {
          return
        }
        orderList[index] = orderItem
        this.props.dispatch({
          type: 'update data edit order list',
          payload: $.extend(true, [], orderList)
        })
        modal.hide()
      },
      onCancel: () => {
        modal.hide()
      }
    })
  }
  toValidOrderItem () {
    const { CrmOrderItems, PayInfoList } = this.props.orderItem
    console.log(PayInfoList, 'PayInfoList')
    const obj = {
      ContractNo: '合同编号',
      MainItemName: '主项目',
      ChildItemName: '子项目',
      Amount: '费用'
    }
    const payobj = {
      PayAccountNo: '支付账号',
      PayTime: '支付时间'
    }
    for (const item of CrmOrderItems) {
      for (const field in obj) {
        if (!item[field]) {
          notification.warning({
            message: `${obj[field]}不能为空`
          })
          return false
        }
      }
    }
    for (const item2 of PayInfoList) {
      for (const field2 in payobj) {
        if (!item2[field2] && [5, 6].indexOf(item2.PayTypeId) === -1) {
          notification.warning({
            message: `${payobj[field2]}不能为空`
          })
          return false
        }
      }
    }
    return true
  }
  toDelete (field, index) {
    const { orderList } = this.props
    orderList[index][field] = 0
    // orderList.splice(index, 1)
    this.props.dispatch({
      type: 'update data edit order list',
      payload: $.extend(true, [], orderList)
    })
  }
  toSave () {
    const { orderList } = this.props
    saveDataEditOrderList({
      Orders: orderList,
      CustomerId: this.props.Id,
      TypeExchange: 0
    }).then(res => {
      if (res.status) {
        notification.success({
          message: '保存成功'
        })
      }
    })
  }
  handleChange (field, index, value) {
    const { orderList } = this.props
    orderList[index][field] = value
    this.props.dispatch({
      type: 'update data edit order list',
      payload: $.extend(true, [], orderList)
    })
  }
  render () {
    const { orderList } = this.props
    const columns = [{
      title: '合同编号',
      dataIndex: 'ContractNo'
    }, {
      title: '项目',
      dataIndex: 'MainItemName'
    }, {
      title: '子项目',
      dataIndex: 'ChildItemName'
    }, {
      title: '费用',
      dataIndex: 'Amount'
    }, {
      title: '服务期限',
      dataIndex: 'OrderMonths',
      render: (val, row) => {
        const m = row.GiftMonths || 0
        return val + m
      }
    }, {
      title: '开始服务时间',
      dataIndex: 'ServiceStart',
      render: val => fDate(val)
    }, {
      title: '合同状态',
      dataIndex: 'OrderStatus',
      render: (val, row) => fContractStatus(val)
    }, {
      title: '服务状态',
      dataIndex: 'ServiceStatus',
      render: val => fServiceStatus(val)
    }, {
      title: '任务单号',
      dataIndex: 'TaskBillNo'
    }, {
      title: '分配对象',
      dataIndex: 'AssigningObject',
      render: val => fAssigningObject(val)
    }, {
      title: '外勤状态',
      dataIndex: 'OutWorkerStatus',
      render: val => fCheckStatus(val)
    }, {
      title: '会计状态',
      dataIndex: 'AccountantStatus',
      render: val => fAccountantStatus(val)
    }]
    console.log(orderList, 'orderList')
    return (
      <div>
        {
          orderList.map((item, index) => {
            return (
              item.Status !== 0 &&
              (<div key={item.OrderId} style={{ marginBottom: '50px' }}>
                <Row>
                  <Col span={5}>
                    <label>订单号：</label>
                    <span>{item.OrderNo}</span>
                  </Col>
                  <Col span={5}>
                    <label>订单总额：</label>
                    <span>{item.Amount}</span>
                  </Col>
                  <Col span={5}>
                    <label>签单销售：</label>
                    <span>{item.OrderSalesName}</span>
                  </Col>
                  <Col span={5}>
                    <label>签单日期：</label>
                    <span>{fDate(item.ContractDate)}</span>
                  </Col>
                  <Col span={4}>
                    <Icon className={styles['icon-size']} type="delete" onClick={this.toDelete.bind(this, 'Status', index)} />
                    <Icon className={styles['icon-size']} type="edit" onClick={e => this.editOrder(item, index)}/>
                  </Col>
                </Row>
                <Row style={{ marginBottom: '20px' }}>
                  <Col span={5}>
                    <label>创建日期：</label>
                    <span>{fDate(item.CreateDate)}</span>
                  </Col>
                  <Col span={5}>
                    <label>来源：</label>
                    <span>{fOrderSource(item.OrderSourceId)}</span>
                  </Col>
                  <Col span={5}>
                    <label>订单状态：</label>
                    <Select defaultValue={'' + item.OrderStatus} style={{ width: 150 }} onChange={this.handleChange.bind(this, 'OrderStatus', index)}>
                      <Option key='1' value='1'>审单待审核</Option>
                      <Option key='2' value='2'>审单已审核</Option>
                      <Option key='3' value='3'>审单驳回</Option>
                      <Option key='4' value='4'>财务已审核/网店到款</Option>
                      <Option key='5' value='5'>财务已驳回</Option>
                      <Option key='6' value='6'>财务确认</Option>
                    </Select>
                  </Col>
                </Row>
                <Table
                  rowKey={(record, tindex) => `order-info-tr-${tindex}`}
                  dataSource={
                    item.CrmOrderItems.length === 1 && item.CrmOrderItems[0] === null
                      ? [] : item.CrmOrderItems || []
                  }
                  columns={columns}
                  pagination={false}
                />
              </div>)
            )
          })
        }
        <div style={{ textAlign: 'center' }}>
          <Button type="primary" onClick={this.toSave.bind(this)}>保存</Button>
        </div>
      </div>
    )
  }
}
export default connect(({dataedit}) => {
  return {
    ...dataedit
  }
})(OrderInfo)
