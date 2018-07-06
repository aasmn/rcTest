import React from 'react'
import styles from '@/stylus/main'
import { Menu, Icon, Dropdown, Avatar } from 'antd'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Link, Redirect } from 'react-router-dom'
import { logout } from '@/utils/api'

class GlobalHeader extends React.Component {
  constructor (props) {
    super(props)
    this.toggle = this.toggle.bind(this)
  }
  toggle () {
    const { collapsed, onCollapse } = this.props
    onCollapse(!collapsed)
  }
  onMenuClick ({ key }) {
    if (key === 'logout') {
      this.props.history.push('/logout')
    }
  }
  render () {
    const {
      currentUser,
      collapsed
    } = this.props
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick.bind(this)}>
        {/* <Menu.Item>
          <Icon type="user" />
          个人中心
        </Menu.Item> */}
        <Menu.Item key="logout">
          <Icon type="logout" />
          退出登录
        </Menu.Item>
      </Menu>
    )
    return (
      <div className={styles.header}>
        <Icon
          className={styles.trigger}
          type={collapsed ? 'menu-unfold' : 'menu-fold'}
          onClick={this.toggle}
        />
        <div className={styles.right}>
          {/* <span className={`${styles.action} ${styles.top}`}><Icon type="search" /></span>
          <span className={`${styles.action} ${styles.top}`}><Icon type="bell" /></span> */}
          <Dropdown overlay={menu}>
            <span className={styles.action}>
              <Avatar size="small" className={styles.avatar} icon="user"/>
              {this.props.userInfo}
            </span>
          </Dropdown>
        </div>
      </div>
    )
  }
}
export default connect(({common}) => {
  return {
    ...common
  }
})(withRouter(GlobalHeader))
