import React from 'react'
import styles from '@/stylus/modifydata'
import { notification } from 'pilipa'
import _ from 'lodash'
import moment from 'moment'
import Modal from '@/components/common/Modal'
import AddedValue from '@/containers/searchComponent/AddedValue'
import { Button, Col, DatePicker, Input, message, Row, Select } from 'antd'
import { fContractStatus, fDate } from '@/utils/filters'
import ContractType from '@/containers/dataManagement/ContractType'
import stores from '@/stores'
import { updateOrderItem } from '@/actions/dataedit'
const { dispatch } = stores
const { TextArea } = Input
const Option = Select.Option
class Main extends React.Component {
  constructor (props) {
    super(props)
    const { contractInfo, mainItemList, orderItem } = stores.getState().dataedit
    this.state = {
      costs: [0, 0, 0, 0],
      contractInfo,
      mainItemList,
      orderItem
    }
    this.addNew = this.addNew.bind(this)
    this.unsubscribe = stores.subscribe(() => {
      const state = stores.getState()
      const { contractInfo, mainItemList, orderItem } = state.dataedit
      this.setState({
        contractInfo,
        mainItemList,
        orderItem
      })
      this.handleCost()
    })
  }
  componentWillMount () {
    this.handleCost()
  }
  componentWillUnmount () {
    this.unsubscribe()
  }
  addNew () {
    const modal = Modal.show({
      content: (
        <ContractType cb={() => { modal.hide() }} />
      ),
      title: '合同类型',
      mask: true,
      width: 400,
      footer: null,
      onCancel: () => {
        modal.hide()
      }
    })
  }
  getAmounts () {
    const { costs } = this.state
    let sum = 0
    costs.map((item) => {
      sum += item
    })
    return sum
  }
  getNode (index) {
    const { contractInfo, mainItemList, orderItem } = this.state
    const Rows = contractInfo[index]
    const Nodes = []
    const length = Rows.length
    Rows.map((item, index2) => {
      item = item || {}
      const Options = mainItemList[item.MainItemId - 1].Children
      Nodes.push(
        <tr key={`contract-info-${index}-${index2}`}>
          {
            ((length > 1 && index2 === 0) || length === 1) &&
            <td rowSpan={length}>
              <Input
                size="small"
                defaultValue={item.ContractNo}
                onChange={this.handleChange.bind(this, 'ContractNo', index, index2)}
              />
            </td>
          }
          <td>
            {index === 0 && <span>记账保税</span>}
            {
              index === 1 && (
                <Select
                  defaultValue={item.MainItemId}
                  size="small"
                  style={{ width: 120 }}
                  onChange={this.handleChange.bind(this, 'MainItemId', index, index2)}
                >
                  <Select.Option value={2}>财务服务费</Select.Option>
                  <Select.Option value={3}>外勤服务费</Select.Option>
                </Select>
              )
            }
            {index === 2 && <span>代收费</span>}
          </td>
          <td>
            {
              <Select
                size="small"
                style={{ width: 120 }}
                defaultValue={item.ChildItemId}
                value={item.ChildItemId}
                onChange={this.handleChange.bind(this, 'ChildItemId', index, index2)}
              >
                {
                  Options.map((item, index) => {
                    return (
                      <Select.Option
                        key={`contract-option1-${index}`}
                        value={item.Id}
                        onChange={this.handleChange.bind(this, 2, index, index2)}
                      >
                        {item.ChildItemName}
                      </Select.Option>
                    )
                  })
                }
              </Select>
            }
          </td>
          <td>
            <Input
              size="small"
              defaultValue={item.Amount}
              onChange={this.handleChange.bind(this, 'Amount', index, index2)}
            />
          </td>
          <td>
            <Input
              size="small"
              // onChange={this.handleChange.bind(this, 4, index, index2)}
            />
          </td>
          <td></td>
          <td></td>
          {/* <td>{fContractStatus(item.OrderStatus)}</td> */}
          <td>
            <Select defaultValue={'' + item.OrderStatus} style={{ width: 150 }} onChange={this.handleChange.bind(this, 'OrderStatus', index, index2)}>
              <Option key='1' value='1'>正常</Option>
              <Option key='2' value='2'>已结束</Option>
              <Option key='3' value='3'>已中止</Option>
              <Option key='4' value='4'>已作废</Option>
              <Option key='5' value='5'>已变更</Option>
              <Option key='6' value='6'>变更中</Option>
              <Option key='7' value='7'>中止中</Option>
            </Select>
          </td>
          <td>
            {
              index !== 0 && (
                <Button size="small" onClick={this.operateChildItem.bind(this, index, -1)}>
                  添加子项目
                </Button>
              )
            }
            <Button size="small" onClick={this.operateChildItem.bind(this, index, index2)}>删除</Button>
          </td>
        </tr>
      )
    })
    return Nodes
  }
  handleChange (field, index1, index2, value) {
    const { contractInfo, mainItemList, orderItem } = this.state
    const CrmOrderItems = []
    const contractItem = contractInfo[index1][index2] || {}
    if (['ContractNo', 'Amount', 'OrderMonths', 'GiftMonths'].indexOf(field) > -1) {
      value = value.target.value
    }
    if (field === 'MainItemId') {
      contractItem.ChildItemId = ''
    }
    if (['ServiceStart', 'ServiceEnd'].indexOf(field) > -1) {
      value = value.format('YYYY-MM-DD')
    }
    contractItem[field] = value
    // 计算其他属性
    if (['OrderMonths', 'GiftMonths', 'ServiceStart'].indexOf(field) > -1) {
      contractItem.OrderMonths = Number(contractItem.OrderMonths) || 0
      contractItem.GiftMonths = Number(contractItem.GiftMonths) || 0
      const months = contractItem.OrderMonths + contractItem.GiftMonths
      if (!months) {
        notification.warning({
          message: '请先设置服务期限'
        })
        return
      }
      contractItem.ServiceEnd = moment(contractItem.ServiceStart).add(months - 1, 'months').endOf('month').format('YYYY-MM-DD')
      console.log(months, contractItem.ServiceEnd, 'end')
    }
    contractItem.MainItemName = mainItemList[contractItem.MainItemId - 1].Name
    if (field === 'ChildItemId') {
      const option = _.find(mainItemList[contractItem.MainItemId - 1].Children, {Id: contractItem[field]}) || {}
      contractItem.ChildItemName = option.ChildItemName
    }
    if (field === 'ContractNo') {
      contractInfo[index1].map((item) => {
        item.ContractNo = value
      })
    }
    if (field === 'OrderStatus') {
      contractInfo[index1].map((item) => {
        item.OrderStatus = value
      })
    }
    contractInfo.map((item) => {
      item.map((item2) => {
        CrmOrderItems.push(item2)
      })
    })
    const payload = orderItem
    payload.CrmOrderItems = CrmOrderItems
    dispatch(updateOrderItem(payload))
  }
  handleChange2 (field, value) {
    const { orderItem } = this.state
    if (['ContractDate'].indexOf(field) > -1) {
      value = value.format('YYYY-MM-DD')
    }
    if (['Remark'].indexOf(field) > -1) {
      value = value.target.value
    }
    orderItem[field] = value
    dispatch(updateOrderItem(orderItem))
  }
  operateChildItem (index, index2) {
    const { contractInfo, mainItemList, orderItem } = this.state
    const MainItemId = index === 2 ? 4 : index + 1
    const CrmOrderItems = []

    if (index2 === -1) {
      contractInfo[index].push({
        MainItemId,
        ContractNo: contractInfo[index][0].ContractNo || '',
        MainItemName: mainItemList[MainItemId - 1],
        OrderId: contractInfo[index][0].OrderId
      })
    } else {
      contractInfo[index].splice(index2, 1)
    }

    contractInfo.map((item) => {
      item.map((item2) => {
        CrmOrderItems.push(item2)
      })
    })
    const payload = orderItem
    payload.CrmOrderItems = CrmOrderItems
    dispatch(updateOrderItem(payload))
  }
  handleCost () {
    const { contractInfo } = this.state
    const costs = [0, 0, 0, 0]
    contractInfo.map((item) => {
      item.map((item2) => {
        costs[item2.MainItemId - 1] += Number(item2.Amount)
      })
    })
    this.setState({
      costs
    })
  }
  render () {
    const { contractInfo, costs, orderItem } = this.state
    return (
      <div className={styles['contract-form']}>
        <div className={styles.title}>
          <span>合同信息</span>
          <Button
            className={styles['add-contract']}
            size="small"
            type="primary"
            onClick={this.addNew}>添加合同</Button>
        </div>
        <div>
          <table>
            <thead>
              <tr>
                <th style={{width: '200px'}}><span>合同编号</span></th>
                <th style={{width: '100px'}}><span>项目</span></th>
                <th style={{width: '100px'}}><span>子项目</span></th>
                <th style={{width: '145px'}}><span>费用</span></th>
                <th style={{width: '145px'}}><span>备注</span></th>
                <th style={{width: '90px'}}>领用金额</th>
                <th style={{width: '90px'}}>退费金额</th>
                <th style={{width: '90px'}}>合同状态</th>
                <th style={{width: '200px'}}><span>操作</span></th>
              </tr>
            </thead>
            <tbody>
              {this.getNode(0)}
              {
                contractInfo[0].length >= 1 && (
                  <tr>
                    <td
                      colSpan={9}
                      style={{
                        background: 'rgb(248, 215, 149)',
                        padding: '3px 12px',
                        textAlign: 'left'
                      }}
                    >
                      服务期限：
                      <Input
                        size="small"
                        style={{width: '35px'}}
                        maxLength={2}
                        defaultValue={contractInfo[0][0].OrderMonths}
                        onChange={this.handleChange.bind(this, 'OrderMonths', 0, 0)}
                      />
                      &nbsp;
                      +
                      &nbsp;
                      <Input
                        size="small"
                        style={{width: '35px'}}
                        maxLength={2}
                        defaultValue={contractInfo[0][0].GiftMonths}
                        onChange={this.handleChange.bind(this, 'GiftMonths', 0, 0)}
                      />
                      &nbsp;&nbsp;
                      服务时间：
                      <DatePicker
                        size="small"
                        allowClear={false}
                        defaultValue={contractInfo[0][0].ServiceStart ? moment(contractInfo[0][0].ServiceStart, 'YYYY-MM-DD') : null}
                        onChange={this.handleChange.bind(this, 'ServiceStart', 0, 0)}
                      />
                      &nbsp;-&nbsp;
                      {
                        contractInfo[0][0].ServiceEnd
                      }
                    </td>
                  </tr>
                )
              }
              {this.getNode(1)}
              {this.getNode(2)}
            </tbody>
            <tfoot>
              <tr>
                <td
                  colSpan={9}
                  className={styles['footer']}
                >
                  <ul>
                    <li>
                      记账报税费用：{costs[0]}
                    </li>
                    <li>
                      财务服务费用：{costs[1]}
                    </li>
                    <li>
                      外勤服务费用：{costs[2]}
                    </li>
                    <li>
                      代收费用：{costs[3]}
                    </li>
                    <li>
                      订单总金额：{this.getAmounts()}
                    </li>
                    <li>
                      <label className="ant-form-item-required">签订日期：</label>
                      <DatePicker
                        size="small"
                        allowClear={false}
                        defaultValue={moment(orderItem.ContractDate, 'YYYY-MM-DD')}
                        onChange={this.handleChange2.bind(this, 'ContractDate')}
                      />
                    </li>
                  </ul>
                </td>
              </tr>
            </tfoot>
          </table>
          <div style={{marginTop: '10px'}}>
            <Row>
              <Col className="gutter-row" span={2}>
                <label style={{fontSize: '12px'}}>备注信息：</label>
              </Col>
              <Col className="gutter-row" span={22}>
                <TextArea defaultValue={orderItem.Remark} onChange={this.handleChange2.bind(this, 'Remark')}/>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    )
  }
}
export default Main
