import React from 'react'
import { Form, Input, Radio, DatePicker, Button } from 'antd'
import { getListData } from '@/erp/api'
import moment from 'moment'
import PropTypes from 'prop-types'
import DepartmentSelect from '@/erp/container/DepartmentSelect'
import RolesSelect from '@/erp/container/RolesSelect'
const FormItem = Form.Item;
const RadioGroup = Radio.Group;


function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class UserInfo extends React.Component {

    handleSubmit= (e)=> {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (!err) {
            this.props.onSubmit(values);
          }
        });
    }
    render () {
        const validatePhoneRepeat = (rule, value, callback) => {
             if(!/^1[3|4|5|7|8][0-9]\d{8}$/.test(value)){
                callback('手机号码格式不正确')
                return;
            }
            getListData('users/'+ (this.props.user.Id || '0') + '/checkphone/' + value).then(function(res){
                if(res.data){
                    callback()
                }else{
                    callback('该手机号已被使用，请更换手机号码')
                }
            }, function(){
                callback()
            })
        }
        const formItemLayout = {
          labelCol: {
            xs: { span: 24 },
            sm: { span: 6 },
          },
          wrapperCol: {
            xs: { span: 24 },
            sm: { span: 14 },
          },
        };
        const tailFormItemLayout = {
          wrapperCol: {
            xs: {
              span: 24,
              offset: 0,
            },
            sm: {
              span: 14,
              offset: 6,
            },
          },
        };
        const props = this.props;
        const { getFieldDecorator, getFieldsError } = props.form;
        return (
        <Form onSubmit={this.handleSubmit} className="tinyForm form-2col" layout="inline">
            <FormItem
              {...formItemLayout}
              label="姓名"
              hasFeedback
            >
              {getFieldDecorator('RealName', {
                rules: [{
                  required: true, message: '请填写姓名!',
                }],
                initialValue: props.user.RealName
              })(
                <Input />
              )}
            </FormItem>
            {props.isNew && <FormItem
              {...formItemLayout}
              label="密码"
              hasFeedback
            >
              {getFieldDecorator('PassWord', {
                rules: [{
                  required: true, message: '请填写密码!',
                }],
              })(
                <Input type="text" />
              )}
            </FormItem> }
            <FormItem
              {...formItemLayout}
              label="性别"
            >
              {getFieldDecorator('Sex', {
                initialValue: props.user.Sex||1
              })(
                <RadioGroup>
                    <Radio value={1}>男</Radio>
                    <Radio value={2}>女</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label= '出生年月'
            >
              {getFieldDecorator('Birthday', {
                initialValue: props.user.Birthday?moment(props.user.Birthday):null
              })(
                <DatePicker/>
              )}
            </FormItem>
            {(!props.isNew) && <FormItem
              {...formItemLayout}
              label="用户名"
              hasFeedback
            >
              {getFieldDecorator('UserName', {
                initialValue: props.user.UserName
              })(
                <Input readOnly/>
              )}
            </FormItem>}
            <FormItem
              {...formItemLayout}
              label="手机号"
              hasFeedback
            >
              {getFieldDecorator('Phone', {
                initialValue: props.user.Phone,
                rules: [
                    { type: 'string', required: true, message: '请输入手机号码！' },
                    {validator: validatePhoneRepeat}
                ],
              })(
                <Input/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="邮箱"
            >
              {getFieldDecorator('Email', {
                rules: [{
                  type: 'email', message: '邮箱格式不正确！',
                }, {
                  required: true, message: '请输入邮箱',
                }],
                initialValue: props.user.Email,
              })(
                <Input style={{ width: '100%' }} />
              )}
            </FormItem>
            {props.isModal && <FormItem {...formItemLayout}
              label="部门">
                {getFieldDecorator('DepartmentCenterId', {
                rules: [{
                  required: true, message: '请选择部门',
                }],
                initialValue: props.user.DepartmentCenterId,
              })(
                <DepartmentSelect/>
              )}
            </FormItem>}
            {props.isModal && <FormItem {...formItemLayout}
              label="角色">
                {getFieldDecorator('RoleIds', {
                rules: [{
                  required: true, message: '请选择角色',
                }],
                initialValue: props.user.RoleIds,
              })(
                <RolesSelect/>
              )}
            </FormItem>}
            {props.isModal || <FormItem {...tailFormItemLayout}>
                <Button
                    type="primary"
                    htmlType="submit"
                    disabled={hasErrors(getFieldsError())}
                >
                    保存
                </Button>
            </FormItem>}
          </Form>
        )
    }
}
UserInfo.propTypes = {
  user: PropTypes.object.isRequired,
  isNew: PropTypes.bool,
  isModal: PropTypes.bool
}

export default Form.create()(UserInfo);
