import React, { Component } from 'react'
import { Select, Spin } from 'antd'
import { connect } from 'react-redux'
import { getOutworkers } from '@/erp/store/actions'
import $ from 'jquery';
import _ from 'lodash'

const Option = Select.Option;

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
    };
    this.handleChange = this.handleChange.bind(this);
    this.dropdown = this.dropdown.bind(this);
  }
  handleChange(e) {
    this.setState({value:e});
    this.props.onChange(e);
  }
  componentWillMount() {
    this.props.getOutworkers()
  }
  dropdown(e){
    var parent = $(e).parents('.ant-modal-wrap');
    if(parent.length> 0){
      return parent[0];
    }
    return document.body;
  }
  render() {
    if(!this.props.outworkers) return <Spin/>;
    let workers = this.props.outworkers;
    if(this.props.onlyEnable){
      workers = _.filter(workers,{Status:1});
    }
    const options = workers.map(d => <Option key={d.UserId}>{d.RealName}</Option>);
    const all = <Option key={0}>全部</Option>

    return (
      <Select style={{width: this.props.width || 150}} getPopupContainer={this.dropdown} value={this.props.value||this.state.value} defaultValue={this.props.value} disabled={this.props.disabled} onChange={this.handleChange}>
      {(!this.props.hideAll) && all}
      {options}
      </Select>
    );
  }
}
const mapStateToProps = ({common}) => {
  return {
    outworkers: common.outworkers,
  }
}
const mapDispatchToProps = dispatch => {
  return {
    getOutworkers: payload => {
      dispatch(getOutworkers())
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Main);
