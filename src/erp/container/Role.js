import React from 'react'
import { Form, Input, Select } from 'antd'
import Powers from '@/erp/container/Powers'
const FormItem = Form.Item;
const Option = Select.Option

class Role extends React.Component {
    render () {
        const formItemLayout = {
          labelCol: {
            xs: { span: 24 },
            sm: { span: 2 },
          },
          wrapperCol: {
            xs: { span: 24 },
            sm: { span: 22 },
          },
        };
        const props = this.props;
        const { getFieldDecorator } = props.form;
        return (
        <Form>
            <FormItem
              {...formItemLayout}
              label="角色名称"
              hasFeedback
            >
              {getFieldDecorator('RoleName', {
                rules: [{
                  required: true, message: '请填写角色名称!',
                }],
                initialValue: props.role.RoleName
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="角色类型"
            >
              {getFieldDecorator('Category',{initialValue: props.role.Category})(
                <Select>
                  <Option value="1">管理员</Option>
                  <Option value="2">总经理</Option>
                  <Option value="3">财务总监</Option>
                  <Option value="4">销售总监</Option>
                  <Option value="5">提单员</Option>
                  <Option value="9">审单员</Option>
                  <Option value="6">销售</Option>
                  <Option value="8">外勤主管</Option>
                  <Option value="7">外勤</Option>
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="默认权限"
              hasFeedback
            >
              {getFieldDecorator('FunctionList', {
                rules: [{
                  required: true, message: '请选择默认权限!',
                }],
                initialValue: props.role.FunctionList
              })(
                <Powers/>
              )}
            </FormItem>
          </Form>
        )
    }
}

export default Form.create()(Role);
