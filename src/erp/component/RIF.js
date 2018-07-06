import React from 'react'

class RIf extends React.Component {
  render() {
    if(this.props.if){
        return React.Children.only(this.props.children)
    }else{
        return null;
    }
  }
}


export default RIf;
