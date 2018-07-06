import React from 'react'
import { Form, Icon, Input, Button } from 'antd'
const FormItem = Form.Item

class LoginForm extends React.Component {
  handleSubmit (e) {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('所有输入域字段', values)
      }
    })
  }
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
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0
        },
        sm: {
          span: 16,
          offset: 8
        }
      }
    }
    return (
      <Form onSubmit={this.handleSubmit.bind(this)} className="login-form">
        <FormItem
          {...formItemLayout}
          label="用户名"
        >
          {getFieldDecorator('userName', {
            rules: [{ required: true, msssage: '请填写用户名' }]
          })(
            <Input prefix={<Icon type="user" style={{ color: 'red' }} />} placeholder="用户名" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="密码"
        >
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请填写密码' }]
          })(
            <Input prefix={<Icon type="lock" style={{ color: 'red' }}/>} placeholder="密码" />
          )}
        </FormItem>
        <FormItem
          {...tailFormItemLayout}
        >
          <Button type="primary" htmlType="submit" className="login-form-button">
             登录
          </Button>
        </FormItem>
      </Form>
    )
  }
}
export default Form.create()(LoginForm)
