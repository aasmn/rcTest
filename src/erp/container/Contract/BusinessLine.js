
import React, { Component } from 'react'
import { DatePicker, Checkbox } from 'antd'
import moment from 'moment'
import _ from 'lodash'
const fDate =(val)=>{
    if((!val) || val.length<10 || val.substr(0,4)==='0001') return null;
    return val.substr(0, 10);
}
class Main extends Component {
  constructor(props) {
    super(props);
    const data =  props.value;
    this.state = {
      RegisterDate: fDate(data.RegisterDate),
      BusnissDeadline: fDate(data.BusnissDeadline),
      NoDeadLine: data.NoDeadLine
    };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(v) {
    this.setState(v,()=>{
      this.props.onChange(this.state);
    });
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.value || nextProps.defaultValue){
      const data = nextProps.value || nextProps.defaultValue;
      this.setState({
        RegisterDate: fDate(data.RegisterDate),
        BusnissDeadline: fDate(data.BusnissDeadline),
        NoDeadLine: data.NoDeadLine
      })
    }
  }
  render() {
    const data = this.state
      if(this.props.readOnly){
        return data.NoDeadLine?(<span>无期限</span>):(<span>{data.RegisterDate} 至 {data.BusnissDeadline}</span>)
      }
    return (
      <div style={{display:'inline-block'}}>
        <DatePicker value={data.RegisterDate && moment(data.RegisterDate)} onChange={v=>{this.handleChange({RegisterDate:v && v.format('YYYY-MM-DD')})}}/> 
        <span>至</span> 
        <DatePicker disabled={!!this.state.NoDeadLine} value={data.BusnissDeadline && moment(data.BusnissDeadline)} onChange={v=>{this.handleChange({BusnissDeadline:v && v.format('YYYY-MM-DD')})}}/>  
        <Checkbox checked={data.NoDeadLine} onChange={e=>{this.handleChange({NoDeadLine: e.target.checked?1:0})}}>无期限</Checkbox>
      </div>
    );
  }
}

export default Main;