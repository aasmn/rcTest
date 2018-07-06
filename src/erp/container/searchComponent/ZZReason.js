import React, { Component } from 'react'
import { Select, Spin } from 'antd'
import { connect } from 'react-redux'
import { getZZReason } from '@/erp/store/actions'
// 中止原因

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
    return (
      <Select style={{width: this.props.width || 150}} defaultValue={this.props.value} onChange={this.handleChange}>
      {options}
      </Select>
    );
  }
}
const mapStateToProps = ({common}) => {
  return {
    data: common.zzreason,
  }
}
const mapDispatchToProps = dispatch => {
  return {
    getData: payload => {
      dispatch(getZZReason())
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Main);
