import React from 'react';
import { Form, Input, Spin, message } from 'antd';
import AreaSelect from '@/erp/container/searchComponent/AreaSelect';
import AddedValue from '@/erp/container/searchComponent/AddedValue';
import BusinessLine from '@/erp/container/Contract/BusinessLine'
import Title from '@/erp/component/Title';
import { getListData } from '@/erp/api';
import _ from 'lodash';
import moment from 'moment'
import UploadFile from '@/erp/container/UploadFile';
import CustomerFormTY from '@/erp/container/Contract/CustomerFormTY'
const FormItem = Form.Item;
const TextArea = Input.TextArea


function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            specialCompany:true,
            SourceId:'',
            searchResult: props.data.ServiceCompanyCode? props.data: null
        }

    }
    getFieldsValue = ()=>{
      this.props.form.validateFields();
      const errors = this.props.form.getFieldsError();
      if(!hasErrors(errors)){
        let formValues =  this.props.form.getFieldsValue();
        if (this.state.searchResult && this.state.searchResult.CompanyName != formValues.CompanyName){
          message.error('查询结果被修改，无法保存！');
          return null;
        }
        formValues = _.extend(formValues,formValues.BusinessLine)
        // if(formValues.RegisterDate) formValues.RegisterDate = formValues.RegisterDate.format('YYYY-MM-DD');
        delete formValues.BusinessLine;
        formValues.SourceId = this.state.SourceId
        formValues.InfoSource = this.state.InfoSource
        if(formValues.SourceId ===3 && !formValues.BusinessScope){
          message.error('经营范围不能为空！');
          return null;
        }
        return {...this.props.data,...formValues, ServiceCompanyCode:this.ServiceCompanyCode||this.props.data.ServiceCompanyCode}
      }
      return null
    }
    setSpecialCompany=()=>{
        this.setState({
            specialCompany:false,
            SourceId:3,
            InfoSource: 3
        })
    }
    changeSource = (SourceId) => {
      
      this.setState({
          specialCompany:true,
          SourceId : SourceId,
          InfoSource: SourceId
      })
    }
    handleSearch=(v)=>{
        this.setState({
            specialCompany:true,
            SourceId : 1,
            searchResult: v
        })
      const setFieldsValue = this.props.form.setFieldsValue;
      let bl = _.pick(v, ['RegisterDate','BusnissDeadline','NoDeadLine']);
      // if(bl.RegisterDate) bl.RegisterDate = moment(bl.RegisterDate);
      // if(bl.BusnissDeadline) bl.RegisterDate = moment(bl.BusnissDeadline);
      v.BusinessLine = bl;
      setFieldsValue(v);
      this.ServiceCompanyCode = v.ServiceCompanyCode;
    }
    render () {
      if(!this.props.data) return <Spin/>;
      // this.code = this.props.data.Code
      const formItemLayout = {
        labelCol: {
          span: 8,
        },
        wrapperCol: {
          span: 16,
        },
      }
      const data = this.props.data;
      const { getFieldDecorator } = this.props.form;
      return (
        <Form className="tinyForm form-3col" layout="inline">
            <Title title= '客户基本信息'/>
             <FormItem
                  labelCol={{span: 4}}
                  wrapperCol= {{span: 20}}
              label="公司名称"
             style={{width:'60%'}}>
              {getFieldDecorator('CompanyName', {
                initialValue: data.CompanyName
              })(
                <CustomerFormTY onSearch={this.handleSearch} setSpecialCompany={this.setSpecialCompany} changeSource={this.changeSource}/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="联系人"
            >
              {getFieldDecorator('Connector', {
                initialValue: data.Connector
              })(
                <Input />
              )}
            </FormItem>
             <FormItem
              {...formItemLayout}
              label="联系电话"
            >
              {getFieldDecorator('Mobile', {
                initialValue: data.Mobile,
                rules: [{
                  validator: (rule, value, callback) => {
                    if(value && value.length==11){
                      callback();
                      return
                    }
                    callback('请输入正确的手机号码！');
                    return;
                  }
                }],
              })(
                <Input />
              )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="座机"
          >
            {getFieldDecorator('Telephone', {
              initialValue: data.Telephone
            })(
              <Input />
            )}
          </FormItem>
            <FormItem
              {...formItemLayout}
              label="当前负责销售"
            >
              {getFieldDecorator('SalesName', {
                initialValue: data.SalesName
              })(
                <Input disabled/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="纳税人类别"
            >
              {getFieldDecorator('AddedValue', {
                initialValue: data.AddedValue
              })(
                <AddedValue hideAll={true} disabled/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="所属区域"
            >
              {getFieldDecorator('AreaCode', {
                initialValue: data.AreaCode
              })(
                <AreaSelect />
              )}
            </FormItem>
            <FormItem className="form-row"
              {...formItemLayout}
              label="公司地址"
            >
              {getFieldDecorator('Address', {
                initialValue: data.Address
              })(
                <Input disabled={this.state.specialCompany}/>
              )}
            </FormItem>
            <Title title= '营业执照信息'/>
            <FormItem
              {...formItemLayout}
              label="统一社会信用代码"
            >
              {getFieldDecorator('RegNO', {
                initialValue: data.RegNO
              })(
                <Input disabled={this.state.specialCompany}/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="企业注册号"
            >
            {getFieldDecorator('RegCode', {
              initialValue: data.RegCode
              })(
                <Input disabled={this.state.specialCompany}/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="营业执照"
            >
              {getFieldDecorator('BusinessLicense', {
                initialValue: data.BusinessLicense
              })(
                <UploadFile additional="?x-oss-process=image/resize,m_lfit,h_30,w_50"/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="注册资金"
            >
              {getFieldDecorator('RegisteredCapital', {
                initialValue: data.RegisteredCapital
              })(
                <Input disabled={this.state.specialCompany}/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="法人姓名"
            >
              {getFieldDecorator('LegalPerson', {
                initialValue: data.LegalPerson
              })(
                <Input disabled={this.state.specialCompany}/>
              )}
            </FormItem>
            <FormItem style={{width: '60%'}}
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              label="营业期限"
            >
              {getFieldDecorator('BusinessLine', {
                initialValue: _.pick(data, ['RegisterDate','BusnissDeadline','NoDeadLine'])
              })(
                <BusinessLine readOnly={this.state.specialCompany}/>
              )}
            </FormItem>
            <FormItem className="form-row"
              {...formItemLayout}
              label="经营范围"
            >
              {getFieldDecorator('BusinessScope', {
                initialValue: data.BusinessScope
              })(
                <TextArea disabled={this.state.specialCompany}/>
              )}
            </FormItem>


        </Form>
        )
    }
}

export default Form.create()(Main);;
