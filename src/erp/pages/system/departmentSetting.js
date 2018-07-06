import React, { Component } from 'react'
import { getListData, postData, putData } from '@/erp/api'
import { message, Spin, Table, Button, Input, Modal } from 'antd'
import HasPower from '@/erp/container/HasPower'

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
            },
            modalVisible: false,
            modalValue:'',
            modelDepartment: {}
        }
        
        this.handleTableChange = this.handleTableChange.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
        this.handleModalOk = this.handleModalOk.bind(this);
        this.handleModalCancel = this.handleModalCancel.bind(this);
    }
    handleTableChange (pagination){
        this.setState({ pagination: pagination }, this.fetchData)
    }
    fetchData(){
        this.setState({loading: true});
        const pagination = this.state.pagination;
        const params = {
            showAll: true,
            limit: pagination.pageSize,
            offset: (pagination.current - 1) * pagination.pageSize
        };
        getListData("departmentscenter", params).then(res => {
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
        this.fetchData();
    }
    add() {
        this.setState({
            modalVisible: true,
            modalValue: '',
            modelDepartment: {}
        })
    }
    edit(item) {
        this.setState({
            modalVisible: true,
            modalValue: item.DepartmentName,
            modelDepartment: item
        })
    }
    handleModalOk() {
        if(!this.state.modalValue){
            message.error('请输入部门名称！');
            return;
        }
        const data = {
            ...this.state.modelDepartment,
            DepartmentName: this.state.modalValue
        }
        postData('departmentscenter',data).then(res=>{
            if(res.status){
                message.info('保存成功！');
                this.fetchData();
                this.setState({modalVisible: false})
            }else{
                message.error(res.message)
            }
        })
    }
    handleModalCancel(){
        this.setState({modalVisible: false})
    }
    
    enableRole(role){
        putData('departmentscenter/' + role.DepartmentId + '/enabled/' + (3 - role.Status)).then(res=>{
            if(res.status){
                message.info('操作成功！');
                this.fetchData()
            }
        })
    }
    render() {
        if(!this.state.data.length) return (<Spin style={{ marginLeft: 8 }} />);
        const columns = [{ 
            title: '部门ID',
            dataIndex: 'DepartmentNo'
        }, {
            title: '部门名称',
            dataIndex: 'DepartmentName'
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
                    <HasPower power="STOP" key="btn_STOP"><Button size="small"  onClick={this.enableRole.bind(this,record)}>{record.Status == '1'?'禁用':'启用'}</Button></HasPower>
                    {record.Status == '1' && <HasPower power="EDIT" key="btn_EDIT"><Button size="small" onClick={e=>{this.edit(record)}}>编辑</Button></HasPower>}    
                </Button.Group>
            ),
        }];

        return (
            <div>
                <Button type="primary" size="large" onClick={this.add} style={{margin: '0 0 20px 0'}}>新增部门</Button>
                <Table columns={columns} 
                    rowKey={record => record.DepartmentId}
                    dataSource={this.state.data} 
                    pagination={this.state.pagination}
                    loading={this.state.loading}
                    onChange={this.handleTableChange}
                    size="middle"
                    bordered={true}
                />  
                <Modal
                  title="部门名称"
                  visible={this.state.modalVisible}
                  onOk={this.handleModalOk}
                  onCancel={this.handleModalCancel}
                >
                  <p><Input value={this.state.modalValue} type='text' onChange={e=>{this.setState({modalValue: e.target.value})}}/></p>
                </Modal>           
            </div>
        )
    }
}


export default Main
