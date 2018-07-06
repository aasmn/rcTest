import React, { Component } from 'react'
import _ from 'lodash'
import SearchForm from '@/erp/container/SearchForm'
import SalerSelect from '@/erp/container/searchComponent/SalerSelect'
import AreaSelect from '@/erp/container/searchComponent/AreaSelect'
import TaxStatusSelect from '@/erp/container/searchComponent/TaxStatusSelect'

import CompanyDialog from '@/erp/container/Contract/CompanyDialog'

import { getListData, postData, putData } from '@/erp/api'
import { Table, Button, message, Select, Input, Popover} from 'antd'
import Dialog from '@/erp/container/Dialog'
import { fDate, fTaxStatus } from '@/erp/config/filters'
import HasPower from '@/erp/container/HasPower'
import RIf from '@/erp/component/RIF'
import * as action from '@/erp/config/contractActions'
import moment from 'moment'

let search = {
    items: [{
        label: '公司名称/联系人',
        type: 'text',
        field: 'companyName'
    },{
        label: '联系电话',
        type: 'text',
        field: 'phone'
    },{
        label: '序列ID',
        type: 'text',
        field: 'sequenceNumber',
        more: true
    },  {
        label: '所属区域',
        type: 'custom',
        field: 'areaCode',
        view: AreaSelect,
        more: true
    }, {
        label: '销售人员',
        type: 'text',
        field: 'SalesName',
        more: true
    }, {
        label: '报税状态',
        type: 'custom',
        field: 'agentStatus',
        view: TaxStatusSelect,
        more: true
    }, {
        label: '服务期止',
        type: 'month',
        field: 's_serviceendtime',
        more: true
    }, {
        label: '至',
        type: 'month',
        field: 'e_serviceendtime',
        more: true
    }, {
        label: '创建时间',
        type: 'date',
        field: 's_createtime',
        more: true
    }, {
        label: '至',
        type: 'date',
        field: 'e_createtime',
        more: true
    }],
    buttons:[]
};

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            pagination: {
                current: 1,
                pageSize: 15,
                pageSizeOptions: ['20','50','80','100','200'],
                showQuickJumper: true,
                showSizeChanger: true,
                showTotal(total) {
                  return `共计 @/erp{total} 条`;
                }
            },
            searchParams: {},
            loading: false,
        };
        this.onSearch = this.onSearch.bind(this);
        this.handleTableChange = this.handleTableChange.bind(this);
        this.onUpload = this.onUpload.bind(this);
        this.addNew = this.addNew.bind(this);
        this.view = this.view.bind(this);
        this.openDialog = this.openDialog.bind(this);
        this.onRefresh = this.onRefresh.bind(this);
    }
    onUpload (res){
        if(res.file && res.file.status==="done"){
            if(res.file.response.data.length){
                message.error(res.file.response.data.map(m=><div>{m}</div>));
            }else{
                message.info('导入成功！');
            }
        }
    }
    handleTableChange (pagination){
        this.setState({pagination: pagination}, ()=>{this.onSearch(this.state.searchParams)})
    }
    onRefresh(){
        this.onSearch(this.state.searchParams);
    }
    onSearch(vals={}) {
        if(vals.s_serviceendtime) vals.s_serviceendtime = moment(vals.s_serviceendtime).startOf('month').format('YYYY-MM-DD');
        if(vals.e_serviceendtime) vals.e_serviceendtime = moment(vals.e_serviceendtime).endOf('month').format('YYYY-MM-DD');
        this.setState({searchParams: vals, loading: true});
        const pagination =this.state.pagination;
        if (!_.isEqual(vals,this.state.searchParams)) {
          pagination.current = 1
        }
        vals.limit = pagination.pageSize;
        vals.offset = (pagination.current - 1) * pagination.pageSize;
        return getListData('signcustomerlist', vals).then(res => {
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
    openDialog(customer,title,width){

    }
    addNew(){

    }
    view(row){
        const dialog = Dialog({
            content: <CompanyDialog companyId={row.Id} row={row} refreshTable={this.onRefresh} onDialogClose={e=>{dialog.close()}}/>,
            width: 1100,
            confirmLoading: false,
            footer: null,
            title: row.CompanyName
        });
        dialog.result.then(()=>{
            // this.onSearch(this.state.searchParams)
        },()=>{
            // this.onSearch(this.state.searchParams)
        });

    }
    mark = (row)=>{
        if(!row.RemarkSignId){
            action.mark(row).then(()=>{
                this.onSearch(this.state.searchParams)
            },()=>{});

        }else{
            action.mark(row).then(res=>{
                if(res.status){
                    this.onSearch(this.state.searchParams);
                }
            })
        }
    }
    hangUp = (row) => {
        row.SubsidiaryId = this.props.curUser.SubsidiaryId
        action.hangUp(row).then(()=>{
            this.onSearch(this.state.searchParams);
        })
    }
    toOther = (row) => {
        let saler;
        Dialog({
            content: <div><span>选择销售:&nbsp;&nbsp;</span><SalerSelect hideAll = {true} onChange={v=>{saler=v}}/></div>,
            width: 540,
            handleOk: ()=>{
                return new Promise((resolve, reject) => {
                    if(!saler){
                        message.error("请选择销售！");
                        reject()
                    }
                    putData(`customers/tosales/@/erp{saler}/qy`,[row.Id]).then(res=>{
                        if(res.status){
                            message.info('转出成功！')
                            this.onSearch(this.state.searchParams);
                            resolve();
                        }else{
                            reject();
                        }
                    },()=>reject())
                });
            },
            confirmLoading: false,
            handleCancel (){
                console.log('onCancel')
            },
            title: "换销售-"+ row.CompanyName
        }).result.then(()=>{
            this.onSearch(this.state.searchParams);
        },()=>{});
    }
    toOthers = ()=>{
      console.log(this.state.selectedRowKeys, 'this.state.selectedRowKeys')
      if (!(this.state.selectedRowKeys && this.state.selectedRowKeys.length>0)) {
        message.error('请至少选择一个客户！');
        return false
      }
        let saler;
        Dialog({
            content: <div><span>选择销售:&nbsp;&nbsp;</span><SalerSelect hideAll = {true} onChange={v=>{saler=v}}/></div>,
            width: 540,
            handleOk: ()=>{
              if (!saler) {
                message.error('请选择销售')
                return false
              }
              return new Promise((resolve, reject) => {
                  const ids = this.state.selectedRowKeys;
                  putData(`customers/tosales/@/erp{saler}/qy`, ids).then(res=>{
                      if(res.status){
                          message.info('转出成功！')
                          this.setState({selectedRowKeys: []})
                          this.onSearch(this.state.searchParams);
                          resolve();
                      }else{
                          reject();
                      }
                  },()=>reject())
              });
            },
            confirmLoading: false,
            handleCancel (){
                console.log('onCancel')
            },
            title: "批量换销售"
        }).result.then(()=>{
            this.onSearch(this.state.searchParams);
        },()=>{});

    }
    componentWillMount() {
        this.onSearch();
    }
    onSelectChange = (selectedRowKeys) => {
      this.setState({ selectedRowKeys });
    }
    render() {

        const columns = [{
            title: '序列ID',
            dataIndex: 'SequenceNo',
            width: 200,
            render: (val,row)=>{
                const cnames = ['mark-style mark-style-yellow','mark-style mark-style-blue','mark-style mark-style-red']
                return [
                    <RIf  if={!!row.RemarkSignId} key={val+'_1'}><Popover content={row.RemarkSignContent} title=""><span className={cnames[row.RemarkSignId-1]}></span></Popover></RIf>,
                    <span key={val + '_3'} style={{float:'right'}}>{val}</span>
                ]
            }
        }, {
            title: '公司名称',
            dataIndex: 'CompanyName',
            render: (val,record) => (<a href="javascript:;" onClick={e=>{this.view(record)}}>{val}</a>)
        }, {
            title: '所属区域',
            dataIndex: 'AreaName',
        }, {
            title: '联系人',
            dataIndex: 'Connector',
        }, {
            title: '当前负责销售',
            dataIndex: 'SalesName'
        }, {
            title: '报税状态',
            dataIndex: 'AgentStatus',
            render: val=> fTaxStatus(val)
        }, {
            title: '服务期止',
            dataIndex: 'ServiceEnd',
            render: val=> fDate(val)
        }, {
            title: '创建时间',
            dataIndex: 'CreateDate',
            render: val=> fDate(val)
        }, {
            title: '操作',
            render: (text, record) => (
                <Button.Group >
                    <HasPower power="MARK"  key={"btn_MARK"} ><Button size="small" onClick={e=>{this.mark(record)}}>{record.RemarkSignId?'取消':'标记'}</Button></HasPower>
                    <HasPower power="GUAQI" key={"btn_GUAQI"} ><Button size="small" disabled={record.AgentStatus == 2 ? false : !record.IfCancelHangup} onClick={e => { this.hangUp(record) }}>{record.AgentStatus == 2?'取消':'挂起'}</Button></HasPower>
                    <HasPower power="HXS"  key={"btn_HXS"} ><Button size="small" onClick={e=>{this.toOther(record)}}>换销售</Button></HasPower>
                </Button.Group>
            ),
        }];
        var { selectedRowKeys } = this.state;
        const rowSelection = {
          selectedRowKeys,
          onChange: this.onSelectChange
        }
        // search.buttons=[
        // <HasPower power="NEW" key="btn_addNew"><Button type="primary" onClick={this.addNew} style={{margin:'0 8px'}}>新增客户</Button></HasPower>,
        // <HasPower power="IMPORT" key="btn_IMPORT"><ImportData onChange={this.onUpload} style={{margin:'0 8px'}}/></HasPower>]

        return (
            <div>
                <SearchForm items={search.items} buttons={search.buttons} onSearch={this.onSearch}/>
                <Table columns={columns}
                    rowKey={record => _.uniqueId('sid_')}
                    dataSource={this.state.data}
                    pagination={this.state.pagination}
                    loading={this.state.loading}
                    onChange={this.handleTableChange}
                    size="middle"
                    bordered={true}
                    rowSelection = {rowSelection}
                />
                <HasPower power="PLHXS"  key={"btn_PLHXS"} ><Button style={{position: 'relative', bottom: '40px'}} type="primary" onClick={this.toOthers}>批量换销售</Button></HasPower>
            </div>
        );
    }
}

export default Main
