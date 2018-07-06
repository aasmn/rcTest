import React from 'react'
import { Tabs, Button } from 'antd'
import styles from '@/stylus/strategy'
import StrategyList from '@/containers/users/strategyList'

const TabPane = Tabs.TabPane
class UsersStrategy extends React.Component {
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
        <TabPane tab="系统策略" key="1"><StrategyList readonly={readonly} /></TabPane>
        <TabPane tab="自定义策略" key="2"><StrategyList readonly={readonly} /></TabPane>
      </Tabs>
    )
  }
}
export default UsersStrategy
