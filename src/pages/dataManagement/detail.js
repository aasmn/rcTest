import React from 'react'
import styles from '@/stylus/modifydata'
import { Card, Button, Tabs } from 'antd'
import OutWork from '@/components/common/Outwork'
import AgentData from '@/containers/dataManagement/Agentdata'
import Company from '@/containers/dataManagement/Company'
import AgentService from '@/containers/dataManagement/AgentService'
import Operate from '@/containers/dataManagement/Operate'
import OrderInfo from '@/containers/dataManagement/OrderInfo'

const TabPane = Tabs.TabPane
class ModifyData extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      companyItem: {}
    }
    this.back = this.back.bind(this)
    this.callback = this.callback.bind(this)
    this.setCompanyName = this.setCompanyName.bind(this)
  }
  componentWillMount () {
    console.log(this.props, 'key')
    this.setState({
      companyItem: this.props.match.params
    })
  }
  back () {
    this.props.history.go(-1)
  }
  callback (key) {
    console.log(key)
  }
  setCompanyName (name) {
    this.setState({
      companyItem: {
        ...this.state.companyItem,
        CompanyName: name
      }
    })
  }
  render () {
    return (
      <div>
        <div style={{position: 'relative'}}>
          <h4 className={styles.title}>{this.state.companyItem.CompanyName}</h4>
          <Button className={styles.btn} type="primary" onClick={this.back}>
            返回
          </Button>
        </div>
        <div style={{ margin: '40px 24px 0 30px' }}>
          <AgentData companyId={this.state.companyItem.Id}/>
        </div>
        <div style={{ margin: '0px 24px 0' }}>
          <Company companyId={this.state.companyItem.Id} setCompanyName={this.setCompanyName} />
        </div>
        <div className={styles.con} style={{ margin: '24px 24px 0' }}>
          <Tabs defaultActiveKey="1" onChange={this.callback}>
            <TabPane className={styles['basic-info']} tab="订单信息" key="1">
              <OrderInfo
                Id={this.state.companyItem.Id}
              />
            </TabPane>
            <TabPane className={styles['basic-info']} tab="外勤任务" key="2">
              <OutWork
                Id={this.state.companyItem.Id}
              />
            </TabPane>
            <TabPane className={styles['basic-info']} tab="记账服务" key="3">
              <AgentService
                Id={this.state.companyItem.Id}
              />
            </TabPane>
            <TabPane className={styles['basic-info']} tab="操作记录" key="4">
              <Operate
                Id={this.state.companyItem.Id}
              />
            </TabPane>
          </Tabs>
        </div>
      </div>
    )
  }
}
export default ModifyData
