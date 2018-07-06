import React, { Component } from 'react'
import { getListData, postData, fetchUserInfo, putData } from '@/erp/api'
import { message, Spin, Table, Button } from 'antd'
import { connect } from 'react-redux'
import Department from '@/erp/container/Department'
import SearchForm from '@/erp/container/SearchForm'
import HasPower from '@/erp/container/HasPower'
import Dialog from '@/erp/container/Dialog'
import UserInfo from '@/erp/container/UserInfo'
import {getAllDepartments} from '@/erp/store/actions'

let search = {
    items: [{
        label: '员工编号',
        type: 'text',
        field: 'employeeno'
    }, {
        label: '手机号',
        type: 'text',
        field: 'phone'
    }, {
        label: '姓名',
        type: 'text',
        field: 'realname'
    }],
    buttons:[]
};


class Users extends Component {
    constructor(props) {
        super(props);
        this.initPagination = {
            total:  0,
            current: 1,
            pageSize: 15,
            showTotal(total) {
              return `共计 @/erp{total} 条`;
            }
        }
        this.state = {
            loading: false,
            data: [],
            deptId: '',
            searchParams: {},
            departments: [],
            pagination: {
                ...this.initPagination
            }
        }

        this.handleDepartmentClick = this.handleDepartmentClick.bind(this);
        this.handleTableChange = this.handleTableChange.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.fetchUsers = this.fetchUsers.bind(this);
        this.addNew = this.addNew.bind(this);
        this.editUser = this.editUser.bind(this);
        this.getDepartments = this.getDepartments.bind(this)

    }
    getDepartments(){
      getListData('channel/department').then(res=>{
        this.setState({departments: res.data})
      })
    }
    handleDepartmentClick (deptId=''){
        this.setState({
            deptId: deptId,
            searchParams: {},
            pagination: {...this.initPagination}
        }, this.fetchUsers)
        this.refs.search.resetFields()
    }
    handleTableChange (pagination){
        this.setState({pagination: pagination},this.fetchUsers)
    }
    onSearch(item){
        this.setState({
            searchParams: item,
            pagination: {...this.initPagination}
        }, this.fetchUsers);
    }
    fetchUsers(){
        this.setState({loading: true});
        const pagination = this.state.pagination;
        const params = {
            showAll: true,
            ...this.state.searchParams,
            deptId: this.state.deptId,
            limit: pagination.pageSize,
            offset: (pagination.current - 1) * pagination.pageSize
        };
        getListData("users", params).then(res => {
            this.setState((prevState, props) => ({
              loading: false,
              data: res.data.list,
              pagination: {
                ...prevState.pagination,
                total: res.data.total
              }
            }));
        })
    }
    componentWillMount() {
        this.getDepartments();
        this.fetchUsers();
    }
    addNew() {
        Dialog({
            content: <UserInfo wrappedComponentRef={userform=>{this.userform = userform}} user={{}} isNew={true} isModal={true}/>,
            handleOk: ()=>{
                return new Promise((resolve, reject) => {
                    this.userform.props.form.validateFields((err, values) => {
                      if (!err) {
                        let formValues = values;
                        formValues.RoleIds = formValues.RoleIds.join(',')

                        postData('users', formValues).then(res=>{
                            if (res.status) {
                                message.info('保存成功！')
                                resolve()
                            } else {
                                reject()
                            }
                            resolve()
                        })
                      }else{
                        reject(err);
                      }
                    });

                });
            },
            width: '800px',
            confirmLoading: false,
            handleCancel (){
                console.log('onCancel')
            },
            title: '新增用户'
        }).result.then(res=>{
            this.fetchUsers()
        },error=>{
            console.log('Canceled')
        });
    }
    editUser(user) {
        fetchUserInfo(user.UserId).then(res=>{
            let result = res.data;
            result.RoleIds = result.RoleIds.split(',')
            result.DepartmentCenterId = '' + result.DepartmentCenterId;
            Dialog({
                content: <UserInfo wrappedComponentRef={userform=>{this.userform = userform}} user={result} isNew={false} isModal={true}/>,
                handleOk: ()=>{
                    return new Promise((resolve, reject) => {
                        this.userform.props.form.validateFields((err, values) => {
                          if (!err) {
                            let formValues = values;
                            formValues.RoleIds = formValues.RoleIds.join(',')
                            // let postData =  {...result,...formValues};
                            // delete postData.PassWord;
                            postData('users',{...result,...formValues}).then(res=>{
                                if(res.status){
                                    message.info('保存成功！')
                                    resolve()
                                }else{
                                    reject()
                                }
                                
                            })
                          }else{
                            reject(err);
                          }
                        });

                    });
                },
                confirmLoading: false,
                handleCancel (){
                    console.log('onCancel')
                },
                title: '编辑用户'
            }).result.then(res=>{
                this.fetchUsers()
            },error=>{
                console.log('Canceled')
            });
        });
    }
    resetPsd(user){
        putData('users/resetpwd/'+ user.UserId).then(res=>{
            if(res.status){
                message.info('密码重置成功！')
            }
        })
    }
    enableUser(user){
        putData('users/' + user.UserId + '/enabled/' + (3 - user.Status)).then(res=>{
            if(res.status){
                message.info('操作成功！');
                this.fetchUsers()
            }
        })
    }
    render() {
        if(!this.props.departments) return (<Spin style={{ marginLeft: 8 }} />);
        const columns = [{
            title: '员工编号',
            dataIndex: 'EmployeeNo'
        }, {
            title: '姓名',
            dataIndex: 'RealName'
        }, {
            title: '手机号',
            dataIndex: 'Phone',
        }, {
            title: '所属部门',
            dataIndex: 'DepartmentName',
        }, {
            title: '角色',
            dataIndex: 'RoleStrs'
        }, {
            title: '最后操作人',
            dataIndex: 'ModifyBy'
        }, {
            title: '最后修改日期',
            dataIndex: 'ModifyDate'
        },  {
            title: '操作',
            render: (text, record) => {
                // console.log(record.Status, record.Status === '1', 'status')
                const Status = record.Status == '1' ? '禁用' : '启用'
                return (
                    <Button.Group  key={"btn_Group_" + record.UserId} >
                        {record.Status == '1' && <HasPower power="EDIT" key={"btn_EDIT_" + record.UserId}><Button size="small" onClick={e=>{this.editUser(record)}}>编辑</Button></HasPower>}
                        <HasPower power="STOP"  key={"btn_STOP_" + record.UserId} ><Button size="small" onClick={e=>{this.enableUser(record)}}>{Status}</Button></HasPower>
                        {record.Status == '1' && <HasPower power="RESET" key={"btn_RESET_" + record.UserId}><Button size="small" onClick={e=>{this.resetPsd(record)}}>重置密码</Button></HasPower>}
                    </Button.Group>
                )
            }
        }];
        search.buttons=[(<HasPower power="ADD" key="btn_addNew" style={{margin:"0 12px"}}><Button type="primary"  onClick={this.addNew} >新增用户</Button></HasPower>)]
        return (
            <div style={{display:'flex'}}>
                <Department data={this.state.departments}  companyName={this.props.user.SubsidiaryName} onClick={this.handleDepartmentClick} style={{ width: '180px' }}/>
                <div style={{flex:1,margin:"0 12px"}}>
                    <SearchForm items={search.items} onSearch={this.onSearch} buttons={search.buttons} values={this.state.searchParams} ref="search"/>
                    <Table columns={columns}
                        rowKey={record => record.UserId}
                        dataSource={this.state.data}
                        pagination={this.state.pagination}
                        loading={this.state.loading}
                        onChange={this.handleTableChange}
                        size="middle"
                        bordered={true}
                    />
                </div>
            </div>
        )
    }
}

export default Users
