import React, { Component } from 'react'
import { Select, Spin } from 'antd'
import { connect } from 'react-redux'
import { getCustomerSource } from '@/erp/store/actions'

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
    this.props.getCustomerSource()
  }
  render() {
    if(!this.props.customerSource) return <Spin/>;
    const options = this.props.customerSource.map(d => <Option key={d.Id}>{d.Marking}</Option>);
    const all = <Option key={0}>全部</Option>
    return (
      <Select disabled={this.props.readOnly} style={{width: this.props.width || 150}} defaultValue={this.props.value} onChange={this.handleChange}>
      {(!this.props.hideAll) && all}
      {options}
      </Select>
    );
  }
}
const mapStateToProps = ({common}) => {
  return {
    customerSource: common.customerSource,
  }
}
const mapDispatchToProps = dispatch => {
  return {
    getCustomerSource: payload => {
      dispatch(getCustomerSource())
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Main);
