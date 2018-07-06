import React, { Component } from 'react'
import { Tabs, List, Spin, message, Button, Input, DatePicker } from 'antd'
import { getListData, putData, postData } from '@/erp/api'
import ViewCustomer from '@/erp/container/Contract/ViewCustomer'
import EditCustomer from '@/erp/container/Contract/EditCustomer'
import TaskList from '@/erp/component/TaskList'
import OrderAll from '@/erp/container/Contract/OrderAll'
import _ from 'lodash'
import Dialog from '@/erp/container/Dialog'
import OutworkerTask from '@/erp/container/Outworker/Task'
import TaskListWeight from '@/erp/container/Outworker/TaskListWeight';
import { fTaxStatus } from '@/erp/config/filters'
import SubmitToAccount from '@/erp/component/SubmitToAccount'
import PartSelectDialog from '@/erp/container/Contract/PartSelectDialog';

const TabPane = Tabs.TabPane;
const TextArea = Input.TextArea

class CompanyInfo extends Component {
    constructor(props) {
        super(props);
        this.state={
            data: null
        };
        this.getCompanyInfo(props.id)
    }
    getCompanyInfo  = (id)=>{
        getListData('customerdetail/' + this.props.id).then(res => {
            this.setState({
                data: res.data
            })
        });
    }
    render(){
        if(!this.state.data) return <Spin/>
        return <ViewCustomer data={this.state.data} />
    }
}


