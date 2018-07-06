import React, { Component } from 'react'
import _ from 'lodash'
import SearchForm from '@/erp/container/SearchForm'
import SalerSelect from '@/erp/container/searchComponent/SalerSelect'
import TaskSelect from '@/erp/container/searchComponent/TaskSelect'
import SubtaskSelect from '@/erp/container/searchComponent/SubtaskSelect'
import ServiceStatusSelect from '@/erp/container/searchComponent/ServiceStatusSelect'
import MainTaskStatusSelect from '@/erp/container/searchComponent/MainTaskStatusSelect'
import OutworkerSelect from '@/erp/container/searchComponent/OutworkerSelect'
import AreaSelect from '@/erp/container/searchComponent/AreaSelect'
// import ImportData from '@/erp/container/searchComponent/ImportData'
import OutworkerTask from '@/erp/container/Outworker/Task'
import SubTaskDetail from '@/erp/container/Outworker/SubTaskDetail'
import TaskListWeight from '@/erp/container/Outworker/TaskListWeight';

import RIf from '@/erp/component/RIF'
import { getListData, postData, putData } from '@/erp/api'
import { Table, Button, message, Input} from 'antd'
import Dialog from '@/erp/container/Dialog'
import { fDate, fServiceStatus, fCheckStatus, fPartTax, fMainTaskStatus, fSubTaskStatus } from '@/erp/config/filters'
import HasPower from '@/erp/container/HasPower'
import Confirm from '@/erp/component/Confirm'
import store from '@/erp/store'
import PartSelectDialog from '@/erp/container/Contract/PartSelectDialog';


let search = {
    items: [{
        label: '序列ID',
        type: 'text',
        field: 'sequenceNo'
    },{
        label: '公司名称',
        type: 'text',
        field: 'companyname'
    }, {
        label: '任务名称',
        type: 'custom',
        field: 'taskname',
        view: TaskSelect,
            defaultValue: '',
            more: true
    }, {
        label: '当前子任务',
        type: 'custom',
        field: 'childtaskname',
        view: SubtaskSelect,
            defaultValue: '',
            more: true
    }, {
        label: '外勤人员',
        type: 'custom',
        field: 'outworkId',
        view: OutworkerSelect,
            defaultValue: '0',
            more: true
    }, {
        label: '服务状态',
        type: 'custom',
        field: 'servicestatus',
        view: ServiceStatusSelect,
            defaultValue: '',
            more: true
    }, {
        label: '任务提交日期',
        type: 'date',
            field: 'starttime',
            more: true
    }, {
        label: '至',
        type: 'date',
            field: 'endtime',
            more: true
    }, {
        label: '所属区（县）',
        type: 'custom',
        field: 'areacode',
        view: AreaSelect,
            defaultValue: '',
            more: true
    }, {
        label: '销售人员',
        type: 'custom',
        field: 'salesId',
        view: SalerSelect,
            defaultValue: '0',
            more: true
    }, {
        label: '主任务状态',
        type: 'custom',
        field: 'taskstatus',
        view: MainTaskStatusSelect,
            defaultValue: '',
            more: true
    },{
      label: '会计审核状态',
      type: 'select',
      field: 'accountantstatus',
      data: {
          1: "待审核",
          2: "已审核",
          3: "已驳回",
          5: "部分确认",
          '-1': "其他"
      },
      defaultValue: 0,
      more: true,
      tab: '2'
  }],
    buttons:[]
};

