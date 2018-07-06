import React from 'react'
import {Form, Input, DatePicker} from 'antd'
import moment from 'moment'
import PropTypes from 'prop-types'
import CustomerType from '@/erp/container/searchComponent/CustomerType'
import CustomerSourceSelect from '@/erp/container/searchComponent/CustomerSourceSelect'
import AddedValue from '@/erp/container/searchComponent/AddedValue'
import AreaSelect from '@/erp/container/searchComponent/AreaSelect'
const FormItem = Form.Item;
const TextArea = Input.TextArea

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class Main extends React.Component {

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onSubmit(values);
      }
    });
  }
  getFieldsValue = () => {
    const errors = this.props.form.getFieldsError();
    if (!hasErrors(errors)) {
      let formValues = this.props.form.getFieldsValue()
      if (this.props.data.Id) {
        if (formValues.RegisterDate) formValues.RegisterDate = formValues.RegisterDate.format('YYYY-MM-DD')
        return {...this.props.data, ...formValues}
      } else {
        return formValues
      }
    }
    return null

  }

  render() {
    const formItemLayout = {
      labelCol: {
        xs: {span: 8},
        sm: {span: 8},
      },
      wrapperCol: {
        xs: {span: 14},
        sm: {span: 14},
      },
    }
    const {props} = this;
    const {readOnly, isNew} = props
    const {getFieldDecorator} = props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="tinyForm col2-form">
        <FormItem
          {...formItemLayout}
          label="公司名称"
          hasFeedback
        >
          {getFieldDecorator('CompanyName', {
            rules: [{
              required: true, message: '请填写公司名称!',
            }],
            initialValue: props.data.CompanyName
          })(
            <Input readOnly={props.readOnly}/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="注册时间"
        >
          {getFieldDecorator('RegisterDate', {
            rules: [{
              required: isNew ? true : false, message: '请选择注册时间!',
            }],
            initialValue: props.data.RegisterDate && props.data.RegisterDate.substr(0, 4) !== '0001' ? moment(props.data.RegisterDate) : null
          })(
            <DatePicker disabled={props.readOnly} placeholder={'请选择注册时间'}/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="联系人"
          hasFeedback
        >
          {getFieldDecorator('Connector', {
            rules: [{
              required: true, message: '请填写联系人!',
            }],
            initialValue: props.data.Connector
          })(
            <Input type="text" readOnly={props.readOnly}/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="移动电话"
          hasFeedback
        >
          {getFieldDecorator('Mobile', {
            initialValue: props.data.Mobile
          })(
            <Input type="text" readOnly={props.readOnly}/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="座机电话"
          hasFeedback
        >
          {getFieldDecorator('Telephone', {
            initialValue: props.data.Telephone
          })(
            <Input type="text" readOnly={props.readOnly}/>
          )}
        </FormItem>
        {props.data.CustomerTypeId === 5 ? <FormItem
          {...formItemLayout}
          label="历史意向度"
          hasFeedback
        >
          {getFieldDecorator('HisCusTypeId', {
            rules: [{
              required: true, message: '请选择历史意向度!',
            }],
            initialValue: props.data.HisCusTypeId || ''
          })(
            <CustomerType hideAll={true} readOnly={readOnly} width={!isNew && 168}/>
          )}
        </FormItem> :
        <FormItem
          {...formItemLayout}
          label="意向度"
          hasFeedback
        >
          {getFieldDecorator('CustomerTypeId', {
            rules: [{
              required: true, message: '请选择意向度!',
            }],
            initialValue: props.data.CustomerTypeId || ''
          })(
            <CustomerType hideAll={true} readOnly={readOnly} width={!isNew && 168}/>
          )}
        </FormItem>}
        {!isNew &&  <FormItem
          {...formItemLayout}
          label="创建时间"
        >
          {getFieldDecorator('CreateDate', {
            rules: [{
              required: isNew ? true : false, message: '请选择注册时间!',
            }],
            initialValue: props.data.CreateDate && props.data.CreateDate.substr(0, 4) !== '0001' ? moment(props.data.CreateDate) : null
          })(
            <DatePicker disabled={true} placeholder={'请选择注册时间'}/>
          )}
        </FormItem>}
        <FormItem
          {...formItemLayout}
          label="来源"
        >
          {getFieldDecorator('CustomerSourceId', {
            rules: [{
              required: true, message: '请选择来源!',
            }],
            initialValue: '' + (props.data.CustomerSourceId || '')
          })(
            <CustomerSourceSelect hideAll={true} readOnly={!!props.data.Id} width={!isNew && 168}/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="纳税人类别"
          hasFeedback
        >
          {getFieldDecorator('AddedValue', {
            initialValue: props.data.AddedValue || ''
          })(
            <AddedValue hideAll={true} readOnly={readOnly} width={!isNew && 168}/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="所属区域"
          hasFeedback
        >
          {getFieldDecorator('AreaCode', {
            initialValue: props.data.AreaCode || ''
          })(
            <AreaSelect hideAll={true} readOnly={readOnly} width={!isNew && 168}/>
          )}
        </FormItem>
        <FormItem
          labelCol={{span:4}}
          wrapperCol={{span:19}}
          label="公司地址"
          hasFeedback
          className={isNew && 'one-line'}
          style={{width: '100%'}}
        >
          {getFieldDecorator('Address', {
            initialValue: props.data.Address
          })(
            <Input  type="text" readOnly={props.readOnly}/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label='创建备注'
          className='one-line'
        >
          {getFieldDecorator('Mark', {
            initialValue: props.data.Mark
          })(
            <TextArea rows={4} readOnly={!!props.data.Id}/>
          )}
        </FormItem>
        {/*{(!props.readOnly) && props.data.Id && <FormItem*/}
        {/*{...formItemLayout}*/}
        {/*label="创建时间"*/}
        {/*hasFeedback*/}
        {/*>*/}
        {/*{props.data.CreateDate?moment(props.data.CreateDate).format('YYYY-MM-DD HH:mm:ss'):null}*/}
        {/*</FormItem>*/}
        {/*}*/}
      </Form>
    )
  }
}

Main.propTypes = {
  data: PropTypes.object.isRequired
}

export default Form.create()(Main);
