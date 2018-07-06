import React from 'react'
import { Form, Input, Button, Radio } from 'antd'
import styles from '@/stylus/modal'
import PropTypes from 'prop-types'
import DepartmentSelect from '@/containers/users/departmentSelect'
import RoleSelect from '@/containers/users/roleSelect'
import AccountingCenterSelect from '@/containers/users/AccountingCenterSelect'
import { userApi } from '@/utils/api'
import Modal from '@/components/common/Modal'
import { getInstanceByDom } from 'echarts'
const FormItem = Form.Item
const RadioGroup = Radio.Group

class UserInfo extends React.Component {
  constructor (props) {
    super(props)
    this.initialValue = props.user || {}
    this.handleSubmit = this.handleSubmit.bind(this)
    // this.repeatMobile = this.repeatMobile.bind(this)
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
      if (value !== (this.props.user || {}).mobile) {
        userApi.getUaaUser(value).then(res => {
          if (res.status && res.data) {
            const modal = Modal.show({
              content: '此手机号在系统中已存在，如果继续添加将会覆盖他人信息！',
              title: '用户重复提示',
              mask: true,
              onOk: () => {
                // this.repeatMobile(res.data)
                modal.hide()
              },
              onCancel: () => {
                modal.hide()
              }
            })
          }
        })
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
    const props = this.props
    const { getFieldDecorator } = props.form
    return (
      <Form onSubmit={this.handleSubmit} className={styles['user-info']}>
        <FormItem
          {...formItemLayout}
          label="姓名"
          hasFeedback
        >
          {getFieldDecorator('name', {
            rules: [{
              required: true, message: '请填写姓名!'
            }],
            initialValue: props.user.name
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="昵称"
          hasFeedback
        >
          {getFieldDecorator('nickname', {
            rules: [{
              required: true, message: '请填写昵称!'
            }],
            initialValue: props.user.nickname
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="手机号"
          hasFeedback
        >
          {getFieldDecorator('mobile', {
            rules: [
              { required: true, message: '请输入手机号码！' },
              { validator: validatePhoneRepeat }
            ],
            initialValue: props.user.mobile
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="邮箱"
        >
          {getFieldDecorator('email', {
            rules: [{
              type: 'email', message: '邮箱格式不正确！'
            }, {
              required: true, message: '请输入邮箱'
            }],
            initialValue: props.user.email
          })(
            <Input style={{ width: '100%' }} />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="部门"
        >
          {getFieldDecorator('node', {
            rules: [{
              required: true, message: '请选择部门'
            }],
            initialValue: props.user.node
          })(
            <DepartmentSelect />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="角色"
        >
          {getFieldDecorator('roles', {
            // rules: [{
            //   required: true, message: '请选择角色'
            // }],
            initialValue: props.user.roles
          })(
            <RoleSelect />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="核算中心"
        >
          {getFieldDecorator('accounting', {
            initialValue: props.user.accounting
          })(
            <AccountingCenterSelect />
          )}
        </FormItem>
      </Form>
    )
  }
}
UserInfo.propTypes = {
  user: PropTypes.object.isRequired,
  isNew: PropTypes.bool
}
export default Form.create()(UserInfo)
