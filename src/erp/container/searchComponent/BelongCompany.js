import React, { Component } from 'react'
import { Select, Spin } from 'antd'
import { connect } from 'react-redux'
import { getBelongCompany } from '@/erp/store/actions'

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
    this.props.getBelongCompany()
  }
  render() {
    if(!this.props.belongCompany) return <Spin/>;
    const options = this.props.belongCompany.map(d => <Option key={d.Id}>{d.CompanyName}</Option>);
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
    belongCompany: common.belongCompany,
  }
}
const mapDispatchToProps = dispatch => {
  return {
    getBelongCompany: payload => {
      dispatch(getBelongCompany())
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Main);
