import React, { Component } from 'react'
import { Select, Spin } from 'antd'
import { connect } from 'react-redux'
import { getMainItemList } from '@/erp/store/actions'


const Option = Select.Option;

class Main extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(e) {
    this.props.onChange(+e);
  }
  componentWillMount() {
    this.props.getMainItemList()
  }
  render() {
    if(!this.props.contractItems) return <Spin/>;
    const items = this.props.contractItems.filter(item=>{return item.Id ===2 || item.Id===3})
    const options = items.map(d => <Option key={d.Id}>{d.Name}</Option>);
    if(this.props.disabled){
      const item = this.props.contractItems.find(t=>{ return t.Id.toString() === (this.props.defaultValue||this.props.value).toString()});
      if(item){
        return <span>{item.Name}</span>
      }else{
        return null;
      }
    }
    return (
      <Select size={this.props.size} disabled={this.props.disabled} style={{width: this.props.width || 150}} defaultValue={(this.props.defaultValue||this.props.value||'')+''} onChange={this.handleChange}>
        {options}
      </Select>
    );
  }
}
const mapStateToProps = state => {
  return {
    contractItems: state.common.contractItems,
  }
}
const mapDispatchToProps = dispatch => {
  return {
    getMainItemList: payload => {
      dispatch(getMainItemList())
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Main);
