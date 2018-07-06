import React from 'react'
import { Form, Input } from 'antd'

const FormItem = Form.Item
class StrategyCon1 extends React.Component {
  constructor (props) {
    super(props)
    this.getValue = this.getValue.bind(this)
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
    const data = this.props.data || {}
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          label="策略名称"
        >
          {getFieldDecorator('name', {
            rules: [{
              required: true, message: '请输入策略名称！'
            }],
            initialValue: data.name
          })(
            <Input readOnly={data.name}/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="策略描述"
        >
          {getFieldDecorator('desc', {
            initialValue: data.desc
          })(
            <Input.TextArea readOnly={data.name}/>
          )}
        </FormItem>
      </Form>)
  }
}
export default Form.create()(StrategyCon1)
