import React, { Component } from 'react'
import { Radio } from 'antd'
import _ from 'lodash'


const RadioGroup = Radio.Group;
class PartSelect extends Component {
    constructor(props) {
        super(props);
        this.state = props.value||{};
        this.onChange = this.onChange.bind(this);
        this.onChange2 = this.onChange2.bind(this);
    }
    getValues() {
        return this.state;
    }
    onChange(v) {
        this.setState({ select1: v.target.value },()=>{
            this.props.onChange && this.props.onChange(this.state);
        })
    }
    onChange2(v) {
        this.setState({ select2: v.target.value },()=>{
            this.props.onChange && this.props.onChange(this.state);
        })
        
    }
    render() {
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
                {this.state.select1 ? (<RadioGroup style={{ padding: '12px' }} value={this.state.select2} onChange={this.onChange2}>
                    <Radio value={1}>国税报道完毕 </Radio>
                    <Radio value={2}>地税报道完毕</Radio>
                </RadioGroup>) : null}
            </div>
        )
    }
}
export default PartSelect