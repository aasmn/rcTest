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
      prices: {}
    }
  }
  componentWillMount () {
    console.log(this.props)
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
              <span>【温馨提示】支持对二代居民身份证的关键字段识别。上传身份证后，即可自动读取并带出姓名、身份证号等信息。</span>     
            </div>
            <Row>
              <Col span={12}>
                <img style={{ width: '200px', height: '150px', marginRight: '20px'}} src={postData.Customer.PersonCardPath}/>
                {/* <img style={{ width: '200px', height: '150px'}} src={postData.Customer.BusinessLicense}/> */}
              </Col>
              <Col span={12}>
                <Row>
                  <Col span={24}>
                    <label>所在城市：</label>
                    <Select defaultValue={postData.Customer.CityCode} style={{width: '150px'}} disabled>
                      {this.state.citys.length > 0 && this.state.citys.map((item) => {
                        return <Option value={item.CityCode} key={item.CityCode}>{item.CityName}</Option>
                      })}
                    </Select>
                  </Col>
                  <Col span={24}>
                    <label>法人姓名：</label>
                    <span>{postData.Customer.LegalPerson}</span>
                  </Col>
                  <Col span={24}>
                    <label>法人身份证号：</label>
                    <span>{postData.Customer.PersonCardID}</span>
                  </Col>
                  <Col span={24}>
                    <label>联系人：</label>
                    <span>{postData.Customer.Contacts}</span>
                  </Col>
                  <Col span={24}>
                    <label>手机号：</label>
                    <span>{postData.Customer.Mobile}</span>
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
                    <span>{prices.PriceName}</span>
                  )
                }
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
            {
              postData.Status === 3 &&
              <div>
                <div className='add-order-title'>
                  <span>拒审原因</span>
                </div>
                <Row>
                  <Col span={24}>
                    <label>拒审原因：</label>
                    <span style={{ color: 'red' }}>{postData.Remark}</span>
                  </Col>
                </Row>
              </div>
            }
          </div>
        }
      </div>
    )
  }
}