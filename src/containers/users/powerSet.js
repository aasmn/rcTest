import React from 'react'
import { Transfer } from 'antd'
import { strageApi } from '@/utils/api'

class PowerSet extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      targetKeys: props.value || [],
      data: []
    }
    // this.editUser = this.editUser.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.fetchData = this.fetchData.bind(this)
    this.fetchData()
  }
  fetchData () {
    let vals = {
      ispage: 0
    }
    strageApi.get(vals).then(res => {
      res.data.forEach(t => { t.key = t.id })
      this.setState({ data: res.data.filter(t => t.status === 1) })
    })
  }
  handleChange (nextTargetKeys, direction, moveKeys) {
    console.log(nextTargetKeys, 'nextTargetKeys')
    this.setState({ targetKeys: nextTargetKeys })
    console.log(nextTargetKeys)
    if (this.props.onChange) {
      this.props.onChange(nextTargetKeys)
    }
  }

  render () {
    const state = this.state
    const data = this.state.data
    return (
      <Transfer
        dataSource={data}
        titles={['策略', '已选策略']}
        targetKeys={state.targetKeys}
        onChange={this.handleChange}
        render={item => item.name}
      />
    )
  }
}
export default PowerSet
