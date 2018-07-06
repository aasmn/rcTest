import React, { Component } from 'react'
import Test from '@/erp/container/Contract/OrderDialog'
import { setPowerList } from '@/erp/store/actions'
import { connect } from 'react-redux'
class Main extends Component {
    // constructor(props) {
    //   super(props);
    //   // this.functions = [{"Children":[],"FunctionId":83,"Id":83,"ParentId":18,"FunctionName":"新增","FunctionKey":"ADD","FunctionLevel":3,"FunctionCenter":0,"Rank":2,"Icon":"","Status":1,"Descr":"","CreateBy":0,"CreateDate":"0001-01-01T00:00:00","ModifyBy":0,"ModifyDate":"0001-01-01T00:00:00","TreeIds":null},{"Children":[],"FunctionId":84,"Id":84,"ParentId":18,"FunctionName":"审核","FunctionKey":"REVIEW","FunctionLevel":3,"FunctionCenter":0,"Rank":3,"Icon":"","Status":1,"Descr":"","CreateBy":0,"CreateDate":"0001-01-01T00:00:00","ModifyBy":0,"ModifyDate":"0001-01-01T00:00:00","TreeIds":null},{"Children":[],"FunctionId":85,"Id":85,"ParentId":18,"FunctionName":"驳回","FunctionKey":"REJECT","FunctionLevel":3,"FunctionCenter":0,"Rank":4,"Icon":"","Status":1,"Descr":"","CreateBy":0,"CreateDate":"0001-01-01T00:00:00","ModifyBy":0,"ModifyDate":"0001-01-01T00:00:00","TreeIds":null},{"Children":[],"FunctionId":86,"Id":86,"ParentId":18,"FunctionName":"主任务取消","FunctionKey":"CANCELMAIN","FunctionLevel":3,"FunctionCenter":0,"Rank":5,"Icon":"","Status":1,"Descr":"","CreateBy":0,"CreateDate":"0001-01-01T00:00:00","ModifyBy":0,"ModifyDate":"0001-01-01T00:00:00","TreeIds":null},{"Children":[],"FunctionId":87,"Id":87,"ParentId":18,"FunctionName":"提交","FunctionKey":"SUBMIT","FunctionLevel":3,"FunctionCenter":0,"Rank":6,"Icon":"","Status":1,"Descr":"","CreateBy":0,"CreateDate":"0001-01-01T00:00:00","ModifyBy":0,"ModifyDate":"0001-01-01T00:00:00","TreeIds":null},{"Children":[],"FunctionId":88,"Id":88,"ParentId":18,"FunctionName":"任务批量分配","FunctionKey":"FENPEIALL","FunctionLevel":3,"FunctionCenter":0,"Rank":7,"Icon":"","Status":1,"Descr":"","CreateBy":0,"CreateDate":"0001-01-01T00:00:00","ModifyBy":0,"ModifyDate":"0001-01-01T00:00:00","TreeIds":null},{"Children":[],"FunctionId":89,"Id":89,"ParentId":18,"FunctionName":"编辑","FunctionKey":"DETAIL","FunctionLevel":3,"FunctionCenter":0,"Rank":8,"Icon":"","Status":1,"Descr":"","CreateBy":0,"CreateDate":"0001-01-01T00:00:00","ModifyBy":0,"ModifyDate":"0001-01-01T00:00:00","TreeIds":null},{"Children":[],"FunctionId":90,"Id":90,"ParentId":18,"FunctionName":"确认资料","FunctionKey":"ENSURE","FunctionLevel":3,"FunctionCenter":0,"Rank":9,"Icon":"","Status":1,"Descr":"","CreateBy":0,"CreateDate":"0001-01-01T00:00:00","ModifyBy":0,"ModifyDate":"0001-01-01T00:00:00","TreeIds":null},{"Children":[],"FunctionId":91,"Id":91,"ParentId":18,"FunctionName":"完成","FunctionKey":"COMPLETE","FunctionLevel":3,"FunctionCenter":0,"Rank":10,"Icon":"","Status":1,"Descr":"","CreateBy":0,"CreateDate":"0001-01-01T00:00:00","ModifyBy":0,"ModifyDate":"0001-01-01T00:00:00","TreeIds":null},{"Children":[],"FunctionId":92,"Id":92,"ParentId":18,"FunctionName":"转接任务","FunctionKey":"TOOTHER","FunctionLevel":3,"FunctionCenter":0,"Rank":11,"Icon":"","Status":1,"Descr":"","CreateBy":0,"CreateDate":"0001-01-01T00:00:00","ModifyBy":0,"ModifyDate":"0001-01-01T00:00:00","TreeIds":null},{"Children":[],"FunctionId":93,"Id":93,"ParentId":18,"FunctionName":"子任务取消","FunctionKey":"CANCELSUB","FunctionLevel":3,"FunctionCenter":0,"Rank":12,"Icon":"","Status":1,"Descr":"","CreateBy":0,"CreateDate":"0001-01-01T00:00:00","ModifyBy":0,"ModifyDate":"0001-01-01T00:00:00","TreeIds":null}];
    //   // props.setPowerList(this.functions)
    // }
    render() {
        const data = {"CustomerId":101552386 ,"CompanyName":"达特福德","Connector":"foodd","Mobile":"1589348934","SalesId":117,"SalesName":"管理员","CrmOrderItems":[{"Group":1,"MainItemId":1,"ContractNo":"asdf123","ChildItemId":1,"Amount":"1000","Remark":"12","OrderMonths":"12"}],"ContractDate":"2018-01-05","Remark":"123","BookKeepFeed":1000,"FinanceServiceFeed":0,"OutWorkServiceFeed":0,"AgentFeed":0,"Amount":1000,"OrderSourceId":"1","PayInfoList":[{"PayTypeId":"1","id":"pid_1","PayAccountNo":"12331","PayTime":"2018-01-05","PayImagePath":"https://pilipa.oss-cn-beijing.aliyuncs.com/FileUploads/ERP/201801/bwHKmX6P6C.jpg"}]};
        return (
            <div style={{width:1000}}>
                <Test readOnly data = {data} />
            </div>
        )
    }
}
const mapStateToProps = ({common}) => {
  return {
    curUser: common.user,
  }
}
const mapDispatchToProps = dispatch => {
  return {
    setPowerList: payload => {
      dispatch(setPowerList(payload))
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Main)
