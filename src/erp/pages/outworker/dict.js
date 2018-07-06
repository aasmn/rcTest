import React, { Component } from 'react'
import { Table, Button, message } from 'antd'
import { getListData, postData, putData } from '@/erp/api'
import HasPower from '@/erp/container/HasPower'
import SearchForm from '@/erp/container/SearchForm'
import { fBusinessType, fPrice, fOutworkStatus } from '@/erp/config/filters'
import TaskDict from '@/erp/container/Outworker/TaskDict'
import Dialog from '@/erp/container/Dialog'
import Confirm from '@/erp/component/Confirm'

let search = {
    items: [{
        label: '子任务名称',
        type: 'text',
        field: 'taskname'
    }, {
        label: '分类名称',
        type: 'select',
        field: 'BusinessType',
        data: [{ id: 0, label: '请选择' }, { id: 1, label: '税务任务' }, { id: 2, label: '工商任务' }, { id: 3, label: '其他任务' }, { id: 4, label: '特殊任务' }],
        defaultValue: '0'
    }, {
        label: '状态',
        type: 'select',
        field: 'status',
        data:[{id:0,label:'请选择'},{id:1,label:'启用'},{id:2,label:'停用'}],
        defaultValue: '0'
    }],
    buttons:[]
};

class DictMain extends Component {
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
    this.handleTableChange = this.handleTableChange.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.addNew = this.addNew.bind(this);
    this.edit = this.edit.bind(this);
    this.openDialog = this.openDialog.bind(this);
  }

  handleTableChange (pagination){
    this.setState({pagination: pagination}, ()=>{this.onSearch(this.state.searchParams)})
  }

  onSearch(vals={}) {
    this.setState({searchParams: vals, loading: true});
    const pagination =this.state.pagination;
    vals.limit = pagination.pageSize;
    vals.offset = (pagination.current - 1) * pagination.pageSize;
    console.log(vals, 'vals')
    if (vals.BusinessType == 0) {
      vals.BusinessType = ''
    }
    return getListData('outertasksub', vals).then(res => {
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

  openDialog(task,title,width){
      Dialog({
          content: <TaskDict data={task} wrappedComponentRef={crmform =>{this.crmform = crmform}}/>,
          width: width|| 540,
          handleOk: ()=>{
              return new Promise((resolve, reject) => {
                console.log(this)
                  const formValues = this.crmform.getFieldsValue()
                  if(formValues){
                      const ajax = formValues.Id? putData:postData;
                      ajax('outertask', formValues).then(res=>{
                        if(res.status){
                            message.info('保存成功！')
                            resolve()
                        }else{
                            // message.error(res.message);
                            reject()
                        }
                      });
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
          this.onSearch(this.state.searchParams)
      },()=>{});
    }

  addNew(){
    this.openDialog({},'新增任务')
  }

  edit(row){
    this.openDialog(row,row.TaskName)
  }

  stopOrnot(row) {
    let isstop = 2;
    if (row.Status == 1) {
      isstop = 2
    } else if (row.Status == 2) {
      isstop = 1
    }
    Confirm({
      handleOk:()=>{
        putData(`outertask/taskisstop?isstop=@/erp{isstop}&id=@/erp{row.Id}`).then(res => {
          if (res.status) {
            this.onSearch(this.state.searchParams)
          }
        })
      },
      message: '确认更改吗？'
    })
  }

  render() {
    const columns = [{
      title: '序列ID',
      dataIndex: 'Id'
    }, {
      title: '子任务名称',
      dataIndex: 'TaskName'
    }, {
      title: '分类名称',
      dataIndex: 'BusinessType',
      render: val=> fBusinessType(val)
    }, {
      title: '操作时间',
      dataIndex: 'ModifyDate'
    }, {
      title: '服务费用',
      dataIndex: 'Price',
      render: val=> fPrice(val)
    }, {
      title: '状态',
      dataIndex: 'Status',
      render: val=> fOutworkStatus(val)
    }, {
      title: '最后操作',
      dataIndex: 'RealName'
    }, {
      title: '操作',
      render: (text, record) => (
        <Button.Group >
          <HasPower power="EDIT"  key={"btn_DETEAL"} ><Button size="small" onClick={e=>{this.edit(record)}}>编辑</Button></HasPower>
          {(record.Status == 2) && <HasPower power="STOP"  key={"btn_GETCUS"} ><Button size="small" onClick={e=>{this.stopOrnot(record)}}>启用</Button></HasPower>}
          {(record.Status != 2) && <HasPower power="STOP"  key={"btn_GETCUS"} ><Button size="small" onClick={e=>{this.stopOrnot(record)}}>停用</Button></HasPower>}
        </Button.Group>
      ),
    }];

    search.buttons=[
    <HasPower power="ADD" key="btn_addNew"><Button type="primary" onClick={this.addNew} style={{margin:'0 8px'}}>新增</Button></HasPower>]

    return (
      <div>
        <SearchForm items={search.items} buttons={search.buttons} onSearch={this.onSearch}/>
        <Table columns={columns}
            rowKey={record => record.Id}
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
export default DictMain
