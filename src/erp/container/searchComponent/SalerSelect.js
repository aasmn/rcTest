import React, { Component } from 'react'
import { Select } from 'antd'
import { connect } from 'react-redux'
import { getAllSalers } from '@/erp/store/actions'
import { getListData } from '@/erp/api'


const Option = Select.Option;

let timeout;
let currentValue;
function fetch(value, callback) {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  currentValue = value;
  function fake() {
    getListData(`order/sales?query=@/erp{value}`)
      .then((d) => {
        if (currentValue === value) {
          const result = d.data;
          const data = [];
          result.forEach((r) => {
            data.push({
              value: r.Id,
              text: r.RealName,
            });
          });
          callback(data);
        }
      });
  }
  timeout = setTimeout(fake, 300);
}
class SalerSearch extends React.Component {
  state = {
    data: [],
    value: '',
  }
  handleChange = (value) => {
    this.setState({ value });
    this.props.onChange(0);
    fetch(value, data => {
      this.setState({ data })
    });
  }
  onSelect= (item)=>{
    this.setState({value: this.state.data.find(t=>t.value==item).text});
    this.props.onChange(item);
  }
  render() {
    const options = this.state.data.map(d => <Option key={d.value}>{d.text}</Option>);
    return (
      <Select
        style={{width:'100px'}}
        mode="combobox"
        value={this.state.value}
        placeholder={this.props.placeholder}
        defaultActiveFirstOption={false}
        showArrow={false}
        filterOption={false}
        onSearch={this.handleChange}
        onFocus={e=>{this.handleChange('')}}
        onSelect={this.onSelect}
      >
        {options}
      </Select>
    );
  }
}

class SalerSelect extends Component {
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
    this.props.getAllSalers()
  }
  render() {
    if(!this.props.salers) return null;
    const options = this.props.salers.map(d => <Option key={d.Id}>{d.RealName}</Option>);
    const all = <Option key={0}>全部</Option>
    const showAll = !(this.props.multiple || this.props.hideAll);
    if(showAll) options.unshift(all);
    return (
      <Select
        style={{width: this.props.width || 150}}
        mode= {this.props.multiple?'multiple': false}
        showSearch={!this.props.multiple}
        optionFilterProp="children"
        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        defaultValue={this.props.value}
        onChange={this.handleChange}
      >
      {options}
      </Select>
    );
  }
}
const mapStateToProps = ({common}) => {
  return {
    salers: common.salers,
  }
}
const mapDispatchToProps = dispatch => {
  return {
    getAllSalers: payload => {
      dispatch(getAllSalers())
    }
  }
}
export default SalerSearch;
export const Salers = connect(mapStateToProps, mapDispatchToProps)(SalerSelect);
