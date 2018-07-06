import React, { Component } from 'react'
import { Select } from 'antd';
import { connect } from 'react-redux'
import {getAllDepartments} from '@/erp/store/actions'

const Option = Select.Option;

class DepartmentSelect extends Component {
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
    this.props.getAllDepartments()
  }
  render() {
    const options = this.props.departments.map(d => <Option key={d.DepartmentId}>{d.DepartmentName}</Option>);
    return (
      <Select style={{width: 150}} value={this.props.value} onChange={this.handleChange}>{options}</Select>
    );
  }
}

const mapStateToProps = ({common}) => {
  return {
    departments: common.departments,
  }
}
const mapDispatchToProps = dispatch => {
  return {
    getAllDepartments: payload => {
      dispatch(getAllDepartments({showAll:false}))
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(DepartmentSelect);
