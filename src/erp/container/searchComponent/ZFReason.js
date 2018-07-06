import React, { Component } from 'react'
import { Select, Spin } from 'antd'
import { connect } from 'react-redux'
import { getZFReason } from '@/erp/store/actions'
// 作废原因

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
    this.props.getData()
  }
  render() {
    if(!this.props.data) return <Spin/>;
    const options = this.props.data.map(d => <Option key={d.code}>{d.desc}</Option>);
    if(this.props.disabled || this.props.readOnly){
      const data = this.props.data.find(t=>t.code == this.props.value);
      if(data){
        return <span>{data.desc}</span>
      }else{
        return null;
      }
    }
    const all = <Option key=' '>全部</Option>;
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
    data: common.zfreason,
  }
}
const mapDispatchToProps = dispatch => {
  return {
    getData: payload => {
      dispatch(getZFReason())
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Main);
