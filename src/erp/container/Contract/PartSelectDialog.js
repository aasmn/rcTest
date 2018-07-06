import React, { Component } from 'react'
import { Radio } from 'antd'
import _ from 'lodash'
import Dialog from '@/erp/container/Dialog'

const RadioGroup = Radio.Group;
class PartSelectDialog extends Component{
  constructor(props) {
    super(props);
    let select1 = 0,select2 = 1;
    if(props.defaultValue){
      select1 = props.defaultValue > 0? 1:0;
      select2 = props.defaultValue > 0 ? props.defaultValue: 0;
    }
    this.state= {
      select1: select1,
      select2: select2
    }
    this.onChange = this.onChange.bind(this);
    this.onChange2 = this.onChange2.bind(this);
  }
  getValues(){
    return this.state;
  }
  onChange(v){
    this.setState({select1:v.target.value})
  }
  onChange2(v){
    this.setState({select2:v.target.value})
  }
  render(){
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };
    return (
      <div>
        <RadioGroup onChange={this.onChange} value={this.state.select1} disabled={this.props.onlyAll || this.props.onlyPart}>
          <Radio style={radioStyle} value={0}>资料齐全，提交会计审核</Radio>
          <Radio style={radioStyle} value={1} disabled={this.props.onlyAll}>部分税务报道</Radio>
        </RadioGroup>
        {this.state.select1?(<RadioGroup style={{padding:'12px'}} value={this.state.select2} onChange={this.onChange2}>
          <Radio value={1}>国税报道完毕 </Radio>
          <Radio value={2}>地税报道完毕</Radio>
        </RadioGroup>) : null}
      </div>
    )
  }
}
export default PartSelectDialog