import React, { Component } from 'react'
import { Table, Button, message } from 'antd'
import { getListData, postData, putData } from '@/erp/api'
import Dialog from '@/erp/container/Dialog'
import AddCompany from '@/erp/container/Company/AddCompany'

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: false
    }
    this.addNew = this.addNew.bind(this);
    this.edit = this.edit.bind(this);
    this.openDialog = this.openDialog.bind(this);
  }

  onSearch() {
    getListData('subsidiary').then(res => {
      if (res.status) {
        this.setState({
          loading: false,
          data: res.data.list
        });
      }
    })
  }

  componentWillMount() {
    this.onSearch()
  }

  openDialog(companyinfo,title,width){
      Dialog({
          content: <AddCompany data={companyinfo} wrappedComponentRef={crmform =>{this.crmform = crmform}}/>,
          width: width|| 540,
          handleOk: ()=>{
              return new Promise((resolve, reject) => {
                console.log(this)
                  const formValues = this.crmform.getFieldsValue()
                  console.log(formValues, 'formValues')
                  if(formValues){
                    if (companyinfo.Id) {
                      companyinfo.Address = formValues.Address
                      companyinfo.CityCode = formValues.CityCode
                      companyinfo.CompanyName = formValues.CompanyName
                      companyinfo.Phone = formValues.Phone
                      companyinfo.RealName = formValues.RealName
                      putData('subsidiary/' + companyinfo.Id, companyinfo).then(res => {
                        if(res.status){
                            message.info('保存成功！')
                            resolve()
                        }else{
                            // message.error(res.message);
                            reject()
                        }
                      })
                    } else {
                      postData('subsidiary?verify=0', formValues).then(res=>{
                        if(res.status){
                            message.info('保存成功！')
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
    this.openDialog({},'新增公司')
  }

  edit(row){
    this.openDialog(row,row.CompanyName)
  }
  enter(row){
    putData('subsidiary/entrance?SubsidiaryId='+ row.Id).then(res=>{
      getListData('users/functionlist').then(res=>{
        let user = JSON.parse(window.sessionStorage.getItem('user'));
        user.FunctionList = res.data;
        window.sessionStorage.setItem('user',JSON.stringify(user));
        window.location.href = "#/main";
        window.location.reload();
      })
    })
  }

  render() {
    const columns = [{
      title: '公司名称',
      dataIndex: 'CompanyName',
      render: (text, record) => {
        return <span style={{color: '#1890ff', cursor: 'pointer'}} onClick={e=>{this.edit(record)}}>{text}</span>
      }
    }, {
      title: '地址',
      dataIndex: 'Address'
    }, {
      title: '操作',
      render: (text, record) => (
        <Button.Group >
          <Button size="small" onClick={e=>{this.edit(record)}}>查看</Button>
          <Button size="small" onClick={e=>{this.enter(record)}}>进入</Button>
        </Button.Group>
      )
    }]

    return (
      <div>
        <Button type="primary" onClick={this.addNew}>新增公司</Button>
        <Table columns={columns}
            rowKey={record => record.Id}
            dataSource={this.state.data}
            loading={this.state.loading}
            size="middle"
            bordered={true}
        />
      </div>
    );
  }
}

export default Main
