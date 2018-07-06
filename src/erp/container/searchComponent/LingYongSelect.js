import React, { Component } from 'react'
import { Select, Spin } from 'antd'
import { connect } from 'react-redux'
import { getAllSalers } from '@/erp/store/actions'
import { getListData } from '@/erp/api'


const Option = Select.Option;

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      value: null,
    };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(e) {
    this.setState({value:e});
    this.props.onChange(e);
  }
  componentWillMount() {
    getListData('receivebill/users').then(res=>{
      this.setState({
        data: res.data
      })
    })
  }
  render() {
    if(!this.state.data) return <Spin/>;
    const options = this.state.data.map(d => <Option key={d.UserId}>{d.RealName}</Option>);
    const all = <Option key={0}>全部</Option>
    const showAll = !(this.props.multiple || this.props.hideAll);
    if(showAll) options.unshift(all);
    return (
      <Select
        style={{width: this.props.width || 150}}
        mode= {this.props.multiple?'multiple': false}
        showSearch={!this.props.multiple}
        defaultValue={this.props.value}
        onChange={this.handleChange}
      >
      {options}
      </Select>
    );
  }
}
export default Main;
