import React from 'react'
import { Form, Input, Button } from 'antd'
import styles from '@/stylus/modal'
import PropTypes from 'prop-types'
import PowerSet from '@/containers/users/powerSet'

const FormItem = Form.Item

class RoleInfo extends React.Component {
  constructor (props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleSubmit (e) {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log(values, 'values')
      }
    })
  }
  render () {
    const validatePhoneRepeat = (rule, value, cttb) => {
      if (!/^1[3|4|5|7|8][0-9]\d{8}$/.test(value)) {
        cttb('手机号码格式不正确')
        return
      }
      cttb()
    }
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 }
      }
    }
    const role = this.props.role || {}
    const { getFieldDecorator } = this.props.form
    return (
      <Form onSubmit={this.handleSubmit} className={styles['user-info']}>
        <FormItem
          {...formItemLayout}
          label="角色名称"
          hasFeedback
        >
          {getFieldDecorator('name', {
            rules: [{
              required: true, message: '请填写角色名!'
            }],
            initialValue: role.name
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="描述"
          hasFeedback
        >
          {getFieldDecorator('desc', {
            initialValue: role.desc
          })(
            <Input.TextArea />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="描述"
          hasFeedback
        >
          {getFieldDecorator('policies', {
            initialValue: role.policies
          })(
            <PowerSet />
          )}
        </FormItem>
      </Form>
    )
  }
}

export default Form.create()(RoleInfo)
