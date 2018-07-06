import React from 'react'
import { Row, Col } from 'antd'
import { fAddedValue, fDate, fMonth, fInfoSource } from '@/utils/filters'
import styles from '@/stylus/serviceCard'
export default class CusDetail1 extends React.Component {
  render () {
    const item = this.props.data || {}
    return (
      <div>
        {
          (+this.props.curKey === 1) &&
          <div>
            <Row className={styles['mt25']}>
              <Col span={8}>
                <label>公司名称：</label>
                <span>{item.CompanyName}</span>
              </Col>
              <Col span={8}>
                <label>地区：</label>
                <span>{item.CityName}</span>
              </Col>
            </Row>
            <Row className={styles['mt25']}>
              <Col span={8}>
                <label>联系人：</label>
                <span>{item.Connector}</span>
              </Col>
              <Col span={8}>
                <label>联系方式：</label>
                <span>{item.Mobile}</span>
              </Col>
              <Col span={8}>
                <label>销售负责人：</label>
                <span>{item.SalesName}</span>
              </Col>
            </Row>
            <Row className={styles['mt25']}>
              <Col span={8}>
                <label>纳税人类别：</label>
                <span>{fAddedValue(item.AddedValue)}</span>
              </Col>
              <Col span={8}>
                <label>信息来源：</label>
                <span>{fInfoSource(item.InfoSource)}</span>
              </Col>
            </Row>
          </div>
        }
        {
          (+this.props.curKey === 2) &&
          <div>
            <Row className={styles['mt25']}>
              <Col span={8}>
                <label>统一社会信息代码：</label>
                <span>{item.RegNO}</span>
              </Col>
              <Col span={8}>
                <label>法人姓名：</label>
                <span>{item.LegalPerson}</span>
              </Col>
              <Col span={8}>
                <label>成立日期：</label>
                <span>{fDate(item.RegisterDate)}</span>
              </Col>
            </Row>
            <Row className={styles['mt25']}>
              <Col span={8}>
                <label>法人身份证：</label>
                <span>{item.PersonCardID}</span>
              </Col>
              <Col span={8}>
                <label>注册资金：</label>
                <span>{item.RegisteredCapital}</span>
              </Col>
              <Col span={8}>
                <label>营业期限：</label>
                <span>{fDate(item.RegisterDate)}至</span>
                {
                  (item.NoDeadLine === 1) && <span>无期限</span>
                }
                {
                  (item.NoDeadLine === 0) && <span>{fDate(item.BusnissDeadline)}</span>
                }
              </Col>
            </Row>
            <Row className={styles['mt25']}>
              <Col span={16}>
                <label>公司住所：</label>
                <span>{item.Address}</span>
              </Col>
            </Row>
            <Row className={styles['mt25']}>
              <Col span={16}>
                <label>经营范围：</label>
                <span>{item.BusinessScope}</span>
              </Col>
            </Row>
          </div>
        }
        {
          (+this.props.curKey === 5) &&
          <div>
            <Row className={styles['mt25']}>
              <Col span={12}>
                <label>首报月：</label>
                <span>{fMonth(item.businessDate)}</span>
              </Col>
              <Col span={12}>
                <label>建账状态：</label>
                <span>{item.businessStatus}</span>
              </Col>
            </Row>
            <Row className={styles['mt25']}>
              <Col span={12}>
                <label>运营会计：</label>
                <span>{item.businessUserName}</span>
              </Col>
              <Col span={12}>
                <label>核算会计：</label>
                <span>{item.accountUserName}</span>
              </Col>
            </Row>
            <Row className={styles['mt25']}>
              {
                item.orders && item.orders.map((d, index) => {
                  return (
                    <Col span={12} key={index}>
                      <label>服务时间：</label>
                      <span>{fDate(d.startDate)}至</span>
                      <span>{fDate(d.endDate)}</span>
                    </Col>
                  )
                })
              }
            </Row>
          </div>
        }
      </div>
    )
  }
}
