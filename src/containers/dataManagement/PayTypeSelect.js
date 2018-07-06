import React, { Component } from 'react'
import { Select } from 'antd'
import $ from 'jquery'
const Option = Select.Option
class Main extends Component {
  constructor (props) {
    super(props)
    this.state = {
      value: null,
      data: [{
        id: 1,
        label: '银行卡转账'
      }, {
        id: 2,
        label: '拉卡拉'
      }, {
        id: 3,
        label: '微信'
      }, {
        id: 4,
        label: '支付宝'
      }, {
        id: 5,
        label: '现金'
      }, {
        id: 6,
        label: '无需支付'
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
  dropdown (e) {
    var parent = $(e).parents('.ant-modal-wrap')
    if (parent.length > 0) {
      return parent[0]
    }
    return document.body
  }
  render () {
    const options = this.state.data.map(d => {
      return (
        <Select.Option key={d.id}>{d.label}</Select.Option>
      )
    })
    const value = this.props.value && ('' + this.props.value)
    return (
      <Select size={this.props.size} getPopupContainer={this.dropdown} style={{ width: this.props.width || 150 }} defaultValue={value} onChange={this.handleChange}>
        {options}
      </Select>
    )
  }
}
export default Main
