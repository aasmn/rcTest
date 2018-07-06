import React, { Component } from 'react'
import { Select, Spin } from 'antd'
import { connect } from 'react-redux'
import { getAreas } from '@/erp/store/actions'


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
    this.props.getAreas()
  }
  render() {
    if(!this.props.areas) return <Spin/>;
    const options = this.props.areas.map(d => <Option key={d.AreaCode}>{d.AreaName}</Option>);
    const all = <Option key=' '>全部</Option>;
    if(this.props.disabled){
      const area = this.props.areas.find(t=>t.AreaCode === this.props.value);
      if(area){
        return <span>{area.AreaName}</span>
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
    areas: common.areas,
  }
}
const mapDispatchToProps = dispatch => {
  return {
    getAreas: payload => {
      dispatch(getAreas())
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Main);
