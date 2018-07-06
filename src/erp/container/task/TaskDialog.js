import React, { Component } from 'react'
import { Tabs, List, Spin, message, Button, Input } from 'antd'
import { getListData, putData } from '@/erp/api'
import ViewCustomer from '@/erp/container/Contract/ViewCustomer'
import EditCustomer from '@/erp/container/Contract/EditCustomer'
import TaskList from '@/erp/component/TaskList'
import OrderAll from '@/erp/container/Contract/OrderAll'
import _ from 'lodash'
import Dialog from '@/erp/container/Dialog'
import OutworkerTask from '@/erp/container/Outworker/Task'
import TaskListWeight from '@/erp/container/Outworker/TaskListWeight';

import SubmitToAccount from '@/erp/component/SubmitToAccount'

const TabPane = Tabs.TabPane;
const TextArea = Input.TextArea

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orderInfo: null,
            customerInfo: null,
            activeKey: "1",
            isEditing: false,
            hasOutWork: false
        }
        this.getBaseInfo = this.getBaseInfo.bind(this);
        this.onTabClick = this.onTabClick.bind(this);
        this.setEditing = this.setEditing.bind(this);
        this.getBaseInfo();
        this.closeDialog = this.closeDialog.bind(this);
    }
    closeDialog() {
        this.props.close();
    }
    getBaseInfo() {
        const row = this.props.row;
        getListData('customerdetail/' + this.props.row.Id ).then(res => {
            res.data = _.extend(res.data, row);
            this.setState({
                customerInfo: res.data
            })
        });
        getListData('customer/' + this.props.row.Id + '/to-do-contracts').then(res => {
            this.setState({
                taskList: res.data
            })
        })
    }
    setEditing() {
        if (this.state.isEditing) {
            let data = this.editform.getFieldsValue();
            if (!data) return;
            if (data && !data.AreaCode) {
                message.error('请选择区域');
                return;
            }
            putData(`Customer/update/@/erp{data.Id}?syncDate=`, data).then(res => {
                if (res.status) {
                    message.info('保存成功!');
                    if (this.props.refreshTable) this.props.refreshTable();
                    this.setState({
                        customerInfo: { ...data }
                    });
                    this.setState((preState) => {
                        return {
                            isEditing: !preState.isEditing
                        }
                    });
                }
            });
        } else {
            this.setState((preState) => {
                return {
                    isEditing: !preState.isEditing
                }
            });
        }

    }
    SaveToOutWork = ()=>{
        const selectedkeys = this.tasklist.state.selectedRowKeys;
        const selectedItems = _.filter(this.state.taskList,(item)=>{
            return selectedkeys && selectedkeys.indexOf(item.Id)>-1
        });
        if(selectedItems.length ===0 ){
            message.error('请选择合同！');
            return;
        }
        const agentItems = _.filter(selectedItems, item=>{
            return item.MainItemName === '记账报税'
        });
        if (agentItems.length>1 ){
            message.error('不能同时选择两个记账报税合同！');
            return;
        }
        this.createOutWorkerTask(this.state.hasOutWork);
    }
    createOutWorkerTask = (hasOut)=>{

        const customer = {
            Customer: this.state.customerInfo,
            AreaCode: this.state.customerInfo.AreaCode
        };
        const contractIds = this.tasklist.state.selectedRowKeys;
        const remark = this.state.Remark;
        const that = this;
        Dialog({
            content: <OutworkerTask data={customer} isOnlyFree={!hasOut} wrappedComponentRef={crmform => { that.crmform = crmform }} />,
            width: 1100,
            handleOk: () => {
                return new Promise((resolve, reject) => {
                    const formdata = that.crmform.getFieldsValue();
                    let taskform;
                    if (formdata) {
                        if (formdata.CommonTaskId === 0) {
                            Dialog({
                                content: <TaskListWeight data={formdata.ChildTasks} ref={form => { if (form) taskform = form; }} />,
                                width: 600,
                                handleOk: () => {
                                    if (_.uniqBy(taskform.data, 'Weight').length < taskform.data.length) {
                                        message.error('权重不允许重复！')
                                        return false;
                                    }
                                    return true;
                                },
                                confirmLoading: false,
                                handleCancel() {
                                },
                                title: "修改权重"
                            }).result.then(() => {
                                formdata.ChildTasks = taskform.data;
                                saveData();
                            }, reject);
                        } else {
                            if (formdata){
                                saveData();
                            }else{
                                reject();
                            }
                            
                        }
                    } else {
                        reject();
                    }

                    function saveData() {
                        if(formdata){
                            _.each(formdata.ChildTasks, item => {
                                item.CustomerId = formdata.Customer.Id
                            });
                        }
                        const outworkerData = formdata && {
                            ...formdata,
                            AreaCode: formdata.AreaCode,
                            MainTaskName: formdata.MainTaskName,
                            CustomerId: formdata.Customer.Id
                        };
                        putData('task-bill/outworker-submit', {
                            ContractIds: contractIds,
                            Remark: remark,
                            MainTaskDto: outworkerData
                        }).then(res => {
                            if (res.status) {
                                resolve()
                            } else {
                                reject();
                            }
                        }, reject);
                    }
                });
            },
            confirmLoading: false,
            handleCancel() {
                console.log('onCancel');
            },
            title: "添加任务"
        }).result.then(() => {
            that.closeDialog()
        }, () => { });
        
    }
    SaveToAccount = ()=>{
        const selectedkeys = this.tasklist.state.selectedRowKeys;
        const selectedItems = _.filter(this.state.taskList, (item) => {
            return selectedkeys && selectedkeys.indexOf(item.Id) > -1
        });
        if (selectedItems.length === 0) {
            message.error('请选择合同！');
            return;
        }
        if (!this.state.customerInfo.ServiceCompanyCode){
            message.error("请通过公司提供的查询服务入口获取公司信息！")
            return;
        }
        const agentItems = _.filter(selectedItems, item => {
            return item.MainItemName === '记账报税'
        });
        if (agentItems.length > 1) {
            message.error('不能同时选择两个记账报税合同！');
            return;
        }
        this.createAccountTask(agentItems.length);
    }
    createAccountTask = (hasAg)=>{
        const customer = {
            Customer: this.state.customerInfo,
            AreaCode: this.state.customerInfo.AreaCode
        };
        
        const contractIds = this.tasklist.state.selectedRowKeys;
        const remark = this.state.Remark;
        const that = this;
        if(hasAg){
            Dialog({
                content: <SubmitToAccount editable={1} areaCode={customer.Customer.AreaCode} popView={crmform => { this.accform = crmform }} />,
                width: 1100,
                handleOk: () => {
                    return new Promise((resolve, reject) => {
                        let formdata = that.accform.getOutWorkData();
                        if (formdata && formdata.ChildTasks.length===0){
                            formdata = null;
                        }
                        let taskform;
                        if (formdata) {
                            Dialog({
                                content: <TaskListWeight data={formdata.ChildTasks} ref={form => { if (form) taskform = form; }} />,
                                width: 600,
                                handleOk: () => {
                                    if (_.uniqBy(taskform.data, 'Weight').length < taskform.data.length) {
                                        message.error('权重不允许重复！')
                                        return false;
                                    }
                                    return true;
                                },
                                confirmLoading: false,
                                handleCancel() {
                                },
                                title: "修改权重"
                            }).result.then(() => {
                                formdata.ChildTasks = taskform.data;
                                saveData(formdata);
                            }, reject);
                            
                        } else {
                            saveData(null);
                        }

                        function saveData(formdata) {
                            if (formdata) {
                                _.each(formdata.ChildTasks, item => {
                                    item.CustomerId = that.state.customerInfo.Id
                                });
                            }
                            const outworkerData = formdata && {
                                ...formdata,
                                AreaCode: formdata.AreaCode,
                                MainTaskName: formdata.MainTaskName,
                                CustomerId: that.state.customerInfo.Id
                            };
                            const select = that.accform.state.partTax;
                            putData('task-bill/accounting-submit', {
                                ContractIds: contractIds,
                                PartTax: select.select1 == 1 ? select.select2 : 0,
                                Remark: remark,
                                MainTaskDto: outworkerData
                            }).then(res => {
                                if (res.status) {
                                    message.info('保存成功！')
                                    resolve()
                                } else {
                                    reject();
                                }
                            }, reject);
                        }
                    });
                },
                confirmLoading: false,
                handleCancel() {
                    console.log('onCancel');
                },
                title: "添加任务"
            }).result.then(() => {
                this.closeDialog()
            }, () => { });
        }else{
            putData('task-bill/accounting-submit', {
                ContractIds: contractIds,
                PartTax: 0,
                Remark: remark,
                MainTaskDto: null
            }).then(res => {
                message.info('保存成功！')
                this.closeDialog()
            });
        }


    }
    onTabClick(arg) {
        this.setState({ activeKey: arg });
    }
    onContractChange=()=>{
        const selectedkeys = this.tasklist.state.selectedRowKeys;
        const selectedItems = _.filter(this.state.taskList, (item) => {
            return selectedkeys.indexOf(item.Id) > -1
        });
        const hasOutWork = !!_.find(selectedItems,{MainItemName:'外勤服务费'});
        this.setState({ hasOutWork: hasOutWork});
    }
    render() {
        return (
            <div style={this.props.style} className="company-dialog">
                <Button type="primary" style={{ float: 'right' }} onClick={this.setEditing}>{this.state.isEditing ? '保存' : '编辑'}</Button>
                {this.state.customerInfo ? (this.state.isEditing ? <EditCustomer data={this.state.customerInfo} wrappedComponentRef={view => { this.editform = view; }} /> : <ViewCustomer data={this.state.customerInfo} />) : <Spin />}
                <div>
                    <Tabs type="card" style={{ width: '100%' }} activeKey={this.state.activeKey} onTabClick={this.onTabClick}>
                        <TabPane tab="待分配" key="1">
                            <TaskList data={this.state.taskList} ref={e=>{this.tasklist = e}} onChange={this.onContractChange}/>
                            <div>备注信息</div>
                            <TextArea row={4} value={this.state.Remark} onChange={e=>{this.setState({Remark:e.target.value})}}></TextArea>
                        </TabPane>
                        <TabPane tab="订单汇总" key="2">
                            <OrderAll companyId={this.props.row.Id} />
                        </TabPane>
                    </Tabs>
                </div>
                <div className="Button-bar-center">
                    <Button type="primary" onClick={e => { this.SaveToOutWork()}}>提交外勤</Button>
                    <Button type="primary" disabled={this.state.hasOutWork} onClick={e => { this.SaveToAccount() }}>提交会计</Button>
                </div>
            </div>
        )
    }
}

export default Main
