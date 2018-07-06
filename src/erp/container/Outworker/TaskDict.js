import React, { Component } from 'react'
import { Form, Input, Radio, Select } from 'antd'
import PropTypes from 'prop-types'

const FormItem = Form.Item;
const Option = Select.Option;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class Main extends Component{
  constructor(props) {
    super(props)
  }

  handleSubmit= (e)=> {
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
        if (!err) {
          this.props.onSubmit(values);
        }
      });
  }

  getFieldsValue = ()=>{
    this.props.form.validateFields();
    const errors = this.props.form.getFieldsError();
    console.log(errors);
    if(!hasErrors(errors)){
      let formValues =  this.props.form.getFieldsValue()
      if(this.props.data && this.props.data.Id){
        // if(formValues.RegisterDate) formValues.RegisterDate = formValues.RegisterDate.format('YYYY-MM-DD')
        return {...this.props.data,...formValues}
      }else{
        return formValues
      }
      return formValues
    }
    return null
  }

  render () {
      const formItemLayout = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 14 },
        },
      }
      const props = this.props;
      const { getFieldDecorator } = props.form;
      return (
      <Form onSubmit={this.handleSubmit} className="tinyForm">
          <FormItem
            {...formItemLayout}
            label="任务名称"
            hasFeedback
          >
            {getFieldDecorator('TaskName', {
              rules: [{
                required: true, message: '请填写任务名称!',
              }],
              initialValue: props.data.TaskName
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="分类名称"
            hasFeedback
          >
            {getFieldDecorator('BusinessType', {
              rules: [{
                required: true, message: '请选择分类名称!',
              }],
              initialValue: (props.data.BusinessType||'') + ''
            })(
              <Select
                placeholder="请选择"
              >
                <Option value="1">税务任务</Option>
                <Option value="2">工商任务</Option>
                <Option value="3">其他任务</Option>
                <Option value="4">特殊任务</Option>
              </Select>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="服务费用"
            hasFeedback
          >
            {getFieldDecorator('Price', {
              rules: [{
                required: true, message: '请服务费用!',
              }],
              initialValue: props.data.Price
            })(
              <Input type="text"/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="是否启用"
          >
            {getFieldDecorator('Status', {
              initialValue: (props.data.Status || '1') +''
            })(
              <Radio.Group>
                <Radio value="1">启用</Radio>
                <Radio value="2">停用</Radio>
              </Radio.Group>
            )}
          </FormItem>
        </Form>
      )
  }
}

Main.propTypes = {
  data: PropTypes.object.isRequired
}

export default Form.create()(Main);
