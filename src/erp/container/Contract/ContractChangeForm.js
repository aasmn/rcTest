import React from 'react'
import Title from '@/erp/component/Title'
import _ from 'lodash'
import moment from 'moment'
import { Input, DatePicker, Checkbox, Row, Col } from 'antd'
import AddedValue from '@/erp/container/searchComponent/AddedValue'

class Accounting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data
        }
        this.validateField = this.validateField.bind(this);
    }
    validateField() {
        const data = this.state.data;
        if (!data.ContractNo) return '请填写合同编号';
        if (_.find(data.items, item => !item.ChildItemId)) return '请选择子项目';
        if (!data.OrderMonths) return '请填写服务期限';
        if (_.isNumber(data.Amount)) return '请填写费用金额';
        if (!data.Remark1) return '请填写备注';
        return null
    }
    setAmount =(v)=>{
        let state = {};
        state.Amount = v;
        if(v && parseFloat(v)>0){
            state.IsRefund = false;
            this.props.onChange({ 'IsRefund': false })
        }
        this.setState(preState=>{
            return _.extend({}, preState, {
                data: _.extend({}, preState.data, state)
            })
        })
    }
    amountFomat = (v)=>{
        let state = {};
        state.Amount = parseFloat(v).toFixed(2);
        this.setState(preState => {
            return _.extend({}, preState, {
                data: _.extend({}, preState.data, state)
            })
        })
    }
    setRefund = (checked)=>{
        let state = {};
        state.IsRefund = checked;
        if (checked) {
            state.Amount = 0;
            this.props.onChange({ 'Amount': 0 })
        }
        this.setState(preState => {
            return _.extend({}, preState, {
                data: _.extend({}, preState.data, state)
            })
        })
    }

    render() {
        const data = this.state.data || {};
        if (this.props.readOnly) {
            return (
                <div>
                    <Title title="变更合同信息" />
                    <div className="padding list-span">
                        <span>余下合同期限：{data.OrderMonths}</span>
                        <span>延长期限：{data.GiftMonths}</span>
                        <span>签订日期：{moment(data.ContractDate).format('YYYY-MM-DD')} </span>
                        <span><Checkbox disabled checked={data.IsRefund} onChange={e => this.props.onChange({'IsRefund': e.target.value})}>需要退费</Checkbox></span>
                    </div>
                    <table className="erp-table ant-table-bordered">
                        <thead className="ant-table-thead">
                            <tr>
                                <th style={{ width: '200px' }}><span>合同编号</span></th>
                                <th style={{ width: '100px' }}><span>项目</span></th>
                                <th style={{ width: '100px' }}><span>子项目</span></th>
                                <th style={{ width: '150px' }}><span>费用</span></th>
                                <th><span>备注</span></th>
                            </tr>
                        </thead>
                        <tbody className="ant-table-tbody" key="group1">
                            <tr className="ant-table-row">
                                <td>{data.ContractNo}</td>
                                <td>记账报税</td>
                                <td>{data.ChildItemId === 1 ? "小规模" : "一般纳税人"}</td>
                                <td>{(+data.Amount || 0).toFixed(2)}</td>
                                <td>{data.Remark}</td>
                            </tr>
                        </tbody>
                    </table>
                    <Row style={{ padding: '12px 0' }}>
                        <Col span={2}><label>备注信息：</label></Col>
                        <Col span={22}>{data.Remark1}</Col>
                    </Row>
                </div>
            );
        } else {
            return (
                <div>
                    <Title title="变更合同信息" />
                    <div className="padding list-span ant-form ant-form-inline">
                        <span>余下合同期限：<Input className="month-input" maxLength="2" value={this.props.lastMonth || data.OrderMonths} onChange={e=>this.props.onChange({'OrderMonths': e.target.value})} /></span>
                        <span>延长期限：<Input className="month-input" maxLength="2" defaultValue={data.GiftMonths} onChange={e => this.props.onChange({ 'GiftMonths': e.target.value })}/></span>
                        <span>签订日期：<DatePicker format="YYYY-MM-DD" defaultValue={data.ContractDate?moment(data.ContractDate):null} onChange={e => this.props.onChange({ 'ContractDate': e.format("YYYY-MM-DD") })} /></span>
                        <span><Checkbox checked={data.IsRefund} onChange={e => { this.setRefund(e.target.checked); this.props.onChange({ 'IsRefund': e.target.checked })}}>需要退费</Checkbox></span>
                    </div>
                    <table className="erp-table ant-table-bordered">
                        <thead className="ant-table-thead">
                            <tr>
                                <th style={{ width: '200px' }}><span>合同编号</span></th>
                                <th style={{ width: '100px' }}><span>项目</span></th>
                                <th style={{ width: '100px' }}><span>子项目</span></th>
                                <th style={{ width: '100px' }}><span>费用</span></th>
                                <th><span>备注</span></th>
                            </tr>
                        </thead>
                        <tbody className="ant-table-tbody">
                            <tr className="ant-table-row">
                                <td><Input size="small" defaultValue={data.ContractNo} onChange={e => { this.props.onChange({ ContractNo: e.target.value }) }} /></td>
                                <td>记账报税</td>
                                <td><AddedValue size="small" disabled hideAll={true} value={data.ChildItemId} onChange={v => { this.props.onChange({ ChildItemId: +v }) }} /></td>
                                <td><Input size="small" value={data.Amount} onBlur={e=>{this.amountFomat(e.target.value)}} onChange={e => { this.setAmount(e.target.value); this.props.onChange({ Amount: e.target.value }) }} /></td>
                                <td><Input size="small" maxLength="50" defaultValue={data.Remark} onChange={e => {this.props.onChange({ Remark: e.target.value }) }} /></td>
                            </tr>
                        </tbody>
                    </table>
                    <Row style={{ padding: '12px 0' }}>
                        <Col span={2}><label className="ant-form-item-required">备注信息：</label></Col>
                        <Col span={22}><Input.TextArea defaultValue={data.Remark1} onChange={v => { this.props.onChange({ Remark1: v.target.value }) }} /></Col>
                    </Row>
                </div>
            );
        }

    }
}
export default Accounting;