import React, { Component } from 'react'
import { Select } from 'antd';

const Option = Select.Option;

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
      data: [{ id:1, label:"待分配" } ,{id:2, label: "待处理"}, {id:3, label: "进行中"},{id:4, label:"已完成"},{id:5, label:"已取消"}]
    };
    // {UserId: 40, RealName: "十七", DepartmentId: 0}
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(e) {
    this.setState({value:e});
    this.props.onChange(e.trim());
  }
  render() {
    const options = this.state.data.map(d => <Option key={d.id}>{d.label}</Option>);
    const all = <Option key=' '>全部</Option>
    return (
      <Select style={{width: this.props.width || 150}} defaultValue={this.props.value} onChange={this.handleChange}>
      {(!this.props.hideAll) && all}
      {options}
      </Select>
    );
  }
}
export default Main;
