import React from 'react'
import { Form, Input, Button } from 'antd'

const FormItem = Form.Item;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class UserInfo extends React.Component {
    state = {
      confirmDirty: false
    };
    handleSubmit= (e)=> {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (!err) {
            this.props.onSubmit(values);
          }
        });
    }
    handleConfirmBlur = (e) => {
      const value = e.target.value;
      this.setState({ confirmDirty: this.state.confirmDirty || !!value });
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

        const isRepeat = (rule, value, callback) => {
            const form = this.props.form;
            if (value && value !== form.getFieldValue('New')) {
              callback('两次密码不一致！');
            } else {
              callback();
            }
        }
        const checkConfirm = (rule, value, callback) => {
          const form = this.props.form;
          if (value && this.state.confirmDirty) {
            form.validateFields(['New2'], { force: true });
          }
          callback();
        }
        return (
        <Form onSubmit={this.handleSubmit}>
            <FormItem
              {...formItemLayout}
              label="原密码"
              hasFeedback
            >
              {getFieldDecorator('Old', {
                rules: [{
                  required: true, message: '请填写原密码!',
                }]
              })(
                <Input type="password" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="新密码"
              hasFeedback
            >
              {getFieldDecorator('New', {
                rules: [{
                  required: true, message: '请填写新密码!',
                }, {
                  validator: checkConfirm
                }],
                validateTrigger: 'onBlur'
              })(
                <Input type="password" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="确认密码"
              hasFeedback
            >
              {getFieldDecorator('New2', {
                rules: [{
                  required: true, message: '请确认密码!',
                }, {
                  validator: isRepeat
                }],
                validateTrigger: 'onBlur'
              })(
                <Input type="password" onBlur={this.handleConfirmBlur}/>
              )}
            </FormItem>
            <FormItem {...tailFormItemLayout}>
                <Button
                    type="primary"
                    htmlType="submit"
                    disabled={hasErrors(getFieldsError())}
                >
                    保存
                </Button>
            </FormItem>
          </Form>
        )
    }
}

export default Form.create()(UserInfo);
