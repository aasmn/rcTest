import React, { Component } from 'react'
import { Select, Spin } from 'antd'
import { connect } from 'react-redux'
import { getDeparment } from '@/erp/store/actions'

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
    this.props.onChange(e);
  }
  componentWillMount() {
    this.props.getDeparment()
  }
  render() {
    if(!this.props.deparments) return <Spin/>;
    const options = this.props.deparments.map(d => <Option key={d.DepartmentId}>{d.DepartmentName}</Option>);
    const all = <Option key={0}>全部</Option>
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
    deparments: common.deparments,
  }
}
const mapDispatchToProps = dispatch => {
  return {
    getDeparment: payload => {
      dispatch(getDeparment())
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Main);
