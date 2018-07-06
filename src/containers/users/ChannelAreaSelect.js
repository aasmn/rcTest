import React from 'react'
import { Select } from 'antd'
import { strageApi } from '@/utils/api'

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
    strageApi.getallchannelArea().then(res => {
      if (res.status) {
        this.setState({
          accountingcenter: res.data
        })
      }
    })
  }
  render () {
    const options = this.state.accountingcenter.map(d => {
      return (
        <Option key={d.Id} style={{ paddingLeft: (d.level + 1) * 12 + 'px' }}>{d.PartitionName}</Option>
      )
    })
    return (
      <Select value={this.props.value} onChange={this.handleChange} mode='multiple' disabled={this.props.isreadonly}>{options}</Select>
    )
  }
}
export default Main
