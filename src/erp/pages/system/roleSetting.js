import React, { Component } from 'react'
import { getListData, postData, putData } from '@/erp/api'
import { message, Spin, Table, Button } from 'antd'
import HasPower from '@/erp/container/HasPower'
import Dialog from '@/erp/container/Dialog'
import Role from '@/erp/container/Role'

class Main extends Component {
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
            pagination: {
                ...this.initPagination
            }
        }
        
        this.handleTableChange = this.handleTableChange.bind(this);
        this.fetchRoles = this.fetchRoles.bind(this);
        this.addNew = this.addNew.bind(this);
        this.edit = this.edit.bind(this);
        this.saveRole = this.saveRole.bind(this);
    }
    handleTableChange (pagination){
        this.setState({pagination: pagination},this.fetchRoles)
    }
    fetchRoles(){
        this.setState({loading: true});
        const pagination = this.state.pagination;
        const params = {
            showAll: true,
            limit: pagination.pageSize,
            offset: (pagination.current - 1) * pagination.pageSize
        };
        getListData("roles", params).then(res => {
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
        this.fetchRoles();
    }
    addNew() {
        this.saveRole({})
    }
    edit(role) {
        getListData('roles/'+ role.Id).then(res=>{
            res.data.Category = '' + res.data.Category;
            this.saveRole(res.data)
        })
    }
    saveRole(role) {
        Dialog({
            content: <Role wrappedComponentRef={userform=>{this.userform = userform}} role={role}/>,
            handleOk: ()=>{
                return new Promise((resolve, reject) => {
                    this.userform.props.form.validateFields((err, values) => {
                      if (!err) {
                        let formValues = {...role,...values};
                        postData('roles', formValues).then(function (res) {
                          if(res.status){
                            message.info('保存成功！')
                            resolve()
                          }else{
                            reject(res.message)
                          }
                        },error=>{
                            console.log(arguments)
                            reject(error);
                        })
                      }else{
                        reject(err);
                      }
                    });
                
                });
            },
            width: "75%",
            confirmLoading: false,
            handleCancel (){
                console.log('onCancel')
            },
            title: role?'编辑角色': '新增角色' 
        }).result.then(res=>{
            this.fetchRoles()
        },error=>{
            console.log(error)
        });
    }
    enableRole(role){
        putData('roles/' + role.Id + '/enabled/' + (3 - role.Status)).then(res=>{
            if(res.status){
                message.info('操作成功！');
                this.fetchRoles()
            }
        })
    }
    render() {
        if(!this.state.data.length) return (<Spin style={{ marginLeft: 8 }} />);
        const columns = [{ 
            title: '角色ID',
            dataIndex: 'RoleNo'
        }, {
            title: '角色名称',
            dataIndex: 'RoleName'
        }, {
            title: '最后操作人',
            dataIndex: 'ModifyBy',
        }, {
            title: '最后操作时间',
            dataIndex: 'ModifyDate',
        },  {
            title: '操作',
            render: (text, record) => (
                <Button.Group>   
                    <HasPower power="STOP" key="btn_STOP"><Button size="small"  onClick={this.enableRole.bind(this,record)}>{record.Status === '1'?'禁用':'启用'}</Button></HasPower>
                    {record.Status == 1 && <HasPower power="FUNCTION" key="btn_FUNCTION"><Button size="small" onClick={e=>{this.edit(record)}}>默认权限</Button></HasPower>}    
                </Button.Group>
            ),
        }];

        return (
            <div>
                <Button type="primary" size="large" style={{margin: '0 0 20px 0'}} onClick={this.addNew}>新增角色</Button>
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
        )
    }
}


export default Main
