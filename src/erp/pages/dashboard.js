import React, { Component } from 'react'
import _ from 'lodash'
import CrmCustomerRepeatWarning from '@/erp/container/CrmCustomerRepeatWarning'
import CrmCustomerView from '@/erp/container/CrmCustomerView'
import { getListData, putData } from '@/erp/api'
import { Table, Button, message, DatePicker} from 'antd'
import Dialog from '@/erp/container/Dialog'
import moment from 'moment'



class DialogFooter extends Component{
    constructor(props) {
        super(props) 
        this.state= {loading: false}
    }
    onSave = ()=>{
        this.setState({loading: true})
        this.props.onSave().then(res=>{
            this.setState({loading: false})
        })
    }
    onPub = ()=>{
       this.setState({loading: true})
        this.props.onPub().then(res=>{
            this.setState({loading: false})
        }) 
    }
    render (){
        return ([<Button key="back" type="primary" onClick={this.props.onClose}>关闭</Button>,
            <Button key="toput" type="primary" loading={this.state.loading} onClick={this.onPub.bind(this)}>转公海&下一条</Button>,
             <Button key="submit" type="primary" loading={this.state.loading} onClick={this.onSave.bind(this)}>保存&下一条</Button>
             ])
    }
}

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            DQdate: new moment(),
            loading: false,
        };
        this.onSearch = this.onSearch.bind(this);
        this.edit = this.edit.bind(this)
    }
    onSearch() {
        this.setState({loading: true});
        const params = {
            DQdate: this.state.DQdate.format('YYYY-MM-DD')
        }
        return getListData('nexttrackremind', params).then(res => {
            if(res.status){
                this.setState({
                    loading: false,
                    data: res.data,
                });
            }
            return res;
        },err=>{
            this.setState({
                loading: false
            });
        })
    }
    edit(row){
        const  closeDialog = ()=>{
            d.close()
        }
        const save_next =()=>{
            const that = this;
            return new Promise((resolve,reject)=>{
                that.crmform.saveCustomer().then(customer=>{
                    if(customer.isSave){
                        putData('customer/'+customer.Id+'?verify=0', customer).then(res=>{
                            if (res && _.isObject(res.data)) {
                                const data = res.data;
                                if (data.errorcode == 1) {
                                    message.error(res.data.name);
                                    resolve()
                                } else {
                                    const customers = JSON.parse(data.name);
                                    Dialog({
                                        content: <CrmCustomerRepeatWarning data={customers}/>,
                                        width: 800,
                                        handleOk (){
                                            return true
                                        },
                                        confirmLoading: false,
                                        handleCancel (){
                                            console.log('onCancel')
                                        },
                                        title: '新增客户' 
                                    }).result.then(()=>{
                                         putData('customer/'+customer.Id+'?verify=1', customer).then(res=>{
                                            message.info('保存成功！')
                                            resolve()
                                            that.showNext(customer.Id)
                                         })
                                    },()=>{resolve()});

                                }
                            } else{
                                message.info('保存成功！')
                                resolve()
                                that.showNext(customer.Id)
                            }
                        })
                    }else{
                       resolve()
                       that.showNext(customer.Id)
                    }
                })
            });
        }
        const pub_next =()=>{
            const that = this;
            return new Promise((resolve,reject)=>{
                that.crmform.saveCustomer().then(customer=>{
                    putData('custranstoocean?customerId='+ customer.Id).then((res)=>{
                        if(res.status){
                            that.showNext(customer.Id)
                            resolve()
                        }
                    })
                })
            });
        }
        const d = Dialog({
            content: <CrmCustomerView customerId={row.CustomerId} ref={crmform =>{this.crmform = crmform}}/>,
            width: 1100,
            confirmLoading: false,
            handleCancel: ()=> true,
            handleOk: ()=>true,
            title: '',
            footer: <DialogFooter onClose={closeDialog} onSave={save_next} onPub={pub_next}/>
        })

        d.result.then(()=>{
            this.onSearch(this.state.searchParams)
        },()=>{ this.onSearch(this.state.searchParams)});
    }
    showNext = (id)=>{
        const index = _.findIndex(this.state.data,t=> (+t.CustomerId)=== +id)
        if(index>-1 && index< this.state.data.length){
            if(index+1< this.state.data.length){
                this.crmform.showNext(this.state.data[index+1].CustomerId)
            }else{
                message.info('没有下一条了！')
                return ;
            }
        }
    }
    componentWillMount() {
        this.onSearch();
    }
    render() {
        if(this.props.curUser.IsCenter) return <span>Hi,{this.props.curUser.RealName}</span>;
        const columns = [{
            title: '公司名称',
            dataIndex: 'CompanyName'
        }, {
            title: '联系人',
            dataIndex: 'Connector',
        }, {
            title: '联系电话',
            dataIndex: 'Mobile',
        },  {
            title: '操作',
            render: (text, record) => (
                <Button size="small" onClick={e=>{this.edit(record)}}>查看</Button>
            ),
        }];
        return (
            <div>
                <div><label>跟踪提醒</label><DatePicker value={this.state.DQdate} onChange={this.onSearch}/> </div>
                <Table columns={columns} 
                    rowKey={record => record.Id}
                    dataSource={this.state.data} 
                    pagination={false}
                    loading={this.state.loading}
                    onChange={this.handleTableChange}
                    size="middle"
                    bordered={true}
                />
            </div>
        );
    }
}

export default Main