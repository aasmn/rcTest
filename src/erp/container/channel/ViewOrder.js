import React from 'react'
import '@/erp/style/channel.less'
import _ from 'lodash'
import { Row, Col, Select } from 'antd'
import { fAddedValue, fDate } from '@/erp/config/filters'
import { getListData } from '@/erp/api'
const Option = Select.Option
export default class Main extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      postData: {
        Customer: {}
      },
      citys: '',
      balance: '',
      allprices: [],
      prices: []
    }
  }
  componentWillMount () {
    console.log(this.props)
    // 获取账户余额
    getListData('finance/balance?channelid=' + this.props.Channelid).then(res => {
      if (res.status) {
        this.setState({
          balance: res.data
        })
      }
    })
    this.fetchData()
    // 获取所在城市
    getListData('citybychannel').then(res => {
      if (res.status) {
        this.setState({
          citys: res.data
        })
      }
    })
  }
  async fetchData () {
    const r1 = await getListData('finance/getorders?id=' + this.props.OrderId)
    let query = {
      cityCode: r1.data.Customer.CityCode,
      channelid: this.props.Channelid,
      ischeck: 1
    }
    const r2 = await getListData('cityprice', query)
    const prices = _.find(r2.data, { Id: + r1.data.PayType })
    console.log(prices, 'prices')
    this.setState({
      postData: r1.data,
      prices,
      allprices: r2.data
    })
  }
  render () {
    const { postData, prices } = this.state
    console.log(postData, 'postData')
    return (
      <div className="view-order">
      {
        postData && postData.OrderId &&
        <div>
          <p className="form-control-static">账户余额：
          <span style={{ color: 'red' }}>{'￥' + this.state.balance}</span>
          </p>
          <p className="form-control-static">
            销售：{postData.SalerName} 订单号：{postData.OrderId} 所属公司：{postData.ChannelName} 提单员：{postData.BillName}
            {
              postData.Category != 1 &&
              <span style={{ color: 'red' }}>预提单</span>
            }
            {
              postData.FreChangeOrderId &&
              <span style={{ color: 'red' }}>纳税人类别变更</span>
            }
          </p>
          <div className='gray-line'></div>
          <div className='add-order-title'>
            <span>基本信息</span>
          </div>
          <div className='custom-tips mb-10'>
            <span>【温馨提示】可通过“检索”或“快速录入”按钮，帮您完成工商信息的快速录入。</span>    
          </div>
          <Row>
            <Col span={12}>
              <label>公司名称：</label>
              <span>{postData.Customer.Name}</span>
            </Col>
            <Col span={12}>
              <label>所在城市：</label>
              <Select defaultValue={postData.Customer.CityCode} style={{width: '150px'}} disabled>
                {this.state.citys.length > 0 && this.state.citys.map((item) => {
                  return <Option value={item.CityCode} key={item.CityCode}>{item.CityName}</Option>
                })}
              </Select>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <label>联系人：</label>
              <span>{postData.Customer.Contacts}</span>
            </Col>
            <Col span={12}>
              <label>手机号：</label>
              <span>{postData.Customer.Mobile}</span>
            </Col>
          </Row>
          <div className='add-order-title'>
            <span>工商信息</span>
          </div>
          <Row>
            <Col span={12}>
              <img style={{ width: '200px', height: '150px', marginRight: '20px'}} src={postData.Customer.PersonCardPath}/>
              <img style={{ width: '200px', height: '150px'}} src={postData.Customer.BusinessLicense}/>
            </Col>
            <Col span={12}>
              <Row>
                <Col span={24}>
                  <label>法人姓名：</label>
                  <span>{postData.Customer.LegalPerson}</span>
                </Col>
                <Col span={24}>
                  <label>法人身份证号：</label>
                  <span>{postData.Customer.PersonCardID}</span>
                </Col>
                <Col span={24}>
                  <label>公司住所：</label>
                  <span>{postData.Customer.Address}</span>
                </Col>
                <Col span={24}>
                  <label>统一信用代码：</label>
                  <span>{postData.Customer.RegNO}</span>
                </Col>
                <Col span={24}>
                  <label>营业期限：</label>
                  <span>{postData.Customer.RegisterDate}</span>
                  <span>{postData.Customer.BusnissDeadline}</span>
                </Col>
                <Col span={24}>
                  <label>注册资金：</label>
                  <span>{postData.Customer.RegisteredCapital}</span>
                </Col>
                <Col span={24}>
                  <label>经营范围：</label>
                  <span>{postData.Customer.BusinessScope}</span>
                </Col>
              </Row>
            </Col>
          </Row>
          <div className='add-order-title'>
            <span>合同信息</span>
          </div>
          <Row>
            <Col span={12}>
              <label>合同编号：</label>
              <span>{postData.ContractNO}</span>
            </Col>
            <Col span={12}>
              <label>纳税人类别：</label>
              <span>{fAddedValue(postData.Customer.AddedValue)}</span>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <label>套餐类型：</label>
              {
                postData.FreChangeOrderId ? (<span>产品变更</span>) : (
                (prices && prices.Id) &&
                <span>{prices.PriceName}</span>)
              }
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <label>开始账期：</label>
              <span>{fDate(postData.ServiceStart)}</span>
            </Col>
            <Col span={12}>
              <label>结束账期：</label>
              <span>{fDate(postData.ServiceEnd)}</span>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <label>合同金额：</label>
              <span>{postData.ContractAmount}</span>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <span style={{ color: 'red' }}>(注:合同金额根据所属城市、纳税人类别、套餐类型自动计算，不包含礼包价格。)</span>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <label>合同照片：</label>
              {
                postData.ContractPath &&
                <img style={{ width: '80px', height: '50px', marginRight: '20px'}} src={postData.ContractPath}/>
              }
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <label>备注：</label>
              <span>{postData.Remark}</span>
            </Col>
          </Row>
        </div>
      }
      </div>
    )
  }
}