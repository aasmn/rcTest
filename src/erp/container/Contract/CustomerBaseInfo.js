import React from 'react';
import { Form, Input, Button } from 'antd';
import Title from '@/erp/component/Title';
import CustomerSelect from '@/erp/container/CustomerSelect';
// import { getListData } from '@/erp/api';
import _ from 'lodash';

const FormItem = Form.Item;
function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class Main extends React.Component {
    getFieldsValue = ()=>{
      if(this.validateField()) return null;
      const fields = this.props.form.getFieldsValue();
      const data = this.props.data;
      return {
        CustomerId: fields.Company.Id,
        AddedValue: fields.Company.AddedValue,
        CompanyName: fields.Company.CompanyName,
        Connector: fields.Connector,
        Mobile: fields.Mobile,
        OrderSalesId: fields.Company.SalesId || data.SalesId,
        OrderSalesName: fields.Company.SalesName || data.SalesName
      }
    }
    componentWillReceiveProps(nextProps){
      const data = nextProps.data;
      if(data && (!data.Company) && data.CustomerId){
        data.Company = {
          CompanyName: data.CompanyName,
          Id: data.CustomerId
        }
        this.props.form.setFieldsValue({Company: data.Company});
      }
    }
    validateField = ()=>{
      this.props.form.validateFields();
      const errors = this.props.form.getFieldsError();
      return hasErrors(errors);
    }
    CustomerSelected = (v)=>{
      const setFieldsValue = this.props.form.setFieldsValue;
      setFieldsValue({CompanyId: v.CustomerId});
      setFieldsValue({CompanyName: v.CompanyName});
      setFieldsValue({Connector: v.Connector});
      setFieldsValue({Mobile: v.Mobile});
      setFieldsValue({OrderSalesName: v.SalesName});
    }
    render () {
      let data = this.props.data || {};
      if(data && (!data.Company) && data.CustomerId){
        data.Company = {
          CompanyName: data.CompanyName,
          Id: data.CustomerId
        }
      }
      const formItemLayout = {
        
      };
      const { getFieldDecorator } = this.props.form;
      const AddNew = <Button size="small" type="primary" disabled={this.props.readOnly} onClick={e => { this.customer.showModal() }}>添加客户</Button>;
      const addon = this.props.CustomerSelectMode == 2 ? AddNew : null; 
      // console.log(data)
      return (
        <Form className="tinyForm" layout="inline">
            <Title title= '客户基本信息' addon={addon}/>
             <FormItem
              {...formItemLayout}
              label="甲方"
             >
              {getFieldDecorator('Company', {
                rules: [{
                  required: true, message: '请选择公司!',
                }],
                initialValue: data.Company
              })(
              <CustomerSelect 
                ref={e=>{this.customer = e}}
                canEdit={true} 
                readOnly={this.props.readOnly || this.props.companyReadOnly} 
                mode={this.props.CustomerSelectMode}  
                onChange={this.CustomerSelected}
              />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="联系人"
            >
              {getFieldDecorator('Connector', {
                rules: [{
                  required: true, message: '请填写联系人!',
                }],
                initialValue: data.Connector
              })(
                <Input readOnly={this.props.readOnly} style={{width: "80px"}}/>
              )}
            </FormItem>
             <FormItem
              {...formItemLayout}
              label="联系电话"
            >
              {getFieldDecorator('Mobile', {
                rules: [{
                  required: true, message: '请填写联系电话!',
                }],
                initialValue: data.Mobile
              })(
                <Input readOnly={this.props.readOnly}/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="签单销售"
            >
              {getFieldDecorator('OrderSalesName', {
                rules: [{
                  required: true, message: '请保证客户有签单销售!'
                }],
                initialValue: data.OrderSalesName
              })(
              <Input style={{ width: "80px" }} disabled/>
              )}
            </FormItem>
            {(this.props.readOnly) && <FormItem
              {...formItemLayout}
              label="当前负责销售"
            >
              {getFieldDecorator('SalesName', {
                rules: [{
                  required: true,
                }],
                initialValue: data.SalesName
              })(
              <Input style={{ width: "80px" }} disabled/>
              )}
            </FormItem>}
        </Form>
        )
    }
}

export default Form.create()(Main);;
