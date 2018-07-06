import React, { Component } from 'react'
import { Select, Spin } from 'antd'
import { connect } from 'react-redux'
import { getSubTask } from '@/erp/store/actions'

const Option = Select.Option;

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
    };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(e) {
    this.setState({value:e});
    this.props.onChange(e.trim());
  }
  componentWillMount() {
    this.props.getSubTask()
  }
  render() {
    if(!this.props.sub_task) return <Spin/>;
    const options = this.props.sub_task.map(d => <Option key={d.Id}>{d.TaskName}</Option>);
    const all = <Option key=' '>全部</Option>
    return (
      <Select style={{width: this.props.width || 150}} defaultValue={this.props.value} onChange={this.handleChange}>
      {(!this.props.hideAll) && all}
      {options}
      </Select>
    );
  }
}
const mapStateToProps = ({common}) => {
  return {
    sub_task: common.sub_task,
  }
}
const mapDispatchToProps = dispatch => {
  return {
    getSubTask: payload => {
      dispatch(getSubTask())
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Main);
