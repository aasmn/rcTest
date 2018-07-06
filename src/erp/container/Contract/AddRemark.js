import React from 'react';
import { Form, Input, Select } from 'antd';
const FormItem = Form.Item;
const TextArea = Input.TextArea

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class Main extends React.Component {
    getFieldsValue = ()=>{
      this.props.form.validateFields();
      const errors = this.props.form.getFieldsError();
      if(!hasErrors(errors)){
        let formValues =  this.props.form.getFieldsValue()
        return formValues
      }
      return null

    }
    render () {
      const formItemLayout = {
        labelCol: {
          span: 6,
        },
        wrapperCol: {
          span: 16,
        },
      }
      const { getFieldDecorator } = this.props.form;
      return (
        <Form className="tinyForm">
          <FormItem 
            {...formItemLayout}
            label="标签"
           >
            {getFieldDecorator('SignVal', {
              rules: [{
                required: true, message: '请选择标签!',
              }]
            })(
              <Select>
                <Select.Option key="1">低</Select.Option>
                <Select.Option key="2">中</Select.Option>
                <Select.Option key="3">高</Select.Option>
              </Select>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="备注"
          >
            {getFieldDecorator('Remark', {
            })(
              <TextArea/>
            )}
          </FormItem>
        </Form>
        )
    }
}

export default Form.create()(Main);;
