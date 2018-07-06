import React from 'react'
import styles from '@/stylus/returnvisit'
import { Row, Col, Form, Input, Select, DatePicker, Radio } from 'antd'
import moment from 'moment'
import { fetchVisitSelectCode } from '@/utils/api'

const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group
const { TextArea } = Input

class Main extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      data: {},
      communicationResultsSelect: [],
      accountingAppraisalSelect: [],
      feedbackSelect: []
    }
    this.fetchCommunicationResults = this.fetchCommunicationResults.bind(this)
    this.fetchAccappraisal = this.fetchAccappraisal.bind(this)
    this.fetchFeedback = this.fetchFeedback.bind(this)
  }
  handleSubmit (e) {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('所有输入域字段', values)
      }
    })
  }
  componentWillMount () {
    this.fetchCommunicationResults()
    this.fetchAccappraisal()
    this.fetchFeedback()
  }
  fetchCommunicationResults () {
    let params = {
      type: 'comresults'
    }
    fetchVisitSelectCode(params).then(res => {
      if (res.status) {
        this.setState({
          communicationResultsSelect: res.data
        })
      }
    })
  }
  fetchAccappraisal () {
    let params = {
      type: 'accappraisal'
    }
    fetchVisitSelectCode(params).then(res => {
      if (res.status) {
        this.setState({
          accountingAppraisalSelect: res.data
        })
      }
    })
  }
  fetchFeedback () {
    let params = {
      type: 'feedback'
    }
    fetchVisitSelectCode(params).then(res => {
      if (res.status) {
        this.setState({
          feedbackSelect: res.data
        })
      }
    })
  }
  render () {
    const props = this.props
    // const item = this.props.item
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 }
      }
    }
    return (
      <Form className={styles.con} onSubmit={this.handleSubmit.bind(this)}>
        <div>
          <div className={styles.tip}>
            <span>客户信息</span>
          </div>
          <Row>
            <Col span={12}>
              <label>直营/代理商：</label>
              <span>{props.data.channelname}</span>
            </Col>
            <Col span={12}>
              <label>客户地址：</label>
              <span>{props.data.provincename || ''} </span>
              <span>{props.data.cityname || ''}</span>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <label>客户名称：</label>
              <span>{props.data.name}</span>
            </Col>
            <Col span={12}>
              <label>联系人：</label>
              <span>{props.data.contacts}</span>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <label>服务截止时间：</label>
              <span>{props.data.serviceend}</span>
            </Col>
            <Col span={12}>
              <label>联系电话：</label>
              <span>{props.data.mobile}</span>
            </Col>
          </Row>
        </div>
        <div>
          <div className={styles.tip}>
            <span>沟通情况</span>
          </div>
          <Row>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                label="联系日期"
              >
                {getFieldDecorator('contactdata', {
                  rules: [{
                    required: true, message: '请填写联系日期!'
                  }],
                  initialValue: props.data.contactdata ? moment(props.data.contactdata) : null
                })(
                  <DatePicker placeholder="请选择" disabled={props.readOnly}/>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                label="预约日期"
              >
                {getFieldDecorator('reservedata', {
                  rules: [{
                    required: true, message: '请填写预约日期!'
                  }],
                  initialValue: props.data.reservedata ? moment(props.data.reservedata) : null
                })(
                  <DatePicker placeholder="请选择" disabled={props.readOnly}/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                label="是否预约"
              >
                {getFieldDecorator('isreserve', {
                  rules: [{
                    required: true, message: '请选择是否预约!'
                  }],
                  initialValue: props.data.isreserve
                })(
                  <RadioGroup disabled={props.readOnly}>
                    <Radio value="1">是</Radio>
                    <Radio value="2">否</Radio>
                  </RadioGroup>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                label="沟通结果"
              >
                {getFieldDecorator('communicationresults', {
                  rules: [{
                    required: true, message: '请选择沟通结果!'
                  }],
                  initialValue: props.data.communicationresults
                })(
                  <Select placeholder="请选择" style={{width: 150}} disabled={props.readOnly}>
                    {
                      this.state.communicationResultsSelect.map(d => {
                        return (
                          <Option key={d.code}>{d.value}</Option>
                        )
                      })
                    }
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
        </div>
        <div>
          <div className={styles.tip}>
            <span>评价反馈</span>
          </div>
          <Row>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                label="总体服务"
              >
                {getFieldDecorator('overallservice', {
                  initialValue: props.data.overallservice
                })(
                  <RadioGroup disabled={props.readOnly}>
                    <Radio value="1">优秀</Radio>
                    <Radio value="2">良好</Radio>
                    <Radio value="3">差</Radio>
                  </RadioGroup>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                label="会计评价"
              >
                {getFieldDecorator('accountingappraisal', {
                  initialValue: props.data.accountingappraisal
                })(
                  <Select placeholder="请选择" style={{width: 150}} disabled={props.readOnly}>
                    {
                      this.state.accountingAppraisalSelect.map(d => {
                        return (
                          <Option key={d.code}>{d.value}</Option>
                        )
                      })
                    }
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                label="续费意愿"
              >
                {getFieldDecorator('renewalswish', {
                  initialValue: props.data.renewalswish
                })(
                  <RadioGroup disabled={props.readOnly}>
                    <Radio value="1">有</Radio>
                    <Radio value="2">无</Radio>
                    <Radio value="3">不确定</Radio>
                  </RadioGroup>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                label="介绍意愿"
              >
                {getFieldDecorator('introducewish', {
                  initialValue: props.data.introducewish
                })(
                  <RadioGroup disabled={props.readOnly}>
                    <Radio value="1">有</Radio>
                    <Radio value="2">无</Radio>
                    <Radio value="3">不确定</Radio>
                  </RadioGroup>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                label="客户反馈"
              >
                {getFieldDecorator('customerfeedback', {
                  initialValue: props.data.customerfeedback
                })(
                  <Select placeholder="请选择" style={{width: 150}} disabled={props.readOnly}>
                    {
                      this.state.feedbackSelect.map(d => {
                        return (
                          <Option key={d.code}>{d.value}</Option>
                        )
                      })
                    }
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                label="反馈内容"
              >
                {getFieldDecorator('customerfeedbackcontent', {
                  initialValue: props.data.customerfeedbackcontent
                })(
                  <TextArea disabled={props.readOnly}/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                label="需求"
              >
                {getFieldDecorator('demand', {
                  initialValue: props.data.demand
                })(
                  <TextArea disabled={props.readOnly}/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                label="备注"
              >
                {getFieldDecorator('remark', {
                  initialValue: props.data.remark
                })(
                  <TextArea disabled={props.readOnly}/>
                )}
              </FormItem>
            </Col>
          </Row>
        </div>
      </Form>
    )
  }
}
export default Form.create()(Main)
