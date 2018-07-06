import React from 'react'
import { Select } from 'antd'
import allArea from 'chinese-region-util'

const Option = Select.Option

class Main extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      pData: [],
      cData: [],
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
    // console.log(allArea.findAll(), 'allArea')
    let data = allArea.findAll()
    let ary = []
    data.forEach(pro => {
      if (pro.children && pro.children.length) {
        pro.children.forEach(d => {
          ary.push(d)
        })
      }
    })
    this.setState({
      pData: allArea.findAll(),
      cData: ary
    })
  }
  render () {
    let SelectData = []
    if (this.props.isProvice) {
      SelectData = this.state.pData
    } else {
      SelectData = this.state.cData
    }
    const options = SelectData.map(d => {
      return (
        <Option key={d.code} style={{ paddingLeft: (d.level + 1) * 12 + 'px' }}>{d.name}</Option>
      )
    })
    return (
      <Select value={this.props.value} onChange={this.handleChange} mode='multiple' disabled={this.props.isreadonly}>{options}</Select>
    )
  }
}
export default Main
