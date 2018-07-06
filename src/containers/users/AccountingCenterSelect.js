import React from 'react'
import { Select } from 'antd'
import { accountingCenterApi } from '@/utils/api'

const Option = Select.Option

class Main extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      accountingcenter: [],
      value: null
    }
    this.handleChange = this.handleChange.bind(this)
  }
  handleChange (e) {
    console.log(e, 'e')
    this.setState({
      value: e
    })
    this.props.onChange(e)
  }
  componentWillMount () {
    let vals = {
      ispage: 0
    }
    accountingCenterApi.get(vals).then(res => {
      if (res.status) {
        this.setState({
          accountingcenter: res.data.list
        })
      }
    })
  }
  render () {
    const options = this.state.accountingcenter.map(d => {
      return (
        <Option key={d.id} style={{ paddingLeft: (d.level + 1) * 12 + 'px' }}>{d.name}</Option>
      )
    })
    return (
      <Select style={{ width: 150 }} value={this.props.value} onChange={this.handleChange}>{options}</Select>
    )
  }
}
export default Main
