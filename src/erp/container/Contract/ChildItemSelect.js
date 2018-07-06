import React, { Component } from 'react'
import { Select, Spin } from 'antd'
import { connect } from 'react-redux'
import { getMainItemList } from '@/erp/store/actions'


const Option = Select.Option;

class Main extends Component {
  constructor(props) {
    super(props);
    this.state= {value:'' + (props.defaultValue||props.value||'')};
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(e) {
    this.props.onChange(+e);
    this.setState({value: e})
  }
  componentWillMount() {
    this.props.getMainItemList()
  }
  componentWillReceiveProps(props) {
    if(props.mainId !== this.props.mainId){
      this.setState({value: null})
    }else{
      this.setState({value: '' + (props.defaultValue||props.value||'')})
    }
  }
  render() {
    if(!this.props.contractItems) return <Spin/>;
    if(!this.props.mainId){
      return (<Select size={this.props.size} disabled={this.props.disabled} style={{width: this.props.width || 150}}  onChange={this.handleChange}>
      </Select>)
    } 
    const main = this.props.contractItems.find(item=>{return +item.Id === +this.props.mainId})
    if(!main) return null;
    
    if(this.props.disabled){
      const item = main.Children.find(t=>t.Id === (this.props.defaultValue||this.props.value));
      if(item){
        return <span>{item.ChildItemName}</span>
      }else{
        return null;
      }
    }
    const options = main.Children.map(d => <Option key={d.Id}>{d.ChildItemName}</Option>);
    return (
      <Select size={this.props.size} disabled={this.props.disabled} value={this.state.value} style={{width: this.props.width || 150}} onChange={this.handleChange}>
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
