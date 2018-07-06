import React from 'react'
import { connect } from 'react-redux'
import { powerList } from '@/erp/config/filters'


class HasPower extends React.Component {
  // shouldComponentUpdate(nextProps, nextState) {
  //   // if(nextProps.power == this.props.power){
  //   //   return false;
  //   // }
  //   // return true;
  // }
  render() {
    // console.log('HasPower',this.props)
    const hasPower= powerList(this.props.functions);
    if(this.props.hide) return null;
    if(hasPower(this.props.power)){
        return React.Children.only(this.props.children)
    }else{
        return null;
    }
  }
}
const mapStateToProps = ({common}) => {
  return {
    functions: common.functions
  }
}

export default connect(mapStateToProps)(HasPower);
