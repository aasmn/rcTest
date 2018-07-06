import React from 'react';
import { Form, Input, Spin } from 'antd';

import Customer from '@/erp/container/Contract/EditCustomer'
import { getListData } from '@/erp/api';




// function hasErrors(fieldsError) {
//   return Object.keys(fieldsError).some(field => fieldsError[field]);
// }

class Main extends React.Component {
    state= {
      data: null
    }
    componentWillMount(){
      getListData('customerdetail/'+ this.props.customerId).then(res=>{
        if(res.data){
          const user = JSON.parse(window.sessionStorage.getItem('user'))
          res.data.CityName = user.CityName;
          res.data.CityCode = user.CityCode;
          this.setState({data: res.data})
        }
      })
    }
    getFieldsValue = ()=>{

      return this.form.getFieldsValue()

    }
    render () {
      if(!this.state.data) return <Spin/>;
      return (
          <Customer  data={this.state.data} wrappedComponentRef={v=>{this.form=v}}/>
      )
    }
}

export default Main;;
