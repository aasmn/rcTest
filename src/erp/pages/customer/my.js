import React, {Component} from 'react'
import _ from 'lodash'
import SearchForm from '@/erp/container/SearchForm'
import SalerSelect from '@/erp/container/searchComponent/SalerSelect'
import CustomerType from '@/erp/container/searchComponent/CustomerType'
import CustomerSourceSelect from '@/erp/container/searchComponent/CustomerSourceSelect'
import ImportData from '@/erp/container/searchComponent/ImportData'
import CrmCustomer from '@/erp/component/CrmCustomer'
import CrmCustomerRepeatWarning from '@/erp/container/CrmCustomerRepeatWarning'
import CrmCustomerView from '@/erp/container/CrmCustomerView'
import {getListData, postData, putData} from '@/erp/api'
import {Table, Button, message, DatePicker} from 'antd'
import Dialog from '@/erp/container/Dialog'
import {fDate} from '@/erp/config/filters'
import HasPower from '@/erp/container/HasPower'
import Confirm from '@/erp/component/Confirm'
import { powerList } from '@/erp/config/filters'
import moment from 'moment'
import { SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION } from 'constants';

let search = {
  items: [{
    label: '客户名称/联系人',
    type: 'text',
    field: 'companyName'
  }, {
    label: '联系电话',
    type: 'text',
    field: 'phone',
    more: true
  }, {
    label: '意向度',
    type: 'custom',
    field: 'CustomerTypeId',
    view: CustomerType,
    defaultValue: '0',
    sorter: true
  }, {
    label: '客户来源',
    type: 'custom',
    field: 'CustomerSourceId',
    view: CustomerSourceSelect,
    defaultValue: '0',
    more: true
  }, {
    label: '销售',
    type: 'custom',
    field: 'SalesId',
    view: SalerSelect,
    defaultValue: '0',
    more: true
  }, {
    label: '创建日期',
    type: 'date',
    field: 'createstart',
    more: true
  }, {
    label: '至',
    type: 'date',
    field: 'createend',
    more: true
  }, {
    label: '首次跟踪日期',
    type: 'date',
    field: 'first_tracktime_s',
    more: true
  }, {
    label: '至',
    type: 'date',
    field: 'first_tracktime_e',
    more: true
  }, {
    label: '最后跟踪日期',
    type: 'date',
    field: 'last_tracktime_s',
    more: true
  }, {
    label: '至',
    type: 'date',
    field: 'last_tracktime_e',
    more: true
  }],
  buttons: []
};

class DialogFooter extends Component {
  constructor(props) {
    super(props)
    this.state = {loading: false}
  }

  onClose = () => {
    this.props.onClose
  }
  onSave = () => {
    this.setState({loading: true})
    this.props.onSave().then(res => {
      this.setState({loading: false})
    },res => {
      this.setState({loading: false})
    })
  }
  onPub = () => {
    this.setState({loading: true})
    this.props.onPub().then(res => {
      this.setState({loading: false})
    })
  }

