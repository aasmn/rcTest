import React, { Component } from 'react'
import { Form, Input, Select } from 'antd'
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
      // if(this.props.data.Id){
      //   if(formValues.RegisterDate) formValues.RegisterDate = formValues.RegisterDate.format('YYYY-MM-DD')
      //   return {...this.props.data,...formValues}
      // }else{
      //   return formValues
      // }
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
      console.log(props, 'props')
      const { getFieldDecorator } = props.form;
      return (
      <Form onSubmit={this.handleSubmit} className="tinyForm">
          <FormItem
            {...formItemLayout}
            label="父项目ID"
            hasFeedback
          >
            {getFieldDecorator('ParentId', {
              rules: [{
                required: true, message: '请填写父项目ID!',
              }],
              initialValue: props.data.ParentId
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="项目名称"
            hasFeedback
          >
            {getFieldDecorator('FunctionName', {
              rules: [{
                required: true, message: '请填写项目名称!',
              }],
              initialValue: props.data.FunctionName
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="是否中心账户"
          >
            {getFieldDecorator('FunctionCenter', {
              initialValue: (props.data.FunctionCenter || 0) + ''
            })(
              <Select>
                <Option value="1">是</Option>
                <Option value="0">否</Option>
              </Select>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="项目图标"
          >
            {getFieldDecorator('Icon', {
              initialValue: props.data.Icon
            })(
              <Input type="text"/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="项目代码"
          >
            {getFieldDecorator('FunctionKey', {
              initialValue: props.data.FunctionKey
            })(
              <Input type="text"/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="排序"
            hasFeedback
          >
            {getFieldDecorator('Rank', {
              rules: [{
                required: true, message: '请填写排序!',
              }],
              initialValue: props.data.Rank
            })(
              <Input type="text"/>
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
