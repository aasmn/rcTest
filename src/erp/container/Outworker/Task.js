import React from 'react'
import { Form, Input } from 'antd'
import AreaSelect from '@/erp/container/searchComponent/AreaSelect'
import OutworkerTask from '@/erp/container/Outworker/OutworkerTask'
import CustomerSelect from '@/erp/container/CustomerSelect'
const FormItem = Form.Item;
const TextArea = Input.TextArea


function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class Main extends React.Component {

    constructor(props) {
      super(props);
    }
    getFieldsValue = ()=>{
      this.props.form.validateFields();
      const errors = this.props.form.getFieldsError();
      console.log(errors);
      if(!hasErrors(errors)){
        let formValues =  this.props.form.getFieldsValue()
        formValues = {
          ...formValues,
          ...formValues.Task
        }
        delete formValues.Task;
        if(this.props.data.Id){
          if(formValues.RegisterDate) formValues.RegisterDate = formValues.RegisterDate.format('YYYY-MM-DD')
          return {...this.props.data,...formValues}
        }else{
          return formValues
        }
      }
      return null

    }
    checkTask = (rule, value, callback) => {
      if (value && value.ChildTasks && value.ChildTasks.length > 0) {
        callback();
        return;
      }
      callback('请选择任务');
    }
    checkField = (rule, value, callback) => {
      if (!value) {
        callback(rule.message);
        return;
      }
      callback();
    }
    render () {
      const formItemLayout = {
        labelCol: {
          span: 2,
        },
        wrapperCol: {
          span: 10,
        },
      }
      const props = this.props;
      const { getFieldDecorator } = props.form;
      return (
        <Form className="tinyForm">
           <FormItem>
              {getFieldDecorator('Task', {
                rules: [{ validator: this.checkTask }],
                initialValue: props.data
              })(
                <OutworkerTask onlySelected={this.props.onlySelected} isOnlyFree={this.props.isOnlyFree} data={this.props.data}/>
              )}
            </FormItem>
          {(!this.props.hideCompany) &&<FormItem
              {...formItemLayout}
              label="选择公司"
              hasFeedback
            >
              {getFieldDecorator('Customer', {
                rules: [{ validator: this.checkField, message:"请选择公司!" }],
                initialValue: props.data.Customer
              })(
                <CustomerSelect />
              )}
            </FormItem>}
            <FormItem
              {...formItemLayout}
              label="选择区域"
              hasFeedback
            >
              {getFieldDecorator('AreaCode', {
                rules: [{ validator: this.checkField, message: '请选择区域!' }],
                initialValue: props.data && props.data.AreaCode
              })(
                <AreaSelect />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="备注"
            >
              {getFieldDecorator('Remark', {
                initialValue: props.data.Remark
              })(
                <TextArea />
              )}
            </FormItem>
        </Form>
        )
    }
}

export default Form.create()(Main);;