  render() {
    return ([<Button key="back" type="primary" onClick={this.props.onClose}>关闭</Button>,
      <Button key="toput" type="primary" loading={this.state.loading}
              onClick={this.onPub.bind(this)}>转公海&下一条</Button>,
      <Button key="submit" type="primary" loading={this.state.loading}
              onClick={this.onSave.bind(this)}>保存&下一条</Button>
    ])
  }
}

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      statisticsData: [],
      selectedRowKeys: [],
      pagination: {
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        showSizeChanger: true,
        pageSizeOptions: ['15', '30', '50', '80', '100', '200'],
        showTotal(total) {
          return `共计 @/erp{total} 条`;
        }
      },
      searchParams: {},
      loading: false,
    };
    this.onSearch = this.onSearch.bind(this);
    this.handleTableChange = this.handleTableChange.bind(this);
    this.onUpload = this.onUpload.bind(this)
    this.addNew = this.addNew.bind(this)
    this.edit = this.edit.bind(this)
    this.openDialog = this.openDialog.bind(this)
    this.toPubBatch = this.toPubBatch.bind(this)
    this.toOtherBatch = this.toOtherBatch.bind(this)
    this.statistics = this.statistics.bind(this)

    if(!(powerList(this.props.functions)('SEARCHMANAGER'))){
      search.items.splice(5,1)
    }
  }

  //表头统计
  statistics(salesId) {
    getListData(`statistics/customers/category?salesId=@/erp{salesId ? salesId : this.props.curUser.Id}`)
      .then(res => {
        if (res.status) {
          this.setState({
            statisticsData: res.data
          });
        }
      })
  }

  onUpload(res) {
    if (!this.loading) this.loading = message.loading('数据上传中..', 0);
    if (res.file && res.file.status === "done") {
      this.loading()
      if (res.file.response.data.length) {
        Dialog({
          content: <div>{res.file.response.data.map(m => <div>{m}</div>)}</div>,
          width: 600
        })
      } else {
        message.info('导入成功！');
      }
      this.onSearch(this.state.searchParams)
    }
  }

  handleTableChange(pagination, filters, sorter) {
    this.setState({pagination: pagination}, () => {
      this.onSearch(this.state.searchParams, sorter)
    })
  }

  onSearch(vals = {}, sorter) {
    const that = this
    this.setState({searchParams: vals, loading: true});
    console.log(vals, 'vals')
    const pagination = this.state.pagination;
    if (!_.isEqual(vals, this.state.searchParams)) {
      pagination.current = 1
    }
    vals.limit = pagination.pageSize;
    vals.offset = (pagination.current - 1) * pagination.pageSize;
    if (sorter && sorter.field) {
      vals.sort = `@/erp{sorter.field}_@/erp{sorter.order === 'descend' ? 'DESC' : 'ASC'}`
    }
    return getListData('Customer', vals).then(res => {
      if (res.status) {
        const pagination = {...this.state.pagination};
        pagination.total = res.data.total;
        this.setState({
          loading: false,
          data: res.data.list,
          pagination,
        });
        if(vals.SalesId !== '0') {
          that.statistics(vals.SalesId)
        } else {
          that.statistics(that.props.curUser.Id)
        }
      }
      return res;
    }, err => {
      this.setState({
        loading: false
      });
    })
  }

  openDialog(customer, title, width) {
    const that = this
    Dialog({
      content: <CrmCustomer isNew={true} data={customer} wrappedComponentRef={crmform => {
        this.crmform = crmform
      }}/>,
      width: width || 540,
      handleOk: () => {
        return new Promise((resolve, reject) => {
          that.crmform.props.form.validateFields((err, formValues) => {
            if (!err) {
              
              postData('customer?verify=0', formValues).then(res => {
                if (res && _.isObject(res.data)) {
                  const data = res.data;
                  if (data.errorcode == 1) {
                    message.error(res.data.name);
                    reject();
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
                    }).result.then(() => {
                      postData('customer?verify=1', formValues).then(res => {
                        if(res.status){
                          message.info('保存成功！')
                          resolve()
                        }else{
                          reject()
                        }
                        
                      })
                    }, () => {
                      reject()
                    });

                  }
                } else {
                  if (res.status) {
                    message.info('保存成功！')
                    resolve()
                  } else {
                    // message.error(res.message);
                    reject()
                  }
                }
              },res=>{reject()});
            } else {
              reject();
            }
          })
        });
      },
      confirmLoading: false,
      handleCancel (){
        console.log('onCancel')
      },
      title: title
    }).result.then(() => {
      this.onSearch(this.state.searchParams)
    }, () => {
    });
  }

  addNew() {
    this.openDialog({}, '新增客户')
  }

  //查看客户详情
  edit(row) {
    let current = row.Id;
    const closeDialog = () => {
      d.close()
    }
    const save_next = () => {
      const that = this;
      return new Promise((resolve, reject) => {
        that.crmform.saveCustomer().then(customer => {
          if (customer.isSave) {
            putData('customer/' + customer.Id + '?verify=0', customer).then(res => {
              if (res && _.isObject(res.data)) {
                const data = res.data;
                if (data.errorcode === 1) {
                  message.error(res.data.name);
                  resolve()
                } else {
                  const customers = JSON.parse(data.name);
                  Dialog({
                    content: <CrmCustomerRepeatWarning data={customers}/>,
                    width: 800,
                    handleOk() {
                      return true
                    },
                    confirmLoading: false,
                    handleCancel() {
                      console.log('onCancel')
                    },
                    title: '新增客户'
                  }).result.then(() => {
                    putData('customer/' + customer.Id + '?verify=1', customer).then(res => {
                     if(res.status){
                      resolve()
                      that.saveCustomerTrack(customer.Id)
                    }else{
                      reject()
                    }
                    })
                  }, () => {
                    resolve()
                  });

                }
              } else {
                // message.info('保存成功！')
                if(res.status){
                  that.saveCustomerTrack(customer.Id)
                  resolve()
                }else{
                  reject()
                }
              }
            })
          } else {
            resolve()
            that.saveCustomerTrack(customer.Id)
          }
        })
      });
    }
    const pub_next = () => {
      const that = this;
      return new Promise((resolve, reject) => {
        that.crmform.saveCustomer().then(customer => {
          putData('customers/toocean', [customer.Id]).then((res) => {
            if (res.status) {
              that.showNext(customer.Id)
            }
            resolve()
          })
        })
      });
    }
    const d = Dialog({
      content: <CrmCustomerView customerId={row.Id} ref={crmform => {
        this.crmform = crmform
      }}/>,
      width: 1100,
      confirmLoading: false,
      handleCancel: () => true,
      handleOk: () => true,
      title: '',
      footer: <DialogFooter onClose={closeDialog} onSave={save_next} onPub={pub_next}/>
    })
    this.DialogCrmCustomerView = d
    d.result.then(() => {
      this.onSearch(this.state.searchParams)
    }, () => {
      this.onSearch(this.state.searchParams)
    });
  }

  //保存客户跟踪信息
  saveCustomerTrack(customerId) {
    // this.crmform.state.tagSelected
    // remindDateStr
    const {trackDescription, tagSelected, remindDateStr} = this.crmform.state
    const that = this
    let Tags = []
    tagSelected.forEach(item => {
      Tags.push(item.Id)
    })
    postData(`customertrack?reservation_date=@/erp{remindDateStr}`,
      {
        "CustomId": customerId,
        "Description": trackDescription,
        "Tags": Tags.toString()
      })
      .then(res => {
        if (res.status) {
          message.success('保存成功！', 1)
          // that.showNext(customerId)
        }
      })
    that.showNext(customerId)
  }

  showNext = (id) => {
    const that = this
    that.crmform.reset();
    const index = _.findIndex(this.state.data, t => t.Id === +id)
    if (index > -1 && index < this.state.data.length) {
      if (index + 1 < this.state.data.length) {
        this.crmform.showNext(this.state.data[index + 1].Id)
      } else {
        const pagination = this.state.pagination;
        if ((pagination.current - 1) * pagination.pageSize + index + 1 < pagination.total) {
          this.setState({
            pagination: {...pagination, current: pagination.current + 1}
          })
          this.onSearch(this.state.searchParams).then(res => {
            this.crmform.showNext(res.data.list[0].Id)
          })
        } else {
          message.info('没有下一条了!', 1);
          that.DialogCrmCustomerView.close()
          //close msg (noe more)
        }
      }
    }
  }

  onSelectChange = (selectedRowKeys) => {
    this.setState({selectedRowKeys});
  }

  //批量转入公海
  toPubBatch() {
    const that = this
    const {selectedRowKeys, searchParams} = this.state
    if (!selectedRowKeys.length) {
      message.error('请至少选择一个客户！', 1);
      return false
    }
    Confirm({
      handleOk: () => {
        putData('customers/toocean', selectedRowKeys).then(res => {
          if (res.status) {
            message.success('转出成功！', 1)
            this.onSearch(searchParams)
            this.setState({selectedRowKeys: []})
          }
        })
      },
      handleCancel() {
        console.log('onCancel')
        that.setState({selectedRowKeys: []})
      },
      message: '确定批量转入公海？'
    })
  }

  toOther = (row) => {
    let saler;
    Dialog({
      content: <div><span>选择销售:&nbsp;&nbsp;</span><SalerSelect onChange={v => {
        saler = v
      }}/></div>,
      width: 540,
      handleOk: () => {
        console.log(saler, 'saler')
        if (!saler) {
          message.error('请选择销售')
          return false
        }
        return new Promise((resolve, reject) => {
          putData(`customer/@/erp{row.Id}/@/erp{saler}`).then(res => {
            if (res.status) {
              message.success('转出成功！', 1)
              this.onSearch(this.state.searchParams)
            }
            resolve()
          })
        });
      },
      confirmLoading: false,
      handleCancel() {
        console.log('onCancel')
      },
      title: "转出-" + row.CompanyName
    }).result.then(() => {
      this.onSearch(this.state.searchParams);
    }, () => {
    });
  }
  //批量转入其他人/销售
  toOtherBatch() {
    const {selectedRowKeys, searchParams} = this.state
    if (!selectedRowKeys.length) {
      message.error('请至少选择一个客户！', 1);
      return false
    }
    let saler;
    Dialog({
      content: <div><span>选择销售:&nbsp;&nbsp;</span><SalerSelect onChange={v => {
        saler = v
      }}/></div>,
      width: 540,
      handleOk: () => {
        if (!saler) {
          message.error('请选择销售')
          return false
        }
        return new Promise((resolve, reject) => {
          putData(`customers/tosales/@/erp{saler}/my`, selectedRowKeys).then(res => {
            if (res.status) {
              message.info('转出成功！')
              this.onSearch(searchParams)
              this.setState({selectedRowKeys: []})

            }
            resolve()
          })
        });
      },
      confirmLoading: false,
      handleCancel() {
        console.log('onCancel')
      },
      title: "批量转出客户"
    }).result.then(() => {
      this.onSearch(this.state.searchParams);
    }, () => {
    });
  }

  //预约客户
  reservations() {
    const {selectedRowKeys, searchParams} = this.state
    if (!selectedRowKeys.length) {
      message.error('请至少选择一个客户！');
      return false
    }
    let dateStr
    Dialog({
      content: <DatePicker 
        onChange={(date, dateString) => {
            dateStr = dateString
          }
        }
        disabledDate={d=>d<moment()}
        />,
      width: 540,
      handleOk: () => {
        if (!dateStr) {
          message.error('请选择时间')
          return false
        }
        return new Promise((resolve, reject) => {
          putData(`customers/reservation?reservationDate=@/erp{dateStr}`, selectedRowKeys).then(res => {
            if (res.status) {
              message.success('预约成功！', 1)
              this.onSearch(searchParams)
              this.setState({selectedRowKeys: []})
            }
            resolve()
          })
        });
      },
      confirmLoading: false,
      handleCancel() {
        console.log('onCancel')
      },
      title: "请选择预约日期"
    }).result.then(() => {
      this.onSearch(searchParams);
    }, () => {
    });
  }

  componentWillMount() {
    this.onSearch();
    this.statistics()
  }

  render() {
    console.log(this.state.statisticsData)
    const {selectedRowKeys, statisticsData} = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };
    const columns = [{
      title: '客户名称',
      dataIndex: 'CompanyName',
      render: (val, row) => <div>
        { row.IsNew == 1? <span style={{color: 'red'}}>new&nbsp;</span>: null}
        <a href='javascript:;' onClick={e => {
          this.edit(row)
        }}>{val}</a>
      </div>
    }
      , {
        title: '联系人',
        dataIndex: 'Connector',
        width: 70
      }, {
        title: '意向度',
        dataIndex: 'CustomerTypeName',
        sorter: true
      }, {
        title: '注册时间',
        dataIndex: 'RegisterDate',
        render: val => fDate(val),
        sorter: true
      }, {
        title: '创建日期',
        dataIndex: 'CreateDate',
        render: val => fDate(val),
        width: 100,
        sorter: true
      }, {
        title: '首次跟踪时间',
        dataIndex: 'FirstTrackTime',
        render: val => (fDate(val) || '未开始'),
        width: 100,
        sorter: true
      }, {
        title: '最后跟踪时间',
        dataIndex: 'LastTrackTime',
        render: val => (fDate(val) || '未开始'),
        width: 100,
        sorter: true
      }, {
        title: '客户来源',
        dataIndex: 'Marking',
      }, {
        title: '销售',
        dataIndex: 'SalesName'
      },
      //     {
      //     title: '操作',
      //     render: (text, record) => (
      //         <Button.Group >
      //             <HasPower power="DETAIL"  key={"btn_DETAIL"} ><Button size="small" onClick={e=>{this.edit(record)}}>查看</Button></HasPower>
      //             <HasPower power="TOOTHER"  key={"btn_TOOTHER"} ><Button size="small" onClick={e=>{this.toOther(record)}}>客户转出</Button></HasPower>
      //             <HasPower power="TOPUB"  key={"btn_TOPUB"} ><Button size="small" onClick={e=>{this.toPub(record)}}>转到公海</Button></HasPower>
      //         </Button.Group>
      //     ),
      // }
    ];
    search.buttons = [
      <HasPower power="NEW" key="btn_addNew"><Button type="primary" onClick={this.addNew}
                                                     style={{margin: '0 8px'}}>新建</Button></HasPower>,
      <Button type="primary" key='btn_download'><a href='/files/template/customer.xlsx' target='_blank'>下载导入模版</a></Button>,
      <HasPower power="IMPORT" key="btn_IMPORT">
        <ImportData onChange={this.onUpload} style={{margin: '0 8px'}}/>
      </HasPower>]

    return (
      <div style={{position: 'relative'}}>
        <div className='table-row'>
          {statisticsData.length > 0 && statisticsData.map((item, index) => {
            return (
              <ul key={index}>
                <li>{index === 0 ? '意向度' : index === 1 ? '库容' : '当前客户数'}</li>
                <li>{item.Column1}</li>
                <li>{item.Column2}</li>
                <li>{item.Column3}</li>
                <li>{item.Column4}</li>
                <li>{item.Column5}</li>
                <li>{item.Column6}</li>
                <li>{item.Column7}</li>
              </ul>)
          })}
        </div>
        <SearchForm items={search.items} buttons={search.buttons} onSearch={this.onSearch}/>
        <Table columns={columns}
               rowKey={record => record.Id}
               dataSource={this.state.data}
               pagination={this.state.pagination}
               loading={this.state.loading}
               onChange={this.handleTableChange}
               size="middle"
               bordered={true}
               rowSelection={rowSelection}
        />
        <div style={{position: 'absolute', bottom: '10px'}}>
          <HasPower power="TOPUBALL" key="btn_TOPUBALL">
            <Button type="primary" onClick={this.toPubBatch}  style={{margin: '0 8px'}}>批量转入公海</Button>
          </HasPower>
          <HasPower power="TOOTHERALL" key="btn_TOOTHERALL">
            <Button type="primary" onClick={this.toOtherBatch} style={{margin: '0 8px'}}>批量转其他人</Button>
          </HasPower>
          <Button type="primary" onClick={this.reservations.bind(this)} style={{margin: '0 8px'}}>预约客户</Button>
        </div>
      </div>
    );
  }
}

export default Main
