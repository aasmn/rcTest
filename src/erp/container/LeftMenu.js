import React from 'react';
import { Menu, Icon } from 'antd';
import {Link} from 'react-router-dom'
const SubMenu = Menu.SubMenu;

class LeftMenu extends React.Component {
  state = {
    collapsed: false
  }
  shouldComponentUpdate(nextProps, nextState) {
    
    if(this.props.currentMenu.funId[0] !== nextProps.currentMenu.funId[0]){
      this.menu.setState({
          openKeys: nextProps.currentMenu.parentId
      })
    }
    this.selectedKeys = nextProps.currentMenu.funId
    return true;
  }
  render() {
    const user = JSON.parse(window.sessionStorage.getItem('user'))
    const menu = JSON.parse(user.FunctionList)
    // console.log(this)
    return (
      <Menu style={{clear:'both'}}
        defaultSelectedKeys={this.props.currentMenu.funId}
        defaultOpenKeys={this.props.currentMenu.parentId}
        selectedKeys={this.selectedKeys||[]}
        mode="inline"
        theme="dark"
        ref={(menu) => { this.menu = menu; }}
        inlineCollapsed={this.state.collapsed}>
      {menu.map((route, index) => (
        <SubMenu key={route.FunctionId} title={<span><Icon type="mail" /><span>{route.FunctionName}</span></span>}>
        {route.Children.map((page,index)=>(
          <Menu.Item key={page.FunctionId}>
            <Link to={{functions:page.Children, pathname: '/' + page.FunctionKey.replace('.','/')}}>
              <Icon type="pie-chart" />
              <span>{page.FunctionName}</span>
            </Link>
          </Menu.Item>
        ))}
        </SubMenu>
      ))}
      </Menu>
    );
  }
}

export default LeftMenu;
