import React, { Component } from 'react'
import {Input} from 'antd'

class Main extends Component{
  render (){
    if(this.props.readOnly){
      return <span>{this.props.value}</span>
    }else{
      return <Input {...this.props} />
    }
  }
}
export default Main