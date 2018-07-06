import React from 'react'
import { Spin, Form, Icon, Button, Row, Col, Tabs, message } from 'antd'
import CInput from '@/components/common/ClearableInput'
import styles from '@/stylus/login'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { getScope, requestLogin } from '@/utils/api'
import { changeLoginStat } from '@/actions/common'
import config from '@/config.json'
const FormItem = Form.Item

class Login extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      isLogin: false
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    // this.onWxLogin()
  }
  handleSubmit (e) {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log(values, 'values')
        requestLogin(values).then(loginRes => {
          loginRes = {
            'status': true,
            'errorcode': '',
            'message': '用户信息查询成功',
            'data': {
              'username': '9607d59a-f5a9-4f13-9e66-b343392c4552',
              'nickname': '高燕茹',
              'email': 'gyr@i-counting.cn',
              'name': '高燕茹',
              'sex': '2',
              'avatar': 'http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJrEts5ibx8Y1KzK3XT4up6UQT6HibAaqM29WqKbyuu0fKWBXbM02rcfHNtYwSiaoM11VWT94vUHticMA/132',
              'roles': ['COS_CUSTOMERVISIT', 'COS_ACCOUNT_ADD', 'COS_POLICES_SYSDISABLE', 'COS_POLICES_USERDISABLE', 'COS_POLICES_USERADD', 'COS_USERROLES', 'MSCONDE', 'COS_USERROLES_ADD', 'COS_ACCOUNT_DELETE', 'COS_DEPARTMENT', 'COS_DEPARTMENT_ADD', 'COS_ACCOUNT_POWER', 'COS_USER', 'COS_DATA_MANAGE', 'COS_DEPARTMENT_EDIT', 'COS_POLICES_SYSADD', 'COS_ORGANIZE_LIST', 'COS_ORGANIZE', 'COS_ORGANIZEAUDIT', 'COS_DATA_MODIFY', 'COS_CHANNEL', 'COS_CHANNEL_USER', 'COS_RESOURCES', 'COS_POLICES', 'COS_ACCOUNT'],
              'mobilePhone': null,
              'functionList': [
                { 'id': 2, 'name': '机构', 'code': 'COS_ORGANIZE', 'url': '', 'type': '1', 'order': 2, 'children': [{ 'id': 22, 'name': '机构审核', 'code': 'COS_ORGANIZEAUDIT', 'url': 'organizeaudit', 'type': '1', 'order': 3, 'children': [] }, { 'id': 21, 'name': '机构列表', 'code': 'COS_ORGANIZE_LIST', 'url': 'organizelist', 'type': '1', 'order': 2, 'children': [] }] },
                { 'id': 1, 'name': '客服管理', 'code': 'KEFUGL', 'url': '', 'type': '1', 'order': 1, 'children': [{ 'id': 1, 'name': '客服', 'code': 'KEFU', 'url': 'customer', 'type': '2', 'order': 0, 'children': [] }, { 'id': 1, 'name': '外呼', 'code': 'COS_CUSTOMERVISIT', 'url': 'customerVisit', 'type': '1', 'order': '2', 'children': [] }] },
                { 'id': '5b07df418143c600198cfc4d', 'name': '用户', 'code': 'COS_USER', 'url': '', 'type': '1', 'order': 2, 'children': [{ 'id': 22, 'name': '部门', 'code': 'COS_DEPARTMENT', 'url': 'department', 'type': '1', 'order': 3, 'children': [] }, { 'id': 21, 'name': '角色', 'code': 'COS_USERROLES', 'url': 'usersRoles', 'type': '1', 'order': 2, 'children': [] }, { 'id': 24, 'name': '资源', 'code': 'COS_RESOURCES', 'url': 'resources', 'type': '1', 'order': 2, 'children': [] }, { 'id': 23, 'name': '权限策略', 'code': 'COS_POLICES', 'url': 'usersStrategy', 'type': '1', 'order': 2, 'children': [] }, { 'id': 26, 'name': '账号', 'code': 'COS_ACCOUNT', 'url': 'usersAccount', 'type': '1', 'order': 2, 'children': [] }] },
                { 'id': '5b0ba2c4564e330019124ab0', 'name': '数据管理', 'code': 'COS_DATA_MANAGE', 'url': '', 'type': '1', 'order': 9, 'children': [{ 'id': 22, 'name': '数据修改', 'code': 'COS_DATA_MODIFY', 'url': 'datamanagement', 'type': '1', 'order': 3, 'children': [] }, { 'id': 21, 'name': '角色', 'code': 'COS_USERROLES', 'url': 'usersRoles', 'type': '1', 'order': 2, 'children': [] }] },
                { 'id': '5b3332b6a4f4c200199011f8', 'name': '渠道管理', 'code': 'COS_CHANNEL', 'url': '', 'type': '1', 'order': 2, 'children': [{ 'id': '5b333434a4f4c200199011fa', 'name': '用户管理', 'code': 'COS_CHANNEL_USER', 'url': 'channel/users', 'type': '1', 'order': 2, 'children': [] }] },
                { 'id': '5b3332b6a4f4c200199011f9', 'name': '直营管理', 'code': 'COS_SUBSIDIARY', 'url': '', 'type': '1', 'order': 2, 'children': [{ 'id': '5b333434a4f4c200199011xa', 'name': '用户管理', 'code': 'COS_SUBSIDIARY_USER', 'url': 'subsidiary/users', 'type': '1', 'order': 2, 'children': [] }] },
                { 'id': '5b3332b6a4f4c200199011fd', 'name': '财务管理', 'code': 'COS_SUBSIDIARY', 'url': '', 'type': '1', 'order': 2, 'children': [{ 'id': '5b333434a4f4c200199011xb', 'name': '订单管理', 'code': 'COS_SUBSIDIARY_USER', 'url': 'erp/finance_manage_contract', 'type': '1', 'order': 2, 'children': [] }] }
              ]
            }
          }
          if (loginRes.status) {
            sessionStorage.setItem('token', '1087f9cc-793c-4b65-a6a7-2f3b85ed7fa1')
            // loginRes.data.token
            sessionStorage.setItem('userInfo', JSON.stringify(loginRes.data))
            this.props.dispatch(changeLoginStat('in'))
            this.setState({
              loading: true,
              isLogin: true
            })
            setTimeout(() => {
              this.props.history.push('/')
            }, 10)
          } else {
            this.setState({
              loading: false,
              isLogin: false
            })
          }
        })
      }
    })
  }
  onWxLogin () {
    const { UAA_SERVER_URL, CLIENT_ID } = config
    const REDIRECT_URI = encodeURIComponent(window.location.origin + `/token`)
    getScope().then(res => {
      const SCOPE = (res.data || ['USER_INFO']).join(' ').trim()
      window.location.href = `${UAA_SERVER_URL}?response_type=code&jump=/login/wechat&source=cos&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPE}`
    })
    // window.location.href = 'https://x-id.i-counting.cn/?response_type=code&client_id=aTkzeckUyyKCvKru&scope=USER_INFO%20MAGICEYE_LEAD%20MAGICEYE_TYPER%20MAGICEYE_ADMIN%20MAGICEYE_SYSADMIN&redirect_uri=https%3A%2F%2Fx-magiceye.i-counting.cn%2Fapp%2FToken#/login/wechat'
  }
  render () {
    const { getFieldDecorator } = this.props.form

    // return <div></div>
    return (
      <div className={styles.login}>
        <div className={styles.title}>
          <span className={styles.logo}></span>
          <span className={styles.text}>噼里啪中心运营管理系统</span>
          <span className={styles.text_tag}>V1.0.0</span>
        </div>
        <div className={styles.logo_context}>
          <Row>
            <Col span={24}>
              <Spin spinning={this.state.loading}>
                <Form onSubmit={this.handleSubmit.bind(this)}>
                  <FormItem>
                    {getFieldDecorator('username', {
                      rules: [{ required: true, message: '请输入用户名' }]
                    })(
                      <CInput
                        prefix={<Icon type="user" />}
                        placeholder="请输入用户名"
                        type="text"
                        size="large"
                      />
                    )}
                  </FormItem>
                  <FormItem>
                    {getFieldDecorator('password', {
                      rules: [{ required: true, message: '请输入密码' }]
                    })(
                      <CInput
                        prefix={<Icon type="lock" />}
                        placeholder="请输入密码"
                        type="password"
                        size="large"
                      />
                    )}
                  </FormItem>
                  <FormItem>
                    <Button type="primary" htmlType="submit">登录</Button>
                    <Button type="primary" htmlType="button" onClick={this.onWxLogin}>微信登录</Button>
                  </FormItem>
                </Form>
              </Spin>
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}
export default connect()(Form.create()(withRouter(Login)))
