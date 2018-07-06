import React, { Component } from 'react'
import { Button } from 'antd'
import { getListData, postData, deleteData } from '@/erp/api'
import _ from 'lodash'
import FunctionItem from '@/erp/container/FunctionItem'
import FunctionModel from '@/erp/container/FunctionModel'
import Dialog from '@/erp/container/Dialog'

class Main extends Component {
  constructor() {
    super();
    this.state = {
      dataCenter: [],
      data: [],
      loading: false
    }
    this.addNew = this.addNew.bind(this);
  }

  onSearch() {
    getListData('functionlist').then(res => {
      if (res.status) {
        var Data = _.filter(res.data, {FunctionCenter: 0})
        var DataCenter = _.filter(res.data, {FunctionCenter: 1})
        console.log(Data)
        console.log(DataCenter)
        this.setState({
          loading: false,
          data: Data,
          dataCenter: DataCenter
        });
      }
    })
  }

  componentWillMount() {
    this.onSearch()
  }

  openDialog(item,title,width){
      Dialog({
          content: <FunctionModel data={item} wrappedComponentRef={crmform =>{this.crmform = crmform}}/>,
          width: width|| 540,
          handleOk: ()=>{
              return new Promise((resolve, reject) => {
                  const formValues = this.crmform.getFieldsValue()

                  if(formValues){
                    if (item.Id) {
                      item.FunctionCenter = formValues.FunctionCenter;
                      item.FunctionKey = formValues.FunctionKey;
                      item.FunctionName = formValues.FunctionName;
                      item.Icon = formValues.Icon;
                      item.ParentId = formValues.ParentId;
                      item.Rank = formValues.Rank;

                      postData('functionlist', item).then(res=>{
                        if(res.status){
                            resolve()
                        }else{
                            // message.error(res.message);
                            reject()
                        }
                      });
                    } else {
                      postData('functionlist', formValues).then(res=>{
                        if(res.status){
                            resolve()
                        }else{
                            // message.error(res.message);
                            reject()
                        }
                      });
                    }
                  }else{
                      reject();
                  }
              });
          },
          confirmLoading: false,
          handleCancel (){
            console.log('onCancel')
          },
          title: title
      }).result.then(()=>{
          this.onSearch()
      },()=>{});
    }

  addNew() {
    this.openDialog({},'新增项目')
  }

  modify(row) {
    console.log(row, 'row')
    this.openDialog(row,row.FunctionName)
  }

  deleteItem(parentId) {
    deleteData('functionlist/' + parentId).then(res => {
      if (res.status) {
        this.onSearch()
      }
    })
  }

  render() {
    return (
      <div>
        <Button type="primary" onClick={this.addNew}>新增</Button>
        <FunctionItem data={this.state.data} title='直营公司' onModify={this.modify.bind(this)} onDelete={this.deleteItem.bind(this)}/>
        <FunctionItem data={this.state.dataCenter} title='中心用户' onModify={this.modify.bind(this)} onDelete={this.deleteItem.bind(this)}/>
      </div>
    )
  }
}

export default Main
