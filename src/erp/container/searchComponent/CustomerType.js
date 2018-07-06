import React, {Component} from 'react'
import {Select, Spin} from 'antd'
import {connect} from 'react-redux'
import {getCustomerType} from '@/erp/store/actions'

const Option = Select.Option;

function ctypeSortFn(a, b) {
  return parseInt(b.Name, 10) - parseInt(a.Name, 10);
}

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({value: e});
    this.props.onChange(e);
  }

  componentWillMount() {
    this.props.getCustomerType()
  }

  render() {
    const {customerTypes, readOnly, width, value, hideAll} = this.props
    if (!customerTypes) return <Spin/>
    const data = this.props.customerTypes.sort(ctypeSortFn)

    const options = data.map(d => <Option key={d.CustomerTypeId}>{d.Name}</Option>);
    const all = <Option key={0}>全部</Option>
    return (
      <Select style={{width: width || 150}}
              defaultValue={'' + value}
              onChange={this.handleChange}
              disabled={readOnly ? true : false}>
        {(!hideAll) && all}
        {options}
      </Select>
    );
  }
}

const mapStateToProps = ({common}) => {
  return {
    customerTypes: common.customerTypes,
  }
}
const mapDispatchToProps = dispatch => {
  return {
    getCustomerType: payload => {
      dispatch(getCustomerType())
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Main);
