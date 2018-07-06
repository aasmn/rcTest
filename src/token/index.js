import React from 'react'
import { withRouter } from 'react-router-dom'
import { Spin } from 'antd'
import './token.styl'
import fetch from '../utils/http'
import queryString from '../utils/queryString'
import { connect } from 'react-redux'
import { changeLoginStat } from '@/actions/common'

class Token extends React.Component {
  componentDidMount () {
    this.getAccessToken()
  }
  // 获取token
  getAccessToken () {
    const code = queryString('code')
    console.log(code)
    fetch(`/api/uaa/token/${code}`, {
      headers: {
        platform: 'web'
      }
    }).then((res) => {
      console.log('token=', res)
      if (res && res.status) {
        const accessToken = res.data
        if (accessToken) {
          sessionStorage.setItem('token', accessToken)
        }
        return accessToken
      }
      return false
    }).then((accessToken) => {
      if (accessToken) {
        this.getUserInfo(accessToken).then(res => {
          console.log('user=', res)
          if (res && res.status) {
            // const userInfo = JSON.parse(res.data)
            sessionStorage.setItem('userInfo', JSON.stringify(res.data))
            this.props.dispatch(changeLoginStat('in'))
            // 登录成功返回上一个页面
            setTimeout(() => {
              this.props.history.push('/')
            }, 50)
          }
        })
      }
    })
  };

  getUserInfo (token) {
    return fetch(`/api/uaa/user/${token}`)
  }

  render () {
    return (
      <div className="token">
        <Spin size="large" delay="300" />
      </div>
    )
  }
}
export default connect()(withRouter(Token))
