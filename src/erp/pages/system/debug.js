import React, { Component } from 'react'
// import { putData, deleteData } from '@/erp/api'
import { Input, Radio } from 'antd'
// import _ from 'lodash'
const RadioGroup = Radio.RadioGroup;

class Main extends Component {
    constructor(props) {
        super(props);
        this.state={
            url: '',
            params:{},
            result:''
        }
    }
    onSearch(url){

    }
    onChangeParams = (value)=>{
        try{
            if (value) {
                this.setState({
                    params: JSON.parse(value)
                });
            }
        }catch(err){
            alert(err.toString());
        }
    }
    render() {
        return (
            <div>
                <span>接口地址</span>
                <Input.Search enterButton="Go" onSearch={this.onSearch}/>
                <span>方式</span>
                <div>
                    <RadioGroup onChange={this.onChange} value={this.state.value}>
                        <Radio value="get">Get</Radio>
                        <Radio value="post">Post</Radio>
                        <Radio value="put">Put</Radio>
                        <Radio value="delete">Delete</Radio>
                    </RadioGroup>
                </div>
                <span>参数</span>
                <Input.TextArea onChange={e => { this.onChangeParams(e.target.value)}}/>
                <span>结果</span>
                <pre>{this.state.result}</pre>
            </div>
        )
    }
}

export default Main