const canSubmit = item => {
    if (item.hasotherwork == 0) {
        return true;
    }
    if (item.OutWorkerStatus == 2 && !item.AccountantStatus) {
        return false
    }
    if (item.OutWorkerStatus == 2 && item.AccountantStatus == 5) {  // 这种情况的时候只能选择资料齐全提交会计
    return false
    }
    if (item.OutWorkerStatus == 6 && item.AccountantStatus == 5) { // 这种情况的时候只能选择资料齐全提交会计 外勤当月只跑完
    return false
    }
    if (item.AccountantStatus == 3 && item.AccountantTaskSource == '外勤') {
    return false
    }
    return true
}
function onlyAll(item) {
    
    if (item.OutWorkerStatus == 2 && !item.AccountantStatus) {
        return false
    }
    if (item.OutWorkerStatus == 2 && item.AccountantStatus == 5) {
        return true // 这种情况的时候只能选择资料齐全提交会计
    }
    if (item.OutWorkerStatus == 6 && item.AccountantStatus == 5) {
        return true // 这种情况的时候只能选择资料齐全提交会计 外勤当月只跑完
    }
    if (item.AccountantStatus == 3 && item.AccountantTaskSource == '外勤') {
        if (item.ServiceStatus == 3) {
            return false // 外勤二次提交的情况
        }else{
            return true // 外勤二次提交的情况
        }
    }
    return false
}

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            pagination: {
                current: 1,
                pageSize: 15,
                showQuickJumper: true,
                showSizeChanger: true,
                showTotal(total) {
                  return `共计 @/erp{total} 条`;
                }
            },
            searchParams: {},
            loading: false,
        };
        this.onSearch = this.onSearch.bind(this);
        this.handleTableChange = this.handleTableChange.bind(this);
        this.addNew = this.addNew.bind(this);
        this.view = this.view.bind(this);
        this.check = this.check.bind(this);
        this.reject = this.reject.bind(this);
        console.log(this);
    }

    handleTableChange (pagination){
        this.setState({pagination: pagination}, ()=>{this.onSearch(this.state.searchParams)})
    }
    onSearch(params={}) {
        this.setState({searchParams: params, loading: true});
        const pagination =this.state.pagination;
        if (!_.isEqual(params,this.state.searchParams)) {
          pagination.current = 1
        }
        params.limit = pagination.pageSize;
        params.offset = (pagination.current - 1) * pagination.pageSize;
        return getListData('maintask', params).then(res => {
            if(res.status){
                const pagination = { ...this.state.pagination };
                pagination.total = res.data.total;
                this.setState({
                    loading: false,
                    data: res.data.list,
                    pagination,
                });
            }
            return res;
        },err=>{
            this.setState({
                loading: false
            });
        })
    }
    componentWillMount() {
        this.onSearch();
    }
    addNew(){

        Dialog({
            content: <OutworkerTask data={{}}  wrappedComponentRef={crmform =>{this.crmform = crmform}}/>,
            width: 1100,
            handleOk: ()=>{
                return new Promise((resolve, reject) => {
                    const formdata = this.crmform.getFieldsValue();
                    let taskform;
                    if(formdata){
                        if(formdata.CommonTaskId === 0){
                            Dialog({
                                content: <TaskListWeight data={formdata.ChildTasks}  ref={form =>{if(form)taskform = form;}}/>,
                                width: 600,
                                handleOk: ()=>{
                                    if(_.uniqBy(taskform.data,'Weight').length< taskform.data.length){
                                        message.error('权重不允许重复！')
                                        return false;
                                    }
                                    return true;
                                },
                                confirmLoading: false,
                                handleCancel (){
                                },
                                title: "修改权重"
                            }).result.then(()=>{
                                formdata.ChildTasks = taskform.data;
                                saveData();
                            },reject);
                        }else{
                            saveData();
                        }
                    }else{
                        reject();
                    }

                    function saveData(){
                        _.each(formdata.ChildTasks, item => {
                            item.CustomerId = formdata.Customer.Id
                        });
                        postData('maintask', {
                            ...formdata,
                            AreaCode: formdata.AreaCode,
                            MainTaskName: formdata.MainTaskName,
                            CustomerId: formdata.Customer.Id
                        }).then(res=>{
                            if(res.status){
                                resolve()
                            }else{
                               reject();
                            }
                        },reject);
                    }
                });
            },
            confirmLoading: false,
            handleCancel (){
                console.log('onCancel')
            },
            title: "添加任务"
        }).result.then(()=>{
            message.info('操作成功！')
            this.onSearch(this.state.searchParams)
        },()=>{});
    }
    view(row) {
        const dialog = Dialog({
            content: <SubTaskDetail item={row} curUser={this.props.curUser} refreshTable={()=>{this.onSearch(this.state.searchParams)}} ref={e=>{ e && (e.handler = dialog)}}/>,
            width: 1100,
            handleOk: ()=>{
                return true;
            },
            confirmLoading: false,
            handleCancel (){
                console.log('onCancel')
            },
            title: "外勤任务-" + row.CompanyName
        })
        dialog.result.then(()=>{
            this.onSearch(this.state.searchParams)
        },()=>{});
    }
    submit(item){
        let onlyInformationIsAll  = onlyAll(item);

        const dialog = Dialog({
            content: <PartSelectDialog ref={view=>{this.view = view}} onlyAll={onlyInformationIsAll}/>,
            width: 500,
            confirmLoading: false,
            handleOk: ()=>{
              const result = this.view.getValues();
              return result;
            },
            title: '提交会计'
        });
        dialog.result.then((select)=>{
           //@/erphttp.put('/api/order/audit/toaccountant/' + @/erpscope.postData.orderId + '/?partTax=' + @/erpscope.partT ).success(function(res) {
          const data = item;
          const partTax = select.select1== 1? select.select2: 0;
          putData(`maintask/audit/submit/@/erp{data.TaskBillId}/?partTax=@/erp{partTax}&serviceStatus=@/erp{data.ServiceStatus}`).then(res=>{
            if(res.status){
                message.info('操作成功！')
                this.onSearch(this.state.searchParams)
              }
          })

        },()=>{});
    }
    check(row) {
      let PartTax = row.PartTax ? row.PartTax : 0
      Confirm({
        handleOk:()=>{
          putData(`maintask/audit/pass/@/erp{row.TaskBillId}?partTax=@/erp{PartTax}`).then(res => {
            if (res.status) {
              message.info('操作成功！')  
              this.onSearch(this.state.searchParams)
            }
          })
        },
        message: '确认资料齐全？'
      })
    }
    reject(row) {
        let remark;
        Dialog({
            content: (<div><label>驳回原因</label><Input.TextArea onChange={e => { remark = e.target.value }} /></div>),
            handleOk: () => {
                return save(remark||'');
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
            return putData(`maintask/audit/reject/@/erp{row.TaskBillId}`, { remark: remark }).then(res => {
                if (res.status) {
                    message.info('操作成功！')
                    that.onSearch(that.state.searchParams)
                }
            })
        }
    }
    render() {
        var that = this;
        let columns = [{
            title: '序列ID',
            dataIndex: 'SequenceNo',
            className: 'text-right',
            width: 65,
            render: (val,row)=>{
                return [<RIf if={!!row.Remark} key={val+'_1'}><span className="remark-msg"></span></RIf>,<span key={val+'_2'}>{val}</span>]
            }
        },{
            title: '公司名称',
            dataIndex: 'CompanyName'
        }, {
            title: '联系人',
            dataIndex: 'Connector',
        }, {
            title: '所属区域',
            dataIndex: 'AreaName',
        }, {
            title: '销售人员',
            dataIndex: 'SalesName'
        }];
        if(!this.props.curUser.IsChannel){
            columns = columns.concat([{
                title: '服务状态',
                dataIndex: 'ServiceStatus',
                render: val=> fServiceStatus(val)
            }, {
                title: '审核状态',
                dataIndex: 'OutWorkerStatus',
                render: val=> fCheckStatus(val)
            }, {
                title: '会计审核',
                dataIndex: 'AccountantStatus',
                render: val=> fCheckStatus(val)
            }, {
                title: '部分报税',
                dataIndex: 'PartTax',
                render: val=> fPartTax(val)
            }])
        }


        columns = columns.concat([{
            title: '任务名称',
            dataIndex: 'MainTaskName',
        }, {
            title: '总任务状态',
            dataIndex: 'MainTaskStatus',
            render: val=> fMainTaskStatus(val)
        }, {
            title: '当前子任务',
            dataIndex: 'childTaskName'
        }, {
            title: '子任务状态',
            dataIndex: 'Status',
            render: val=> fSubTaskStatus(val)
        }, {
            title: '当前外勤人员',
            dataIndex: 'OutWorkerName'
        }, {
            title: '提交任务时间',
            dataIndex: 'SubmitTaskTime',
            render: val=> fDate(val)
        }, {
            title: '操作',
            width: 210,
            render: (text, record) => (
                <Button.Group >
                    <Button size="small" onClick={e => { that.view(record)}} >查看</Button>
                    {(!this.props.curUser.IsChannel) && <HasPower power="REVIEW"  key={"btn_REVIEW"} ><Button size="small" onClick={e=>{this.check(record)}} disabled={record.OutWorkerStatus != 1|| record.ServiceStatus==8}>审核</Button></HasPower>}
                    {(!this.props.curUser.IsChannel) && <HasPower power="REJECT"  key={"btn_REJECT"} ><Button size="small" onClick={e=>{this.reject(record)}} disabled={record.OutWorkerStatus != 1|| record.ServiceStatus==8}>驳回</Button></HasPower>}
                    {(!this.props.curUser.IsChannel) && <HasPower power="SUBMIT"  key={"btn_SUBMIT"} ><Button size="small" onClick={e=>{this.submit(record)}} disabled={canSubmit(record)}>提交</Button></HasPower>}
                </Button.Group>
            ),
        }]);

        search.buttons=[]
        return (
            <div>
                <SearchForm items={search.items} buttons={search.buttons} onSearch={this.onSearch}/>
                <Table columns={columns}
                    rowKey={record => record.OrderItemId}
                    dataSource={this.state.data}
                    pagination={this.state.pagination}
                    loading={this.state.loading}
                    onChange={this.handleTableChange}
                    size="middle"
                    bordered={true}
                />
            </div>
        );
    }
}

export default Main
