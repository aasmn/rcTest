import React from 'react'
import { Row, Col, Form, Input } from 'antd'
const FormItem = Form.Item
class Main extends React.Component {
  render () {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    }
    return (
      <Form>
        <Row>
          <Col>
            <FormItem
              {...formItemLayout}
              label="中心用户名："
            >
              {getFieldDecorator('companyname', {
                rules: [{
                  required: true, message: '请输入管理员名称!'
                }],
                initialValue: ''
              })(
                <Input placeholder="请输入"/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormItem
              {...formItemLayout}
              label="密码："
            >
              {getFieldDecorator('password', {
                rules: [{
                  required: true, message: '请输入密码!'
                }],
                initialValue: ''
              })(
                <Input placeholder="请输入"/>
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    )
  }
}
export default Form.create()(Main)
