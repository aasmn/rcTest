import React, { Component } from 'react'
import { Table, Icon, Button, Tooltip, message } from 'antd'
import RIf from '@/erp/component/RIF'
import HasPower from '@/erp/container/HasPower'
import _ from 'lodash'
import { getListData, postData, putData } from '@/erp/api'
import { fDate, fSubTaskStatus } from '@/erp/config/filters'
import OutworkerSelect from '@/erp/container/searchComponent/OutworkerSelect'
import EditCustomer from '@/erp/container/Outworker/EditCustomer'
import Dialog from '@/erp/container/Dialog'
import Confirm from '@/erp/component/Confirm'
import store from '@/erp/store'
import { powerList } from '@/erp/config/filters'
import PartSelectDialog from '@/erp/container/Contract/PartSelectDialog';

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
class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      selected: [],
      loading: true,
      toall: ' '
    };
    this.onToOtherAll = this.onToOtherAll.bind(this);
    this.onToOther = this.onToOther.bind(this);
    this.toOther = this.toOther.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.changeStatus = this.changeStatus.bind(this);
    this.edit = this.edit.bind(this);

    this.hasPower= powerList(store.getState().common.functions);

    this.onSearch();
  }
  edit(row){
    Dialog({
        content: <EditCustomer customerId={row.CustomerId} ref={crmform =>{this.crmform = crmform}}/>,
        width: 1100,
        handleOk: ()=>{
            return new Promise((resolve, reject) => {
              const data = this.crmform.getFieldsValue();
              if(!data) return;
              putData(`Customer/update/@/erp{data.Id}?verify=1&syncDate=`, data).then(res=>{
                if(res.status){
                  message.info("保存成功！");
                  resolve()
                }else{
                  reject()
                }
              },()=>reject())
            });
        },
        confirmLoading: false,
        handleCancel (){
            console.log('onCancel')
        },
        title: "编辑"
    }).result.then(()=>{
        this.onSearch(this.state.searchParams)
        if(this.props.refreshTable) this.props.refreshTable();
    },()=>{});
  }
  onToOther(row){
    let saler;
    Dialog({
        content: <div><span>选择外勤:&nbsp;&nbsp;</span><OutworkerSelect onlyEnable={true} hideAll={true} onChange={v=>{saler=v}}/></div>,
        width: 540,
        handleOk: ()=>{
            if(!saler){
              message.error('请选择外勤！');
              return false;
            }
            return new Promise((resolve, reject) => {
                this.toOther(row.Id,saler).then(res=>{
                    if(res.status){
                        message.info('转接成功！')
                        // this.onSearch()
                        resolve()
                    }
                })
            });
        },
        confirmLoading: false,
        handleCancel (){
            console.log('onCancel')
        },
        title: "任务转接-"+ row.TaskName
    }).result.then(()=>{
        this.onSearch(this.state.searchParams)
        if (this.props.refreshTable) this.props.refreshTable();
    },()=>{});
  }
  onToOtherAll(wid){
    this.toOther(this.state.selected.join(','), wid).then(res=>{
      if(res.status){
        message.info('分配成功！')
        this.onSearch()
        if (this.props.refreshTable) this.props.refreshTable();
      }
    });
  }
  toOther(ids,wid){
    return putData(`childtask/trans?ids=@/erp{ids}&outworkerId=@/erp{wid}`);
  }
  changeStatus(id,status,msg){
    Confirm({
      message: `确认要@/erp{msg}?`
    }).result.then(()=>{
      putData(`childtask/@/erp{id}/@/erp{status}`).then(res=>{
        if(res.status){
          message.info('操作成功！')
          this.onSearch()
          if (this.props.refreshTable) this.props.refreshTable();
        }
      });
    });
  }
  onSearch(){
    getListData('maintask/'+ this.props.item.Id).then(res=>{
      if(res.status){
        this.setState({data: res.data,loading: false})
      }
    })
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
        const data = this.props.item;
        const partTax = select.select1== 1? select.select2: 0;
        putData(`maintask/audit/submit/@/erp{data.TaskBillId}/?partTax=@/erp{partTax}&serviceStatus=@/erp{data.ServiceStatus}`).then(res=>{
          if(res.status){
            message.info('操作成功！')
            this.handler.close()
          }
        })

      },()=>{});
  }
  render() {
    const columns = [{
            title: '序列ID',
            dataIndex: 'Id'
        },{
            title: '子任务名称',
            dataIndex: 'TaskName'
        },{
            title: '当前外勤人员',
            dataIndex: 'OutWorkerName'
        },{
            title: '开始时间',
            dataIndex: 'StartTime',
            render: val=> fDate(val)
        },{
            title: '完成时间',
            dataIndex: 'EndTime',
            render: val=> fDate(val)
        },{
            title: '状态',
            dataIndex: 'Status',
            render: val=> fSubTaskStatus(val)
        },{
            title: '操作',
            width: 305,
            render: (text, record) => {
              // if(this.props.item.AccountantStatus == 2){
              //   return '';
              // }
              return (
                <RIf if={this.hasPower("FENPEIALL") || this.props.curUser.Id == record.OutWorkerId}>
                  <Button.Group>
                      <HasPower power="DETAIL"  key={"btn_DETAIL"} ><Button size="small" onClick={e=>{this.edit(record)}} disabled={record.Status >3}>编辑</Button></HasPower>
                      <HasPower power="ENSURE"  key={"btn_ENSURE"} ><Button size="small" onClick={e=>{this.changeStatus(record.Id,3,'确认资料')}} disabled={record.Status!==2}>确认资料</Button></HasPower>
                      <HasPower power="COMPLETE"  key={"btn_COMPLETE"} ><Button size="small" onClick={e=>{this.changeStatus(record.Id,5,'完成任务')}} disabled={record.Status!==3}>完成</Button></HasPower>
                      <HasPower power="TOOTHER"  key={"btn_TOOTHER"} ><Button size="small" onClick={e=>{this.onToOther(record)}} disabled={record.Status>3 || !((this.props.item.OutWorkerStatus && this.props.item.OutWorkerStatus == 2) || !this.props.item.OutWorkerStatus)}>转接任务</Button></HasPower>
                      <HasPower power="CANCELSUB"  key={"btn_CANCELSUB"} ><Button size="small" onClick={e=>{this.changeStatus(record.Id,4,'取消任务')}} disabled={record.Status>3}>取消</Button></HasPower>
                  </Button.Group>
                </RIf>
            )}
        }];
    let rowSelection;
    if(this.hasPower("FENPEIALL")){
      rowSelection = {
        getCheckboxProps: record => {
          return {
            disabled : record.Status>3
          }
        },
        onChange: vals =>{
          this.setState({selected: vals})
        }
      }
    }else{
      rowSelection = null;
    }
    return (
      <div className={'SubTaskDetail'}>
        <div style={{textAlign:'right',padding: '12px'}}>
          <RIf if={this.props.item.Remark}>
            <Tooltip placement="top" title={this.props.item.Remark}>
              <Icon type="warning" style={{color: "red", fontSize: "20px"}} />
            </Tooltip>
          </RIf>
          <RIf if={(!this.props.curUser.IsChannel) && (this.props.item.OutWorkerStatus === 2 || this.props.item.OutWorkerStatus === 6)}> 
            <HasPower power="SUBMIT" >
              <Button type="primary" disabled={canSubmit(this.props.item)} onClick={e=>{this.submit(this.props.item)}} style={{margin:'0 8px'}}>提交会计</Button>
            </HasPower>
          </RIf>
        </div>
        <Table columns={columns}
          rowKey={record => record.Id}
          dataSource={this.state.data}
          loading={this.state.loading}
          pagination={false}
          onChange={this.handleTableChange}
          size="middle"
          rowSelection = {rowSelection}
          bordered={true}
        />
        {(this.props.item.OutWorkerStatus && this.props.item.OutWorkerStatus == 2) || !this.props.item.OutWorkerStatus ? <HasPower power="FENPEIALL" >
          <div style={{padding: '12px'}}><span>批量分配</span> <OutworkerSelect onlyEnable={true} value={this.state.toall} hideAll={true} onChange={this.onToOtherAll} disabled={this.state.selected.length === 0}/></div>
        </HasPower>: null}
      </div>
    );
  }
}


export default Main
