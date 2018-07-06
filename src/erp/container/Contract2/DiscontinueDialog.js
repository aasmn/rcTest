import React from 'react'
import { Spin, message, Button, Input } from 'antd'
import { getListData, postData, putData, getMockerData } from '@/erp/api'
import _ from 'lodash'
import * as ContractActions from '@/erp/config/contractActions'
import Dialog from '@/erp/container/Dialog'
import Title from '@/erp/component/Title'
import store from '@/erp/store'

import CustomerBaseInfo from '@/erp/container/Contract/CustomerBaseInfo'
import ContractDiscontinueList from '@/erp/component/ContractDiscontinueList'
import PayInfo from '@/erp/container/Contract/PayInfo'
import HasPower from '@/erp/container/HasPower'

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            readOnly: false,
            loading: false,
            edit: false
        }

        this.getOrderDetail = this.getOrderDetail.bind(this);
        this.getOrderDetail(props.data);
    }
    getOrderDetail(data) {
        if (!this.props.isNew){
            getListData('workorder/stopcontract/detail?billSuspensionId=' + data.BillSuspensionId).then(res => {
                if (res.status) {
                    _.each(res.data.CrmOrderItems, item => {
                        item.checked = true;
                    });
                    const readOnly = !!(data.Id)
                    this.setState({ data: res.data, readOnly: readOnly});
                }
            })

        }else{
            getListData('order/getcontractbycustomer?contractIds=' + this.props.contractId.join(',')).then(res => {
                if (res.status) {
                    this.setState({ data: res.data });
                }
            })
        }
        
    }
    onSave= (data,type)=>{
        this.setState({loading: true});
        // data.CrmOrderItems = _.filter(data.CrmOrderItems,{checked: true});
        if(data.CrmOrderItems.length ===0){
            message.error('没有选择合同！');
            return;
        }
        const state = store.getState();
        if (data.Remarks && !(/(\{.*\})$/.test(_.trim(data.Remarks)))) {
            data.Remarks = data.Remarks + '{' + state.common.user.RealName + '}';
        }
        data.Remarks = data.Remarks || '';
        if(type< 3){
            putData('order/cancelcontract?tab=' + type, data).then((res) => {
                if (res.status) {
                    message.info('操作成功！');
                    this.close()
                }
                this.setState({ loading: false })
            });
        }else{
            putData('order/updatecancellist', data).then(res=>{
                if (res.status) {
                    message.info('操作成功！');
                    this.close()
                }
                this.setState({ loading: false })
            })
        }
        
    }
    close = ()=>{
        this.props.close(true);
    }
    onEdit= ()=>{
        this.setState({edit: true});
    }
    onPass= ()=>{
        if (this.props.data.AuditStatus == 4){
            let remark;
            const dialog = Dialog({
                content: (<div><label>审核意见</label><Input.TextArea onChange={e => { remark = e.target.value }} /></div>),
                handleOk: () => {
                    if(!remark){
                        message.error('请填写审核意见!');
                        return false;
                    }
                    return save(remark);
                },
                width: 450,
                confirmLoading: false,
                title: "城市总审核"
            })
            const that = this;
            function save(remark) {
                const state = store.getState();
                if (remark && !(/(\{.*\})$/.test(_.trim(remark)))) {
                    remark = remark + '{' + state.common.user.RealName + '}';
                }
                return putData('workorder/stopcontract/pass?billSuspensionId=' + that.props.data.Id, { remark: remark }).then(res => {
                    if (res.status) {
                        that.close()
                    }
                })
            }

        }else{
            putData('workorder/stopcontract/pass?billSuspensionId=' + this.props.data.Id).then(res => {
                if (res.status) {
                    this.close()
                }
            })
        }
        
    }
    onReject = () => {
        let remark;
        const dialog = Dialog({
            content: (<div><label>驳回原因</label><Input.TextArea onChange={e => { remark = e.target.value }} /></div>),
            handleOk: () => {
                // if (!remark) {
                //     message.error("请填写驳回原因!")
                //     return false;
                // }
                return save(remark || '');
            },
            width: 450,
            confirmLoading: false,
            title: "确认结束"
        })
        const that = this;
        function save(remark) {
            const state = store.getState();
            if (remark && !(/(\{.*\})$/.test(_.trim(remark)))) {
                remark = remark + '{' + state.common.user.RealName + '}';
            }
            return putData('workorder/stopcontract/reject?billSuspensionId=' + that.props.data.Id, { remark: remark}).then(res => {
                if (res.status) {
                    that.close()
                }
            })
        }
        
    }
    render() {
        if (!this.state.data) return <Spin />;
        return (
            <div style={this.props.style} className="order-dialog">
                {this.props.reviewable && this.props.data.AuditStatus && this.props.data.AuditStatus <5  && (<Button.Group style={{ textAlign: 'right', display: 'block' }}>
                    <HasPower power="REVIEW"><Button type="primary" onClick={this.onPass.bind(this)}>审核</Button></HasPower>
                    {this.props.data.AuditStatus != 1 && (<HasPower power="REVIEW"><Button type="primary" onClick={this.onReject.bind(this)}>驳回</Button></HasPower>)}
                </Button.Group>)}
                <ContractDiscontinueList loading={this.state.loading} readOnly={this.state.readOnly} edit={this.state.edit} onSave={(data,type)=>{this.onSave(data,type)}} ref={e => { this.ContractInfo = e }} currentId={this.props.contractId} type={this.props.type} data={this.state.data}/>
                {this.props.reviewable && this.props.data.AuditStatus && (this.props.data.AuditStatus == 1 || this.props.data.AuditStatus > 6) && !this.state.edit &&  (
                    <Button.Group style={{ textAlign: 'center', display: 'block' }}>
                        <HasPower power="EDIT"><Button type="primary" onClick={this.onEdit.bind(this)}>编辑</Button></HasPower>
                    </Button.Group>
                )}
            </div>
        );
    }
}

export default Main
