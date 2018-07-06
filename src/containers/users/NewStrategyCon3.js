import React from 'react'
import { Form, Input, Row, Col } from 'antd'
import ChannelAreaSelect from '@/containers/users/ChannelAreaSelect'
import ProviceSelect from '@/containers/users/ProviceSelect'
import ChannelSelect from '@/containers/users/ChannelSelect'
const FormItem = Form.Item

class StrategyCon3 extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isreadonly: false
    }
    this.getValue = this.getValue.bind(this)
  }
  componentWillMount () {
    if (this.props.isreadonly) {
      this.setState({
        isreadonly: true
      })
    }
  }
  getValue () {
    let result
    this.props.form.validateFields((err, values) => {
      if (!err) {
        result = values
      }
    })
    return result
  }
  render () {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 }
      }
    }
    const data = this.props.data || {}
    return (
      <Form onSubmit={this.handleSubmit}>
        <Row>
          <Col span={12}>
            <div style={{ textAlign: 'center', fontSize: '20px' }}>主数据权限</div>
          </Col>
          <Col span={12}>
            <div style={{ textAlign: 'center', fontSize: '20px' }}>附属数据权限</div>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem
              {...formItemLayout}
              label="大区"
            >
              {getFieldDecorator('mainpromiss.area', {
                initialValue: data.mainpromiss ? data.mainpromiss.area : []
              })(
                <ChannelAreaSelect isreadonly={this.state.isreadonly}/>
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              {...formItemLayout}
              label="大区"
            >
              {getFieldDecorator('attachpromiss.area', {
                initialValue: data.attachpromiss ? data.attachpromiss.area : []
              })(
                <ChannelAreaSelect isreadonly={this.state.isreadonly}/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem
              {...formItemLayout}
              label="省份"
            >
              {getFieldDecorator('mainpromiss.prov', {
                initialValue: data.mainpromiss ? data.mainpromiss.prov : []
              })(
                <ProviceSelect isProvice={true} isreadonly={this.state.isreadonly}/>
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              {...formItemLayout}
              label="省份"
            >
              {getFieldDecorator('attachpromiss.prov', {
                initialValue: data.attachpromiss ? data.attachpromiss.prov : []
              })(
                <ProviceSelect isProvice={true} isreadonly={this.state.isreadonly}/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem
              {...formItemLayout}
              label="城市"
            >
              {getFieldDecorator('mainpromiss.city', {
                initialValue: data.mainpromiss ? data.mainpromiss.city : []
              })(
                <ProviceSelect isProvice={false} isreadonly={this.state.isreadonly}/>
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              {...formItemLayout}
              label="城市"
            >
              {getFieldDecorator('attachpromiss.city', {
                initialValue: data.attachpromiss ? data.attachpromiss.city : []
              })(
                <ProviceSelect isProvice={false} isreadonly={this.state.isreadonly}/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem
              {...formItemLayout}
              label="代理商"
            >
              {getFieldDecorator('mainpromiss.agency', {
                initialValue: data.mainpromiss ? data.mainpromiss.agency : []
              })(
                <ChannelSelect isreadonly={this.state.isreadonly}/>
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              {...formItemLayout}
              label="代理商"
            >
              {getFieldDecorator('attachpromiss.agency', {
                initialValue: data.attachpromiss ? data.attachpromiss.agency : []
              })(
                <ChannelSelect isreadonly={this.state.isreadonly}/>
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    )
  }
}
export default Form.create()(StrategyCon3)