class Main extends Component {
    constructor(props) {
        super(props);
        let editable = 0;
        if (!props.readOnly){
            if (props.row.AssigningObject == 1 && props.row.OutWorkerStatus == 3){
                editable = 1
            }
            if (props.row.AssigningObject == 2 && props.row.AccountantStatus == 3){
                editable = 1
            }
            if (props.row.AssigningObject == 3 && (props.row.OutWorkerStatus == 3 || props.row.AccountantStatus == 3)) {
                if (props.row.OutWorkerStatus == 3 && props.row.AccountantStatus == 3){//全部可修改
                    editable = 1
                } else if (props.row.OutWorkerStatus == 3){ //外勤可更改
                    editable = 2
                } else{ //会计可更改
                    editable = 3;
                }
                
            }   
        }

        this.state = {
            data: null,
            activeKey: "1",
            hasOutWork: false,
            editable: editable
        }
        this.getBaseInfo = this.getBaseInfo.bind(this);
        this.onTabClick = this.onTabClick.bind(this);
        this.getBaseInfo();
        this.closeDialog = this.closeDialog.bind(this);
    }
    closeDialog() {
        this.props.close();
    }
    getBaseInfo() {
        const row = this.props.row;
        getListData('TaskDetail?taskNoId=' + this.props.row.TaskBillId).then(res => {
            res.data = _.extend(res.data, row);
            const hasOutWork = !!_.find(res.data.OrderItem, { MainItemName: '外勤服务费' });
            const jz = _.find(res.data.OrderItem, { MainItemName: '记账报税' });
            const hasJz = !!jz;
            res.data.Customers.Id = res.data.Customers.id;
            res.data.CommonTask && (res.data.CommonTask.Customer = res.data.Customers);
            const PartTax = hasJz? jz.PartTax : 0;
            
            this.setState({
                TaskBillId: res.data.TaskBillId,
                taskList: res.data.OrderItem,
                customerInfo: res.data.Customers,
                outworkData: res.data.CommonTask,
                Remark: res.data.Remark,
                hasOutWork: hasOutWork,
                AssigningObject: res.data.AssigningObject,
                MaxServiceEnd: res.data.MaxServiceEnd,
                hasJz: hasJz,
                PartTax: PartTax
            })
        });
    }
    onSave = () => {
        const selectedkeys = this.tasklist.state.selectedRowKeys;
        const selectedItems = _.filter(this.state.taskList, (item) => {
            return selectedkeys && selectedkeys.indexOf(item.Id) > -1
        });
        if (selectedItems.length === 0) {
            message.error('请选择合同！');
            return;
        }
        const contractIds = this.tasklist.state.selectedRowKeys;
        const remark = this.state.Remark;
        const that = this;
        let formdata = null;
        let partTax = 0;
        let postUrl = 'task-bill/outworker-submit';
        // if (that.state.AssigningObject !== 1 && that.partview) {
        //     partTax = that.partview.state.select1 == 1 ? that.partview.state.select2 : 0;
        //     postUrl = 'task-bill/accounting-submit';
        // }
        if (that.state.AssigningObject == 1){
            formdata = this.crmform && this.crmform.getFieldsValue();
        }else{
            postUrl = 'task-bill/accounting-submit';
            if (this.accform){
                formdata = this.accform && this.accform.getOutWorkData();
                const select = that.accform.state.partTax;
                partTax = select.select1 == 1 ? select.select2 : 0;
                if (partTax == 0) formdata = null;
            }
            
        }

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
                }, ()=>{

                });
            } else {
                saveData();
            }
        } else {
            saveData();
        }
        function saveData(){
            if (formdata){
                _.each(formdata.ChildTasks, item => {
                    item.CustomerId = that.state.customerInfo.Id
                });
            }
            
            const outworkerData = formdata?{
                ...formdata,
                AreaCode: formdata.AreaCode,
                MainTaskName: formdata.MainTaskName,
                CustomerId: that.state.customerInfo.Id
            }: null;

            putData(postUrl, {
                AssigningObject: that.state.AssigningObject,
                TaskBillId: that.state.TaskBillId,
                ContractIds: contractIds,
                Remark: remark,
                PartTax: partTax,
                MainTaskDto: outworkerData
            }).then(res => {
                if (res.status) {
                    message.info('保存成功！');
                    that.closeDialog()
                } 
            });
        }

    }
    onTabClick(arg) {
        this.setState({ activeKey: arg });
    }
    onContractChange = () => {
        const selectedkeys = this.tasklist.state.selectedRowKeys;
        const selectedItems = _.filter(this.state.taskList, (item) => {
            return selectedkeys.indexOf(item.Id) > -1
        });
        const hasOutWork = !!_.find(selectedItems, { MainItemName: '外勤服务费' });
        const hasJz = !!_.find(selectedItems, { MainItemName: '记账报税' });
        this.setState({ hasOutWork: hasOutWork, hasJz: hasJz });
    }
    
    render() {
        if (!this.state.taskList) return <Spin/>;
        return (
            <div style={{padding: '12px'}} className="company-dialog">
                <div className="row-span">
                    <span>序列ID：{this.state.customerInfo.SequenceNo}</span>
                    <span>公司名称：{this.state.customerInfo.CompanyName}</span>
                    <span>报税状态：{fTaxStatus(this.state.customerInfo.AgentStatus)}</span>
                    <span>服务期止：{this.state.MaxServiceEnd}</span>
                </div>
                <div>
                    <Tabs type="card" style={{ width: '100%' }} activeKey={this.state.activeKey} onTabClick={this.onTabClick}>
                        <TabPane tab="任务单" key="1"  >
                            <TaskList data={this.state.taskList} readOnly={this.state.editable!==1} selectAll={true} showStatus={true} ref={e => { this.tasklist = e }} onChange={this.onContractChange}  endable={this.props.row.AccountantStatus == 2}/>
                            <div className={this.state.editable ? '' : 'disabled-mask'} style={{ opacity: 1 }}>
                                <div>备注信息</div>
                                <TextArea row={4} readOnly={!this.state.editable} value={this.state.Remark} onChange={e => { this.setState({ Remark: e.target.value }) }}></TextArea>
                                <div className="Button-bar-center disabled-mask">
                                    <Button type="primary" disabled={this.state.AssigningObject !== 1} style={{ color: "#000" }}>提交外勤</Button>
                                    <Button type="primary" disabled={this.state.AssigningObject === 1} style={{ color: "#000" }}>提交会计</Button>
                                </div>
                            </div> 
                            <div className={this.state.editable ? '' : 'disabled-mask'} style={{ opacity: 1 }}>
                                {this.state.AssigningObject > 1 && this.state.hasJz && <SubmitToAccount partTax={this.state.PartTax} editable={this.state.editable} outworkData={this.state.outworkData} popView={v => { this.accform=v;}} />}
                            </div>
                            <div className={this.state.editable ? '' : 'disabled-mask'} style={{ opacity: 1 }}>
                                {this.state.AssigningObject === 1 && <OutworkerTask onlySelected={!this.state.editable} wrappedComponentRef={crmform => { this.crmform = crmform }} data={this.state.outworkData || {}} hideCompany={true} isOnlyFree={!this.state.hasOutWork} />}
                            </div>

                            {this.state.editable>0 && <div className="Button-bar-center">
                                <Button type="primary" onClick={this.onSave}>保存</Button>
                            </div>}  
                            
                        </TabPane>
                        <TabPane tab="公司信息" key="2">
                            <CompanyInfo id={this.state.customerInfo.Id} />
                        </TabPane>
                        <TabPane tab="订单汇总" key="3">
                            <OrderAll companyId={this.state.customerInfo.Id} />
                        </TabPane>
                    </Tabs>
                </div>
                
            </div>
        )
    }
}

export default Main
