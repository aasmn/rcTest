import React, { Component } from 'react'
import { Button, Form, DatePicker, message, Spin } from 'antd'
import _ from 'lodash'
import { putData, getListData } from '@/erp/api'
import store from '@/erp/store'
import moment from 'moment'
import Confirm from '@/erp/component/Confirm'

const FormItem = Form.Item;

class ModelForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      serviceStartDate: '',
      serviceEndDate: '',
      contractMonth: '',
      setFirstMonth: '',
      loading: true,
      firstMonth: null
    }
    this.getserviceEndDate = this.getserviceEndDate.bind(this);
    this.submit = this.submit.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
  }
  componentWillMount() {
    var setFirstMonth = _.filter(this.props.data.CrmOrderItems, {
      "MainItemId": 1
    })
    this.setState({setFirstMonth: setFirstMonth}, () => {
      var giftmonth = this.state.setFirstMonth[0].GiftMonths ? this.state.setFirstMonth[0].GiftMonths : 0;
      const contractMonth = this.state.setFirstMonth[0].OrderMonths + giftmonth
      this.setState({contractMonth: contractMonth},()=>{
        getListData('order/audit/' + this.props.data.CustomerId + '?OrderId=' + (this.props.data.FreChangeOrderId || '')).then(res => {
          if (res.data && res.data.substr(0, 4) !== '0001') {
            let fm;
            if (!this.props.data.FreChangeOrderId) {
              fm = moment(res.data).add(1, 'month')
            } else {
              fm = moment(res.data)
            }
            this.getserviceEndDate(fm);
            this.setState({
              firstMonth: fm,
              loading: false
            })
          } else {
            this.setState({
              loading: false
            })
          }
        });
      });
    })
    
  }
  closeDialog(){
    this.handler.close();
  }
  getserviceEndDate(){
    // console.log(arguments, 'arguments')
    var serviceMonth = this.state.contractMonth - 1
    var start = _.cloneDeep(arguments[0])
    if(this.state.firstMonth){
      Confirm({
        handleOk: () => {
          var enddate = _.cloneDeep(start).add(serviceMonth, 'month')
          this.setState({ serviceEndDate: enddate.format('YYYY-MM') })
        },
        handleCancel: () => {
          this.props.form.setFieldsValue({ serviceStartDate: this.state.firstMonth})
        },
        message: (<div style={{color:'red',fontSize: '1.5em'}}>修改首报月，可能会导致Agent系统报税时间中断而引起数据丢失，确定要修改吗？</div>)
      })
    }else{
      var enddate = _.cloneDeep(start).add(serviceMonth, 'month')
      this.setState({ serviceEndDate: enddate.format('YYYY-MM') })
    }

    
    // console.log(this.state.serviceEndDate)
  }
  submit() {
    // console.log(arguments, 'aa')
    if (!this.state.serviceEndDate) {
      message.error('请填写首报月')
      return false
    }
    const info = this.props.data
    var AccountantTaskSource = info.AccountantTaskSource,
    PartTax = info.PartTax?info.PartTax:0,
    ServiceStatus = info.ServiceStatus;
    var ServiceStart = _.extend(this.props.form.getFieldsValue().serviceStartDate).format('YYYY-MM')
    var ServiceEnd = this.state.serviceEndDate
    putData('order/audit/pass/' + info.TaskBillId + '?accountantTaskSource=' + AccountantTaskSource + '&partTax=' + PartTax + '&serviceStatus=' + ServiceStatus + '&serviceStartDate=' + ServiceStart + '&serviceEndDate=' + ServiceEnd).then(res => {
      console.log(store)
      if (res.status) {
        message.info('审核成功！');
        this.closeDialog();
        store.dispatch({
          type: 'set contract account modal status',
          status: {
            modal1: false,
            modal2: false
          }
        })
      }
    })
  }
  render() {
    if(this.state.loading) return <Spin/>;
    // if (this.state.firstMonth) return (<div style={{color:'red',fontSize:'1.5em'}}> 合同续单功能暂时关闭，请周五(2月9日)后再审核</div>);
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    }
    return (
      <div style={{overflow: 'hidden'}}>
        <div><label>服务月份：</label>{this.state.contractMonth + '个月'}</div>
        <Form layout="vertical">
          <FormItem
            {...formItemLayout}
            label="请选择首报月"
          >
            {getFieldDecorator('serviceStartDate', {
              rules: [{
                required: true, message: '请选择首报月!',
              }],
              initialValue: this.state.firstMonth
            })(
              <DatePicker.MonthPicker onChange={this.getserviceEndDate} disabled={!!this.props.data.FreChangeOrderId}/>
            )}
          </FormItem>
          {this.state.firstMonth ? (this.props.data.FreChangeOrderId ? (<div style={{ color: 'red' }}>注：该订单是变更单，请注意首报月。</div>):(<div style={{color:'red'}}>注：该公司已存在记账订单，请注意服务月份是否连续</div>)) : null}
        </Form>
        <div><label>服务结束月：</label>{this.state.serviceEndDate}</div>
        <Button style={{float: 'right'}} type="primary" onClick={this.submit} >保存并提交</Button>
      </div>
    )
  }
}
export default Form.create()(ModelForm)
