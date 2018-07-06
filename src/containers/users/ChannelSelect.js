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
    strageApi.getallchannel().then(res => {
      if (res.status) {
        let ary = []
        res.data.forEach(d => {
          ary.push(d)
          if (d.children && d.children.length) {
            d.children.forEach(n => {
              ary.push(n)
            })
          }
        })
        this.setState({
          accountingcenter: ary
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
      <Select value={this.props.value} onChange={this.handleChange} mode='multiple' disabled={this.props.isreadonly}>{options}</Select>
    )
  }
}
export default Main
