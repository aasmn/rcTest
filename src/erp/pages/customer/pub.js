import React, {Component} from 'react'
import {Table, Button, message} from 'antd'
import {fDate} from '@/erp/config/filters'
import HasPower from '@/erp/container/HasPower'
import ImportData from '@/erp/container/searchComponent/ImportDataPub'
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

let search = {
  items: [
    {
      label: '客户名称/联系人',
      type: 'text',
      field: 'companyname'
    },
    {
      label: '联系电话',
      type: 'text',
      field: 'phone',
      more: true
    },
    {
      label: '历史意向度',
      type: 'custom',
      field: 'hisCusTypeId',
      view: CustomerType,
      defaultValue: '0'
    },
    {
      label: '客户来源',
      type: 'custom',
      field: 'CustomerSourceId',
      view: CustomerSourceSelect,
      defaultValue: '0',
      more: true
    },
    {
      label: '创建日期',
      type: 'date',
      field: 'createstart',
      more: true
    },
    {
      label: '至',
      type: 'date',
      field: 'createend',
      more: true
    },
    {
      label: '释放公海日期',
      type: 'date',
      field: 'release_time_s',
      more: true
    }, {
      label: '至',
      type: 'date',
      field: 'release_time_e',
      more: true
    }
  ],
  buttons: []
};

class DialogScan extends Component {
  constructor(props) {
    super(props);
    this.state = {loading: false}
  }

  pickCustomerAndNext = () => {
    this.props.pickCustomerAndNext
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
      [
        <Button key="back" type="primary" onClick={this.props.pickCustomerAndNext}>抢客户&下一条</Button>,
        <Button key="toput" type="primary" loading={this.state.loading} onClick={this.onNext.bind(this)}>下一条</Button>,
        <Button key="back" type="primary" onClick={this.props.onClose}>关闭</Button>
      ])
  }
}

class PubMain extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
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
    this.handleTableChange = this.handleTableChange.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.openDialog = this.openDialog.bind(this);
    this.addNew = this.addNew.bind(this);
    this.edit = this.edit.bind(this);
    this.pickCustomer = this.pickCustomer.bind(this)
    this.onUpload = this.onUpload.bind(this)
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
    return getListData('opencustomer', vals).then(res => {
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

  addNew() {
    this.openDialog({}, '新增客户')
  }

  //查看客户详情
  edit(row, type = '') {
    let current = row.Id;
    const that = this
    console.log(row.CompanyName, 'CompanyName')
    const closeDialog = () => {
      d.close()
    }
    const next = () => {
      const that = this;
      return new Promise((resolve, reject) => {
        that.crmform.saveCustomer().then(customer => {
          resolve()
          that.showNext(customer.Id)
        })
      });
    }
    const pickCustomerAndNext = () => {
      that.pickCustomer(row)
        .then(res => {
          // if (res.status) {
            next()
          // }
          console.log(res)
        })
    }
    const d = Dialog({
      content: <CrmCustomerView type={type} customerId={row.Id} ref={crmform => {
        this.crmform = crmform
      }} readOnly={true}/>,
      width: 1100,
      confirmLoading: false,
      handleCancel: () => true,
      handleOk: () => true,
      title: '',
      footer: <DialogScan pickCustomerAndNext={pickCustomerAndNext} onClose={closeDialog} onNext={next}/>
    })
    this.DialogCrmCustomerView = d
    d.result.then(() => {
      this.onSearch(this.state.searchParams)
    }, () => {
      this.onSearch(this.state.searchParams)
    });
  }

  showNext = (id) => {
    const that = this
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
  // 抢客户
  pickCustomer(row) {
    console.log(row)
    return putData(`customers/tosales/@/erp{this.props.curUser.Id}/gh`, [row.Id])
      .then(res => {
        if (res.status) {
          message.info(res.data)
          this.onSearch(this.state.searchParams)
        }
        return res
      })
  }

  //删除
  deleteItem(row) {
    Confirm({
      handleOk: () => {
        deleteData(`opencustomer/@/erp{row.Id}`)
          .then(res => {
            if (res.status) {
              message.info('删除成功！')
              this.onSearch(this.state.searchParams)
            }
          })
      },
      message: '确认要删除吗？'
    })
  }

  onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({selectedRowKeys});
  }
  // 批量抢客户
  toGrabBatch() {
    const {selectedRowKeys} = this.state
    if (!selectedRowKeys) {
      message.error('请至少选择一个客户！');
      return false
    }
    putData(`customers/tosales/@/erp{this.props.curUser.Id}/gh`, selectedRowKeys)
      .then(res => {
        if (res.status) {
          message.info(res.data)
          this.onSearch(this.state.searchParams)
        }
      })
  }

  render() {
    const columns = [{
      title: '客户名称',
      dataIndex: 'CompanyName',
      render: (val, row) => <div>
        { row.IsNew != 0? <span style={{color: 'red'}}>new&nbsp;</span>: null}
        <a href='javascript:;' onClick={this.edit.bind(this, row, 'pub')}>{val}</a>
      </div>
    },
      {title: '联系人', dataIndex: 'Connector'},
      {title: '历史意向度', dataIndex: 'cusTypeName', sorter: true},
      {title: '注册时间', dataIndex: 'RegisterDate', render: val => fDate(val), sorter: true},
      {title: '创建日期', dataIndex: 'CreateDate', render: val => fDate(val), sorter: true},
      {title: '释放公海时间', dataIndex: 'ModifyDate', render: val => fDate(val), sorter: true},
      {title: '释放时的销售', dataIndex: 'SalesName'},
      {title: '客户来源', dataIndex: 'CustomerSourceText'},
      {
        title: '操作',
        render: (text, record) => (
          <Button.Group>
            <HasPower power="GETCUS" key={"btn_GETCUS"}>
              <Button size="small" onClick={e => {
                this.pickCustomer(record)
              }}>抢客户</Button>
            </HasPower>
            <HasPower power="DELETE" key={"btn_DELETE"}>
              <Button size="small" onClick={e => {
                this.deleteItem(record)
              }}>删除</Button>
            </HasPower>
          </Button.Group>
        ),
      }];
    search.buttons = [
      <Button type="primary" key='btn_download' style={{margin: '0 8px'}}><a href='/files/template/customer.xlsx' target='_blank'>下载导入模版</a></Button>,
      <HasPower power="IMPORT" key="btn_IMPORT">
        <ImportData onChange={this.onUpload} style={{margin: '0 8px'}}/>
      </HasPower>
    ]
    const {selectedRowKeys} = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    return (
      <div style={{position: 'relative'}}>
        <SearchForm items={search.items} buttons={search.buttons} onSearch={this.onSearch}/>
        <Table columns={columns}
               rowKey={record => record.Id}
               dataSource={this.state.data}
               rowSelection={rowSelection}
               pagination={this.state.pagination}
               loading={this.state.loading}
               onChange={this.handleTableChange}
               size="middle"
               bordered={true}
        />
        <div style={{position: 'absolute', bottom: '10px'}}>
          <Button type="primary" onClick={this.toGrabBatch.bind(this)} style={{margin: '0 8px'}}>批量抢客户</Button>
        </div>
      </div>
    );
  }
}

export default PubMain
