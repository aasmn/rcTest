import React, { Component } from 'react'
import { Select, Spin } from 'antd';
import { connect } from 'react-redux'
import {getAllRoles} from '@/erp/store/actions'

const Option = Select.Option;

class RolesSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null
    };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(e) {
    this.setState({value:e});
    this.props.onChange(e);
  }
  componentWillMount() {
    this.props.getAllRoles()
  }
  render() {
    if(!this.props.roles) return <Spin/>
    const options = this.props.roles.map(d => <Option key={d.Id}>{d.RoleName}</Option>);
    return (
      <Select style={{width: '100%'}} mode="multiple" value={this.props.value}  onChange={this.handleChange}>{options}</Select>
    );
  }
}

const mapStateToProps = ({common}) => {
  return {
    roles: common.roles,
  }
}
const mapDispatchToProps = dispatch => {
  return {
    getAllRoles: payload => {
      dispatch(getAllRoles())
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(RolesSelect);
