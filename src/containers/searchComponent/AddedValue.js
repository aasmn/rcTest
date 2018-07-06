import React, { Component } from 'react'
import { Select } from 'antd'
const Option = Select.Option
class Main extends Comment {
  constructor (props) {
    super(props)
    this.state = {
      value: null,
      data: [{
        id: 1,
        label: '小规模'
      }, {
        id: 2,
        label: '一般纳税人'
      }]
    }
    this.handleChange = this.handleChange.bind(this)
  }
  handleChange (e) {
    this.setState({
      value: e
    })
    this.props.onChange(e)
  }
  render () {
    const options = this.state.data.map(d => {
      return (
        <Option key={d.id}>{d.label}</Option>
      )
    })
    const all = <Option key={0}>全部</Option>
    const value = this.props.value && ('' + this.props.value)
    return (
      <Select size={this.props.size} style={{width: this.props.width || 150}} defaultValue={value} onChange={this.handleChange}>
        {(!this.props.hideAll) && all}
        {options}
      </Select>
    )
  }
}
export default Main
