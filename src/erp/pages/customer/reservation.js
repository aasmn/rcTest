import React, {Component} from 'react'
import {Table, Button, message} from 'antd'
import {fDate} from '@/erp/config/filters'
import CustomerType from '@/erp/container/searchComponent/CustomerType'
import CustomerSourceSelect from '@/erp/container/searchComponent/CustomerSourceSelect'
import SearchForm from '@/erp/container/SearchForm'
import {getListData, postData, putData, deleteData} from '@/erp/api'
import CrmCustomer from '@/erp/component/CrmCustomer'
import CrmCustomerRepeatWarning from '@/erp/container/CrmCustomerRepeatWarning'
import CrmCustomerView from '@/erp/container/CrmCustomerView'
import Dialog from '@/erp/container/Dialog'
import _ from 'lodash'
import Confirm from '@/erp/component/Confirm'

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

let search = {
  items: [{
    label: '客户名称/联系人',
    type: 'text',
    field: 'companyName'
  },  {
    label: '移动电话',
    type: 'text',
      field: 'phone',
      more: true
  }, {
    label: '意向度',
    type: 'custom',
    field: 'CustomerTypeId',
    view: CustomerType,
      defaultValue: '0'
  }, {
    label: '客户来源',
    type: 'custom',
    field: 'CustomerSourceId',
    view: CustomerSourceSelect,
      defaultValue: '0',
      more: true
  }, {
    label: '预约日期',
    type: 'date',
      field: 'reservation_time_s',
      more: true
  }, {
    label: '至',
    type: 'date',
      field: 'reservation_time_e',
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

class DialogScan extends Component {
  constructor(props) {
    super(props);
    this.state = {loading: false}
  }

  onClose = () => {
    this.props.onClose
  }

  onNext = () => {
    this.setState({loading: true})
    this.props.onNext().then(res => {
      this.setState({loading: false})
    })
  }

  render() {
    return (
      [<Button key="back" type="primary" onClick={this.props.onClose}>关闭</Button>,
        <Button key="toput" type="primary" loading={this.state.loading} onClick={this.onNext.bind(this)}>下一条</Button>
      ])
  }
}

class ReservationMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
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
    this.handleTableChange = this.handleTableChange.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.openDialog = this.openDialog.bind(this);
    this.edit = this.edit.bind(this);
    this.pickCustomer = this.pickCustomer.bind(this)
  }

  handleTableChange(pagination, filter, sorter) {
    this.setState({pagination: pagination}, () => {
      this.onSearch(this.state.searchParams, sorter)
    })
  }

  onSearch(vals = {}, sorter) {
    this.setState({searchParams: vals, loading: true});
    const pagination = this.state.pagination;
    if (!_.isEqual(vals, this.state.searchParams)) {
      pagination.current = 1
    }
    vals.limit = pagination.pageSize;
    vals.offset = (pagination.current - 1) * pagination.pageSize;
    if(sorter && sorter.field) {
      vals.sort = `@/erp{sorter.field}_@/erp{sorter.order === 'descend' ? 'DESC' : 'ASC'}`
    }
    vals.type = 'yy'
    return getListData('Customer', vals).then(res => {
      if (res.status) {
        const pagination = {...this.state.pagination};
        pagination.total = res.data.total;
        this.setState({
          loading: false,
          data: res.data.list,
          pagination,
        });
      }
      return res;
    }, err => {
      this.setState({
        loading: false
      });
    })
  }

  componentWillMount() {
    this.onSearch();
  }

  openDialog(customer, title, width) {
    Dialog({
      content: <CrmCustomer data={customer} wrappedComponentRef={crmform => {
        this.crmform = crmform
      }}/>,
      width: width || 540,
      handleOk: () => {
        return new Promise((resolve, reject) => {
          const formValues = this.crmform.getFieldsValue()
          if (formValues) {
            formValues.CustomerTypeId = 5;
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
                    handleOk() {
                      return true
                    },
                    confirmLoading: false,
                    handleCancel() {
                      console.log('onCancel')
                    },
                    title: '新增客户'
                  }).result.then(() => {
                    postData('customer?verify=1', formValues).then(res => {
                      message.info('保存成功！')
                      resolve()
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
            });
          } else {
            reject();
          }
        });
      },
      confirmLoading: false,
      handleCancel() {
        console.log('onCancel')
      },
      title: title
    }).result.then(() => {
      this.onSearch(this.state.searchParams)
    }, () => {
    });
  }

  showNext = (id) => {
    const that = this
    that.crmform.refs.CustomerTrack.resetValue();
    that.crmform.refs.RemindDate.resetValue();
    that.crmform.resetTagSelected();
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

  pickCustomer(row) {
    console.log(row)
    putData('opencustomer/' + row.Id + '/6').then((res) => {
      if (res.status) {
        message.info('操作成功！')
        this.onSearch(this.state.searchParams)
      }
    })
  }

  deleteItem(row) {
    Confirm({
      handleOk: () => {
        deleteData('opencustomer/' + row.Id).then((res) => {
          if (res.status) {
            message.info('删除成功！')
            this.onSearch(this.state.searchParams)
          }
        })
      },
      message: '确认要删除吗？'
    })
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
                if (data.errorcode == 1) {
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
                      message.info('保存成功！')
                      resolve()
                      that.saveCustomerTrack(customer.Id)
                    })
                  }, () => {
                    resolve()
                  });

                }
              } else {
                // message.info('保存成功！')
                resolve()
                that.saveCustomerTrack(customer.Id)
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
          that.showNext(customerId)
        }
      })
  }

  render() {
    const columns = [{
      title: '客户名称',
      dataIndex: 'CompanyName',
      render: (val, row) => <a href='javascript:;' onClick={this.edit.bind(this, row, 'pub')}>{val}</a>
    }, {
      title: '联系人',
      dataIndex: 'Connector',
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
      sorter: true
    }, {
      title: '预约时间',
      dataIndex: 'ReservationDate',
      render: val => fDate(val),
      sorter: true
    }, {
      title: '首次跟踪时间',
      dataIndex: 'FirstTrackTime',
      render: val => fDate(val),
      sorter: true
    }, {
      title: '最后跟踪时间',
      dataIndex: 'LastTrackTime',
      render: val => fDate(val),
      sorter: true
    }, {
      title: '客户来源',
      dataIndex: 'Marking',
    }];

    search.buttons = []
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

export default ReservationMain
