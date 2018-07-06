import React from 'react'
import { Select } from 'antd'
import { getDepartments } from '@/utils/api'

const Option = Select.Option

function repeat (str, n) {
  return new Array(n + 1).join(str)
}
function formatData (data, level = 0) {
  let deps = []
  data.forEach(item => {
    item.level = level
    deps.push(item)
    if (item.children && item.children.length > 0) {
      deps = deps.concat(formatData(item.children, level + 1))
    }
  })
  return deps
}

class DepartmentSelect extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      departments: [],
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
    getDepartments().then(res => {
      if (res.status) {
        this.setState({
          departments: formatData(res.data)
        })
      }
    })
  }
  render () {
    const options = this.state.departments.map(d => {
      return (
        <Option key={d.id} style={{ paddingLeft: (d.level + 1) * 12 + 'px' }}>{d.name}</Option>
      )
    })
    return (
      <Select style={{ width: 150 }} value={this.props.value} onChange={this.handleChange}>{options}</Select>
    )
  }
}
export default DepartmentSelect
