import React from 'react'
import { Spin, message, Button, Input } from 'antd'
import { getListData, postData, putData, getMockerData } from '@/erp/api'
import _ from 'lodash'
import Dialog from '@/erp/container/Dialog'
import Title from '@/erp/component/Title'
import store from '@/erp/store'

import OrderInfo from '@/erp/component/orderInfo'
import LingYongContract from '@/erp/component/LingYongContract'
import LingYongRen from '@/erp/component/LingYongRen'
import HasPower from '@/erp/container/HasPower'
import { connect } from 'react-redux'
import { lyAmountChange } from '@/erp/store/actions'
import Confirm from '@/erp/component/Confirm'

const LYC = connect(({ lydata }) => ({ data: lydata }), (dispatch) => {
  return {
    onApplyAmountChange: (row, value) => {
      dispatch(lyAmountChange(row, value))
    },
    onRemarkChange: (value) => {
      dispatch({
        type: 'change remarks',
        data: value
      })
    }
  }
})(LingYongContract)

const LYR = connect(
  ({ lydata }) => {
    return {
      data: lydata.PayAccountInfo,
      lyList: lydata.LYUser
    }
  }, (dispatch) => {
    return {
      onSetData: (data) => {
        dispatch({
          type: 'change lyr data',
          data: data
        })
      },
      saveData: (data) => {
        data.PayTypeId = 1
        postData('user/payaccount', data)
      },
      fetchData: (Id) => {
        getListData('user/payaccount', { userId: Id, payTypeId: 1 }).then(res => {
          dispatch({
            type: 'change lyr data',
            data: res.data
          })
        })
      }
    }
  }
)(LingYongRen)

class Main extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      data: null,
      readOnly: !props.data.ContractNo,
      loading: false,
      edit: false
    }

    this.getOrderDetail = this.getOrderDetail.bind(this);
    this.getOrderDetail(props.data);
  }
  getOrderDetail (data) {
    store.dispatch({
      type: 'reset lydata'
    });
    if(data.ContractNo){
      getListData('receivebill/form?contractNo=' + data.ContractNo + '&id=' + data.Id).then(res => {
        this.setState({
          data: res.data
        });
        res.data.AuditStatus = 0
        store.dispatch({
          type: 'set lydata',
          data: res.data
        });
      })
      
    }else{
      getListData('receivebill/detail?billId=' + data.Id).then(res => {
        res.data.AuditStatus = this.props.data.AuditStatus
        this.setState({
          data: res.data
        })
        store.dispatch({
          type: 'set lydata',
          data: res.data
        });
      })
    }
    getListData('receivebill/users?customerid='+ data.CustomerId).then(res => {
      store.dispatch({
        type: 'set lingyongren list',
        data: res.data || []
      })
    })
  }
  valiateData = (data) => {
    const ContractList = data.ContractList
    for(var i = 0; i<ContractList.length; i++){
      const item = ContractList[i]
      if(parseFloat(item.ApplyAmount) > parseFloat(item.Amount - item.ReceivedAmount)){
        message.error('领用金额不能大于可领金额！')
        return false
      }
    }
    const payinfo = data.PayAccountInfo
    if(isNaN(payinfo.ReceiveAmount)){
      message.error('领用金额不能为空')
      return false
    }
    if(!payinfo.ReceiveUserId){
      message.error('领用人不能为空！')
      return  false
    }
    if(!payinfo.BankOrg){
      message.error('对方银行不能为空')
      return false
    }
    if(!payinfo.Account){
      message.error('账号不能为空！')
      return false
    }
    if(!payinfo.OpenPerson){
      message.error('开户名不能为空！')
      return false
    }
    return true
  }
  onSaveData = () => {
    this.setState({ loading: true });
    // data.CrmOrderItems = _.filter(data.CrmOrderItems,{checked: true});
    let data = _.cloneDeep(store.getState().lydata);
    if(!this.valiateData(data)){
      return;
    }
    Confirm({
      handleOk: () => {
        postData('receivebill/saveorupdate', store.getState().lydata).then(res=>{
          if(res.status){
            message.info('操作成功！')
            this.props.close(true)
          }
        })
        return true;
      },
      message: '确认要领用吗？'
    })
  }

  render () {
    if (!this.state.data) return <Spin />;
    const data = this.state.data
    return (
      <div style={this.props.style} className="order-dialog">
        <OrderInfo data={data.OrderInfo} />
        <LYC readOnly={this.state.readOnly}/>
        <LYR readOnly={this.state.readOnly} isFin={this.props.isFin}/>
        {this.props.data.ContractNo &&
          <div style={{textAlign:'center'}}><Button type="primary" onClick={this.onSaveData}>提交审核</Button></div>
        }
        {
          (!this.props.data.ContractNo) && this.props.data.AuditStatus <4 && !this.props.isFin && <div style={{textAlign:'center'}}>
            {this.state.readOnly ? (<Button type="primary" onClick={e=>this.setState({readOnly: false})}>编辑</Button>) : (<Button type="primary" onClick={this.onSaveData}>保存</Button>)}
          </div>
        }
      </div>
    );
  }
}

export default Main
