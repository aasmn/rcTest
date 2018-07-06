import React from 'react'
import { logout } from '@/utils/api'
export default class extends React.Component {
  componentWillMount () {
    logout().then(res => {
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('userInfo')
      this.props.history.push('/login')
    })
  }
  render () {
    return null
  }
}
