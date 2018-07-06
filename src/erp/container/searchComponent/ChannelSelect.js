import React, { Component } from 'react'
import { Select, Spin } from 'antd'
import { connect } from 'react-redux'
import { getChannel } from '@/erp/store/actions'


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
    this.props.getChannel()
  }
  render() {
    if(!this.props.channels) return <Spin/>;
    const options = this.props.channels.map(d => <Option key={d.ChannelId}>{d.ChannelName}</Option>);
    const all = <Option key=' '>全部</Option>;
    if(this.props.disabled){
      const area = this.props.channels.find(t=>t.ChannelId === this.props.value);
      if(area){
        return <span>{area.ChannelName}</span>
      }else{
        return null;
      }
    }
    return (
      <Select disabled={this.props.disabled} style={{width: this.props.width || 150}} defaultValue={this.props.value} onChange={this.handleChange}>
      {(!this.props.hideAll) && all}
      {options}
      </Select>
    );
  }
}
const mapStateToProps = ({common}) => {
  return {
    channels: common.channels,
  }
}
const mapDispatchToProps = dispatch => {
  return {
    getChannel: payload => {
      dispatch(getChannel())
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Main);
