import React, { Component } from 'react'
import { Select, Spin } from 'antd'
import { connect } from 'react-redux'
import { getMainTask } from '@/erp/store/actions'
import _ from 'lodash'

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
    this.props.getMainTask()
  }
  render() {
    if(!this.props.main_tasks) return <Spin/>;
    const tasks = _.chain(this.props.main_tasks).filter({Status:1}).map(item=>_.pick(item,['CommonTaskId','CommonTaskName'])).uniqBy('CommonTaskId').value()
    const options = tasks.map(d => <Option key={d.CommonTaskId}>{d.CommonTaskName}</Option>);
    const all = <Option key={' '}>全部</Option>
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
    main_tasks: common.main_tasks,
  }
}
const mapDispatchToProps = dispatch => {
  return {
    getMainTask: payload => {
      dispatch(getMainTask())
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Main);
