import React from 'react'
import styles from '@/stylus/strategy'
import StrategyCon1 from '@/containers/users/NewStrategyCon1'
import StrategyCon2 from '@/containers/users/NewStrategyCon2'
import StrategyCon3 from '@/containers/users/NewStrategyCon3'
import StrategyCon4 from '@/containers/users/NewStrategyCon4'
import { notification } from 'pilipa'
import { Steps, Button } from 'antd'
import _ from 'lodash'
import { strageApi } from '@/utils/api'
import { querryStringToObject } from '@/utils/filters'

const Step = Steps.Step
class UsersAddStrategy extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      id: '',
      viewData: {},
      result1: {},
      result2: [],
      result3: {},
      current: 0
    }
  }
  componentWillMount () {
    console.log(querryStringToObject(this.props.location.search), 'sss')
    if (querryStringToObject(this.props.location.search) && querryStringToObject(this.props.location.search).strategyId) {
      const strategyId = querryStringToObject(this.props.location.search).strategyId
      this.setState({
        id: querryStringToObject(this.props.location.search).strategyId
      })
      this.getDetail(strategyId)
    }
  }
  getDetail (id) {
    strageApi.get({id}).then(res => {
      if (res.status && Array.isArray(res.data)) {
        this.setState({
          viewData: res.data[0]
        }, () => {
          this.setState({
            result1: {
              name: this.state.viewData.name,
              desc: this.state.viewData.desc
            },
            result2: this.state.viewData.resources,
            result3: {
              mainpromiss: this.state.viewData.mainpromiss,
              attachpromiss: this.state.viewData.attachpromiss
            }
          })
        })
      }
    })
  }
  next () {
    const current = this.state.current + 1
    const view = this['ref' + current]
    const result = view.getValue()
    if (result) {
      let state = { current }
      state['result' + current] = result
      this.setState(state)
    }
  }
  prev () {
    const current = this.state.current - 1
    this.setState({ current })
  }
  down () {
    let msgConf = null
    let state = this.state
    console.log(this, 'ref2')
    // const result2 = this.ref2.getValue()
    const result2 = state.result2
    const result3 = this.ref3.getValue()
    console.log(result3, 'result3')
    const query = querryStringToObject(this.props.location.search)
    const data = {
      name: state.result1.name,
      desc: state.result1.desc,
      resources: result2,
      mainpromiss: result3.mainpromiss,
      attachpromiss: result3.attachpromiss,
      readonly: JSON.parse(query.readonly)
    }
    strageApi.post(data).then(res => {
      if (res.status) {
        msgConf = {
          title: '新建策略成功',
          message: ''
        }
        notification.success(msgConf)
        this.props.history.push('/usersStrategy')
      }
    })
  }
  close () {
    this.props.history.push('/usersStrategy')
  }
  render () {
    const steps = [{
      title: '创建策略',
      content: (<h1>{_.uniqueId('c_')}</h1>)
    }, {
      title: '设置功能及权限',
      content: '<h1>bbbb</h1>'
    }, {
      title: '设置范围权限',
      content: '<h1>bbbb</h1>'
    }]
    // , {
    //   title: '设置范围权限',
    //   content: '<h1>cccc</h1>'
    // }, {
    //   title: '设置字段权限',
    //   content: '<h1>ddd</h1>'
    // }]
    const { current } = this.state
    return (
      <div style={{ margin: '24px 24px 0' }}>
        <div className={styles.title}>流程进度</div>
        <Steps className={styles.steps} current={this.state.current}>
          {steps.map(item => <Step key={item.title} title={item.title} />)}
        </Steps>
        <div className={styles.content}>
          {
            (this.state.current === 0) &&
            <StrategyCon1 data={this.state.result1} isreadonly={this.state.id} wrappedComponentRef={v => { this.ref1 = v }} />
          }
          {
            (this.state.current === 1) &&
            <StrategyCon2 data={this.state.result2} isreadonly={this.state.id} ref={v => { this.ref2 = v }} />
          }
          {
            (this.state.current === 2) &&
            <StrategyCon3 data={this.state.result3} isreadonly={this.state.id} wrappedComponentRef={v => { this.ref3 = v }} />
          }
          {
            (this.state.current === 3) &&
            <StrategyCon4 ref="ref4" />
          }
          <div className="steps-action" style={{ textAlign: 'center' }}>
            {
              (this.state.current > 0) &&
              <Button style={{ marginRight: 8 }} onClick={() => this.prev()}>上一步</Button>
            }
            {
              (this.state.current < steps.length - 1) &&
              <Button type="primary" onClick={() => this.next()}>下一步</Button>
            }
            {
              (this.state.current === steps.length - 1 && !this.state.id) &&
              <Button type="primary" onClick={() => this.down()}>确定</Button>
            }
            {
              (this.state.current === steps.length - 1 && this.state.id) &&
              <Button type="primary" onClick={() => this.close()}>关闭</Button>
            }
          </div>
        </div>
      </div>
    )
  }
}
export default UsersAddStrategy
