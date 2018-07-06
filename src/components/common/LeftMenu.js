import React from 'react'
import { Menu, Icon } from 'antd'
import { Link } from 'react-router-dom'
const SubMenu = Menu.SubMenu
export default class LeftMenu extends React.Component {
  renderMenu (usrFuns) {
    if (!usrFuns) return null
    const funs = usrFuns.sort((a, b) => {
      return (a.order || 0) - (b.order || 0)
    })
    return funs.map(item => {
      if (item.type === '1' || item.type === 1) {
        if (!item.url) {
          return (
            <SubMenu key={item.id} title={<span><Icon type="customer-service" /><span>{item.name}</span></span>}>
              {this.renderMenu(item.children)}
            </SubMenu>)
        } else {
          return (
            <Menu.Item key={item.id}>
              <Link to={'/' + item.url}>
                <span>{item.name}</span>
              </Link>
            </Menu.Item>
          )
        }
      }
    })
  }
  render () {
    let userInfo = {}
    try {
      userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    } catch (e) {
      console.log(e)
    }
    const funs = JSON.parse(sessionStorage.getItem('userInfo')).functionList

    return (
      <Menu theme="dark" mode="inline">
        {this.renderMenu(funs)}
      </Menu>
    )
  }
}
