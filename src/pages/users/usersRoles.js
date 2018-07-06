import React from 'react'
import { Tabs, Button } from 'antd'
import styles from '@/stylus/strategy'
import RolesList from '@/containers/users/RolesList'

const TabPane = Tabs.TabPane
class Main extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      readonly: true
    }
    this.tabChange = this.tabChange.bind(this)
  }
  // 切换策略
  tabChange (key) {
    this.setState({
      readonly: !this.state.readonly
    })
  }
  render () {
    const { readonly } = this.state
    return (
      <Tabs defaultActiveKey="1" onChange={this.tabChange}>
        <TabPane tab="系统角色" key="1"><RolesList readonly={readonly} /></TabPane>
        <TabPane tab="自定义角色" key="2"><RolesList readonly={readonly} /></TabPane>
      </Tabs>
    )
  }
}
export default Main
