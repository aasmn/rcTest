
import React, { Component } from 'react'
// import { hashHistory } from 'react-router'
import { Spin, Form, Icon,  Button, Row, Col, Tabs, message } from 'antd'
// import { requestLogin } from './api'
import CInput from '@/erp/component/clearableInput'
import { Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
import  '@/erp/style/login.less';

const FormItem = Form.Item

class Login extends Component {
    // 初始化页面常量 绑定事件方法
  constructor(props, context) {
    super(props)
    this.state= {
      activeKey: "1"
    }
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleSubmit(e) {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if(this.state.activeKey === "2"){
          values.usertype = "channel";
        }
        if (!values.UserName){
          message.error('请输入用户名');
          return;
        } 
        this.props.onLogin(values);
      }
    })
  }
  render() {
    // const { loginResponse } = this.props.loginResponse

     if (this.props.isLogin) {       
      return (
        <Redirect to={'/main'}/>
      )
    }

    const  getFieldDecorator  = this.props.form.getFieldDecorator
    return (
      <div className="login">
        <div className="title"><span className="logo"></span> <span className="text">噼里啪智能<span style={{ padding:'0 12px 0 6px'}}>	&bull;</span>ERP</span> <span className="text-tag">V2.7.5</span></div>
        <div className="logo-context">
          <Row>
            <Tabs activeKey={this.state.activeKey} onChange = {v=>{this.setState({activeKey:v})}}>
              <Tabs.TabPane tab="直营用户" key="1"></Tabs.TabPane>
              <Tabs.TabPane tab="渠道用户" key="2"></Tabs.TabPane>
            </Tabs>
          </Row>
          <Row >
            <Col span={24}>
              <Spin spinning={!!this.props.loading}>
                <Form onSubmit={this.handleSubmit}>
                  <FormItem>
                    {getFieldDecorator('UserName')(
                      <CInput
                        prefix={<Icon type="user"/>}
                        placeholder="请输入用户名"
                        type="text"
                        size="large"
                      />
                      )}
                  </FormItem>
                  <FormItem>
                    {getFieldDecorator('PassWord', {
                      rules: [{
                        required: true, message: '请输入密码!',
                      }]
                    })(
                      <CInput
                        prefix={<Icon type="lock" />}
                        placeholder="请输入密码"
                        size="large"
                        type="password"
                      />
                      )}

                  </FormItem>
                  <FormItem>
                    <Button type="primary" htmlType="submit">登录</Button>
                  </FormItem>
                </Form>
              </Spin>
            </Col>
          </Row>
        </div>
        <div className="down-app">
          <div className="down-app-img"></div>
          <div className="down-app-text">扫一扫下载移动端</div>
        </div>
        <div className="footer">@/erp2018 北京爱康鼎科技有限公司 版权所有</div>
      </div>
    );
  }
}

Login.propTypes = {
  loading: PropTypes.bool.isRequired,
  isLogin: PropTypes.bool.isRequired,
  onLogin: PropTypes.func.isRequired
}

export default Form.create()(Login);
