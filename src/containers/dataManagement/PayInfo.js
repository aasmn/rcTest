import { Row, Col, Button, DatePicker, Select, message, Input } from 'antd'
import React from 'react'
import _ from 'lodash'
import moment from 'moment'
import Rif from '@/components/RIF'
// import UploadFile from '@/containers/dataManagement/UploadFile'
import PayTypeSelect from '@/containers/dataManagement/PayTypeSelect'
import FileUploader from '@/components/common/FileUploader'
import stores from '@/stores'
import { updateOrderItem } from '@/actions/dataedit'
import styles from '@/stylus/modifydata'
const { dispatch } = stores
class PayInfo extends React.Component {
  constructor (props) {
    super(props)
    this.state = props.data
    this.setStateChange = this.setStateChange.bind(this)
  }
  setStateChange (obj) {
    this.setState(obj, () => {
      this.props.onChange(this.state)
    })
  }
  fileUploaded (path) {
    this.setStateChange({ PayImagePath: path[0] })
  }
  render () {
    return (
      <Row style={{ lineHeight: '34px' }}>
        <span key="pay1">
          <label className="ant-form-item-required">支付方式：</label>
          <PayTypeSelect width={120} value={this.state.PayTypeId} onChange={v => { this.setStateChange({ PayTypeId: v }) }} />
        </span>
        <Rif key="pay2" if={(+this.state.PayTypeId) < 5}>
          <span>
            <label className="ant-form-item-required">支付方账号：</label>
            <Input style={{ width: '110px' }} defaultValue={this.state.PayAccountNo} onBlur={v => { this.setStateChange({ PayAccountNo: v.target.value }) }} />
          </span>
        </Rif>
        <Rif key="pay3" if={(+this.state.PayTypeId) < 6}>
          <span>
            <label className="ant-form-item-required">支付时间：</label>
            <DatePicker style={{ width: '125px' }} defaultValue={this.state.PayTime && moment(this.state.PayTime)} onChange={v => { this.setStateChange({ PayTime: v }) }} />
          </span>
        </Rif>
        <Rif key="pay4" if={(+this.state.PayTypeId) < 5}>
          <span>
            <label className="ant-form-item-required">凭证：</label>
            <FileUploader path={this.state.PayImagePath} uploaded={this.fileUploaded.bind(this)} />
          </span>
        </Rif>
        <Rif key="pay5" if={(+this.state.PayTypeId) < 6}>
          <span>
            <Button size="small" style={{margin: '4px'}} onClick={this.props.onAdd}>添加</Button>
            <Button size="small" onClick={this.props.onDelete}>删除</Button>
          </span>
        </Rif>
      </Row>
    )
  }
}
class Main extends React.Component {
  constructor (props) {
    super(props)
    const { contractInfo, mainItemList, orderItem } = stores.getState().dataedit
    this.state = {
      contractInfo,
      mainItemList,
      orderItem
    }
    this.unsubscribe = stores.subscribe(() => {
      const state = stores.getState()
      const { contractInfo, mainItemList, orderItem } = state.dataedit
      this.setState({
        contractInfo,
        mainItemList,
        orderItem
      })
    })
    this.onFiledChange = this.onFiledChange.bind(this)
    this.getFieldsValue = this.getFieldsValue.bind(this)
    this.validateField = this.validateField.bind(this)
  }
  componentWillUnmount () {
    this.unsubscribe()
  }
  onAdd (index) {
    const { orderItem } = this.state
    const { PayInfoList, OrderSourceId } = orderItem
    PayInfoList.splice(index + 1, 0, { PayTypeId: 1, id: _.uniqueId('pid_') })
    orderItem.PayInfoList = PayInfoList
    dispatch(updateOrderItem(orderItem))
  }
  onDelete (index) {
    const { orderItem } = this.state
    const { PayInfoList, OrderSourceId } = orderItem
    PayInfoList.splice(index, 1)
    // PayInfoList[index]['Status'] = 0
    orderItem.PayInfoList = PayInfoList
    dispatch(updateOrderItem(orderItem))
  }
  onFiledChange (index, value) {
    const { orderItem } = this.state
    const { PayInfoList, OrderSourceId } = orderItem
    let paylist = PayInfoList
    if (_.isObject(value.PayTime)) {
      value.PayTime = value.PayTime.format('YYYY-MM-DD')
    }
    paylist[index] = value
    orderItem.PayInfoList = paylist
    dispatch(updateOrderItem(orderItem))
  }
  getFieldsValue () {
    return this.state
  }
  validateField () {
    const { orderItem } = this.state
    const { PayInfoList, OrderSourceId } = orderItem
    // var data = this.state
    const paylist = PayInfoList
    let msg
    for (let i = 0; i < paylist.length; i++) {
      msg = validatePay(paylist[i])
      if (msg) {
        return msg
      }
    }
    return false
    function validatePay (pay) {
      if (!pay.PayTypeId) return '请选择支付方式！'
      if (+pay.PayTypeId > 5) return
      if (!pay.PayTime) return '请选择支付时间！'
      if (+pay.PayTypeId < 5) {
        if (!pay.PayAccountNo) return '请选择支付账号！'
        if (!pay.PayImagePath) return '请上传支付凭证！'
      }
      return false
    }
  }
  render () {
    const { PayInfoList, OrderSourceId } = this.state.orderItem
    return (
      <div className={styles['contract-form']}>
        <div className={styles.title}>
          <span>支付信息</span>
        </div>
        <Row style={{padding: '12px 0'}}>
          <Col span={4}>
            <label>订单来源：</label>
            <Select value={OrderSourceId + ''} style={{ width: '80px' }} onChange={v => {
              this.setState({
                OrderSourceId: v
              })
            }}>
              <Option key={'1'}>电销</Option>
              <Option key={'2'}>天猫</Option>
            </Select>
          </Col>
          <Col span={20}>
            {
              PayInfoList.map((pay, index) => {
                return (
                  pay.Status !== 0 &&
                  <PayInfo
                    key={pay.id || pay.Id}
                    data={pay}
                    onChange={v => this.onFiledChange(index, v)}
                    onAdd={() => { this.onAdd(index) }}
                    onDelete={() => { this.onDelete(index) }}
                  />
                )
              })
            }
          </Col>
        </Row>
      </div>
    )
  }
}
export default Main
