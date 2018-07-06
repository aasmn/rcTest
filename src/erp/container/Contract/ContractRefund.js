import React from 'react'
import Title from '@/erp/component/Title'
import _ from 'lodash'
import moment from 'moment'
import { Input, message, DatePicker, Checkbox } from 'antd'
import { fDate, fMonth } from '@/erp/config/filters'
import AddedValue from '@/erp/container/searchComponent/AddedValue'

class Main extends React.Component {
    changeAmount = (v)=>{
        if(this.amount) this.amount.input.value = v;
    }
    render() {
        let data = _.isArray(this.props.data) ? this.props.data[0] : this.props.data;
        data = data || {};
        if (this.props.readOnly) {
            return (
                <div>
                    {(!this.props.hideTitle) && <Title title="退款信息" />}
                    <div className="padding list-span ant-form ant-form-inline">
                        <span className="ant-form-item-required">退款金额：{data.RefundAmount}</span>
                        <span className="ant-form-item-required">退款银行/第三方：{data.RefundName}</span>
                        <span className="ant-form-item-required">账号：{data.Number}</span>
                        <span className="ant-form-item-required">开户人：{data.AccountOpening} </span>
                        {this.props.review && (<span className="ant-form-item-required">打款时间<DatePicker defaultValue={data.RefundTime ? moment(data.RefundTime) : null} placeholder="打款时间" disabled={!this.props.pbReadOlny} onChange={e => this.props.onChange({ 'RefundTime': e })} /></span>)}
                    </div>
                </div>
            );
        } else {
            return (
                <div>
                    {(!this.props.hideTitle) && <Title title="退款信息" />}
                    <div className="padding list-span ant-form ant-form-inline">
                        <span className="ant-form-item-required">退款金额：<Input ref={e=>{this.amount = e}} defaultValue={data.RefundAmount} readOnly={this.props.amReadOnly} onChange={e => this.props.onChange({ 'RefundAmount': e.target.value })} /></span>
                        <span className="ant-form-item-required">退款银行/第三方：<Input defaultValue={data.RefundName} placeholder="银行请精确到支行名称" onChange={e => this.props.onChange({ 'RefundName': e.target.value })} /></span>
                        <span className="ant-form-item-required">账号：<Input defaultValue={data.Number} placeholder="请输入账号" onChange={e => this.props.onChange({ 'Number': e.target.value })} /></span>
                        <span className="ant-form-item-required">开户人：<Input defaultValue={data.AccountOpening} placeholder="开户人姓名" onChange={e => this.props.onChange({ 'AccountOpening': e.target.value })} /></span>
                    </div>
                </div>
            );
        }

    }
}
export default Main;