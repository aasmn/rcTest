import React, { Component } from 'react'
import { Select } from 'antd';

const Option = Select.Option;

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
      data: [{ id:1, label:"未开始" } ,{id:2, label: "挂起"} ,{id:3, label: "服务中"}]
    };
    // {UserId: 40, RealName: "十七", DepartmentId: 0}
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(e) {
    this.setState({value:e});
    this.props.onChange(e);
  }
  render() {
    const options = this.state.data.map(d => <Option key={d.id}>{d.label}</Option>);
    const all = <Option key={0}>全部</Option>
    const value = this.props.value && (''+this.props.value) || '';
    return (
      <Select style={{width: this.props.width || 150}} defaultValue={value} onChange={this.handleChange}>
      {(!this.props.hideAll) && all}
      {options}
      </Select>
    );
  }
}
export default Main;
