import React from 'react'
import { Icon, Alert, Popover, message, DatePicker } from 'antd'
import { fDate, fTaxStatus } from '@/erp/config/filters'
import Dialog from '@/erp/container/Dialog'
import HasPower from '@/erp/container/HasPower'
import moment from 'moment'
class Main extends React.Component {
  constructor(props) {
    super(props);
    this.onSelect = this.onSelect.bind(this);
  }
  onSelect(arg){
    if(arg){
      let syncDate;
      let dialog = Dialog({
        content: <div><label>选择变更时间：</label><DatePicker placeholder='选择变更时间' onChange={v=>{syncDate=v}} /><Alert style={{margin:'12px 0'}} description="请根据实际业务作出慎重选择！" type="warning" showIcon/></div>,
        handleOk(){
          if(!syncDate){
            message.error('请选择变更时间！');
            return false;
          }
          return true;
        },
        width: 540,
        confirmLoading: false,
        title: "选择变更时间"
      });
      dialog.result.then(res=>{
        this.props.onSelect({syncDate: moment(syncDate).format('YYYY-MM-DD')});
      });
    }else{
      this.props.onSelect({syncDate:null});
    }
  }
  render() {
    const warning1 = "企业错误信息变更是由于录入数据错误导致的信息修改，此处修改agent不需要记录公司更新的历史信息，更改时请慎重选择!";
    const warning2 = "企业信息变更是指公司更名，法人变更或者营业执照变更，agent需要记录此次变更，更改时请慎重选择！";
    return (
      <div>
        <Alert
          description="请根据实际业务作出慎重选择！"
          type="error"
        />
        <h2 style={{textAlign:'center',cursor:'pointer',margin:"6px 0",background:'#aae2f6',padding:'12px'}} onClick={e=>{this.onSelect(0)}}>
          企业错误信息变更 
          <Popover placement="top" content={warning1}>
            <Icon type="question-circle" style={{color:"#cda056",float:'right'}} />
          </Popover>
        </h2>
        <h2 style={{textAlign:'center',cursor:'pointer',margin:"6px 0",background:'#aae2f6',padding:'12px'}} onClick={e=>{this.onSelect(1)}}>
          企业信息变更 
          <Popover placement="top" content={warning2}>
            <Icon type="question-circle" style={{color:"#cda056",float:'right'}} />
          </Popover>
        </h2>
      </div>
    );
  }
}

export default Main
