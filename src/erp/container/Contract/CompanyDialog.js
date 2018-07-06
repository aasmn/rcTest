import React from 'react'
import { Tabs, List, Spin, message, Button, Alert, DatePicker } from 'antd'
import { getListData, postData, putData } from '@/erp/api'
import CompanyInfo from '@/erp/container/Contract/CompanyInfo'
import ViewCustomer from '@/erp/container/Contract/ViewCustomer'
import EditCustomer from '@/erp/container/Contract/EditCustomer'
import _ from 'lodash'
import moment from 'moment'
import * as ContractActions from '@/erp/config/contractActions'
import Dialog from '@/erp/container/Dialog'
import ChangeWarning from '@/erp/container/Contract/ChangeWarning'
import OrderAll from '@/erp/container/Contract2/OrderAll'
import OutWork from '@/erp/container/Contract/OutWork'
import RemarkList from '@/erp/container/Contract/RemarkList'
import OperateList from '@/erp/container/Contract/OperateList'
import ContractChangeDailog from '@/erp/container/Contract/ContractChangeDailog'
import AgentServiceList from '@/erp/container/Contract2/AgentServiceList' 
import Confirm from '@/erp/component/Confirm'
import HasPower from '@/erp/container/HasPower'

const TabPane = Tabs.TabPane;

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      companyInfo: {},
      activeKey: "1"
    }

    this.onAction = this.onAction.bind(this);
    this.getCompanyInfo = this.getCompanyInfo.bind(this);
    this.onTabClick = this.onTabClick.bind(this);
    this.patch = this.patch.bind(this)
    this.changeAddedValue = this.changeAddedValue.bind(this)
    this.getCompanyInfo()
  }
  getCompanyInfo(){
    getListData('customerdetail/'+ this.props.companyId).then(res=>{
      res.data = _.extend(res.data, this.props.row);
      this.setState({
        companyInfo: res.data,
        orgData: _.cloneDeep(res.data)
      })
    })
  }
  editCompany(data){
    if(data.isEditing){
      const vals = this.editform.getFieldsValue();
      if(!vals) return;
      const syncDate = vals.syncDate || '';
      delete vals.isEditing;
      delete vals.syncDate;
      if (vals.RegNO) {
        const orgData = this.state.orgData;
        if (orgData.RegNO && vals.RegNO != orgData.RegNO) {
          Confirm({
            okText: '确认保存',
            handleOk: () => {
              putData(`Customer/update/@/erp{vals.Id}?syncDate=@/erp{syncDate}&isOrder=1`, vals).then(res => {
                if (res.status) {
                  message.info('保存成功!');
                  if (this.props.refreshTable) this.props.refreshTable();
                  this.setState({
                    companyInfo: { ...vals, isEditing: false }
                  });
                }
              });
            },
            message: '客户已经做账，如更改统一信用代码，请先与会计核对做账凭证是否正确'
          });
          return;
        }
      }
      putData(`Customer/update/@/erp{vals.Id}?syncDate=@/erp{syncDate}&isOrder=1`,vals).then(res=>{
        if(res.status){
          message.info('保存成功!');
          if(this.props.refreshTable) this.props.refreshTable();
          this.setState({
            companyInfo: {...vals, isEditing: false}
          });
        }
      });
    }else{
      let syncDate;
      let dialog = Dialog({
        content: <div><label>选择变更时间：</label><DatePicker placeholder='选择变更时间' onChange={v => { syncDate = v }} /><Alert style={{ margin: '12px 0' }} description="请根据实际业务作出慎重选择！" type="warning" showIcon /></div>,
        handleOk() {
          if (!syncDate) {
            message.error('请选择变更时间！');
            return false;
          }
          return true;
        },
        width: 540,
        confirmLoading: false,
        title: "选择变更时间"
      });
      dialog.result.then(res => {
        this.setState((prevState, props) => ({
          companyInfo: { ...prevState.companyInfo, isEditing: true, syncDate: moment(syncDate).format('YYYY-MM-DD') }
        }));
      });
    }
  }
  onAction(action,params){
    if(action in ContractActions){
      ContractActions[action](params).then(()=>{
        this.patch(action,params);
      });
    }else{
      this[action](params);
    }
  }
  patch(action,params){
    if(action === "mark"){
      if(params.RemarkSignId){ //取消标记，修改RemarkSignId => 0
         this.setState((prevState, props) => ({
          companyInfo: {...prevState.companyInfo, RemarkSignId: 0}
         }));
      }else{ //打标记，修改RemarkSignId => 1(暂存为1)
        this.setState((prevState, props) => ({
          companyInfo: {...prevState.companyInfo, RemarkSignId: 1}
        }));
      }
    }else if(action === "hangUp"){ //挂起
        this.setState((prevState, props) => ({
          companyInfo: {...prevState.companyInfo, AgentStatus: 2, IfCancelHangup: 0}
        }));
    }
  }
  changeAddedValue(){
    getListData('order/ChangeTaxpayer/' + this.state.companyInfo.Id).then(res=>{
      if(res.status){
        res.data.OrderSalesId = res.data.SalesId;
        res.data.OrderSalesName = res.data.SalesName;
        let dialog = Dialog({
          content: <ContractChangeDailog data={res.data} onClose={(p)=>{dialog.close(p)}}/>,
          width: 1100,
          confirmLoading: false,
          handleCancel() {
            console.log('onCancel')
          },
          title: "选择变更类别",
          footer: null
        });
        dialog.result.then(res => {
          this.props.onDialogClose()
        });
      }else{
        // message.error(res.message)
      }
      
    },error=>{
      
    })
  }
  onTabClick(arg){
    this.setState({activeKey:arg});
  }
  render() {
    return (
      <div style={this.props.style} className="company-dialog">
        <CompanyInfo data={this.state.companyInfo} type="signed"/>
        <div style={{position:'relative'}}>
          <div style={{position: 'absolute',right: '0',top: '9px',color: 'red'}}>温馨提示：编辑时，如查询和网址按键都无法查询出结果，请使用特殊公司入口添加</div>
          <Tabs type="card" style={{width: '100%'}} activeKey={this.state.activeKey} onTabClick={this.onTabClick}>
            <TabPane tab="公司信息" key="1">
              <Button.Group style={{ float: 'right'}}>
                <HasPower power="BGQYXX" key={"btn_BGQYXX"}><Button type="primary" onClick={e => { this.editCompany(this.state.companyInfo) }}>{this.state.companyInfo.isEditing ? '保存' : '变更信息'}</Button></HasPower>
              </Button.Group>
              { this.state.companyInfo?(this.state.companyInfo.isEditing? <EditCustomer data={this.state.companyInfo} wrappedComponentRef={view=>{this.editform = view;}}/>:<ViewCustomer data={this.state.companyInfo}/>):<Spin/> }
            </TabPane>
            <TabPane tab="订单汇总" key="2">
              <OrderAll companyId={this.props.companyId}/>
            </TabPane>
            <TabPane tab="外勤任务" key="3">
              <OutWork companyId={this.props.companyId}/>
            </TabPane>
            <TabPane tab="记账服务" key="6">
              <AgentServiceList companyId={this.props.companyId} />
            </TabPane>
            {/* <TabPane tab="备注信息" key="4">
              <RemarkList companyId={this.props.companyId}/>
            </TabPane> */}
            <TabPane tab="操作记录" key="5">
              <OperateList companyId={this.props.companyId}/>
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default Main
