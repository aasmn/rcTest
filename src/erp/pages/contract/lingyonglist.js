import React, { Component } from 'react'
import SearchForm from '@/erp/container/SearchForm'
import { Tabs, Icon, Button, message } from 'antd'

import OrderTable from '@/erp/container/Contract/OrderTable'

import _ from 'lodash'
import { fLingYongStatus, fDate } from '@/erp/config/filters'

import Dialog from '@/erp/container/Dialog'
import SalerSelect from '@/erp/container/searchComponent/SalerSelect'
import LingYongSelect from '@/erp/container/searchComponent/LingYongSelect'
import RIf from '@/erp/component/RIF'
import { deleteData, postData, putData } from '@/erp/api'
import LingYongDialog from '@/erp/container/Contract2/LingYongDialog'
import store from '@/erp/store'
import Prompt from '@/erp/component/Prompt'
import Confirm from '@/erp/component/Confirm'
import HasPower from '@/erp/container/HasPower'
const TabPane = Tabs.TabPane;

let search = {
  items: [{
    label: '甲方/联系人',
    type: 'text',
    field: 'companyNameOrLinkMan',
    tab: '12'
  }, {
    label: '合同/领用单号',
    type: 'text',
    field: 'contractNoOrReceiveBillNo',
    tab: '12'
  }, {
    label: '签单销售',
    type: 'custom',
    field: 'orderSalesName',
    view: SalerSelect,
    more: true,
    tab: '12'
  }, {
    label: '领用人',
    type: 'custom',
    field: 'aplicant',
    view: LingYongSelect,
    more: true,
    tab: '12'
  }, {
    label: '审核状态',
    type: 'select',
    field: 'auditStatus',
    data: {
      ' ': "全部",
      2: "主管驳回",
      3: "主管审核",
      4: "财务打款失败",
      5: "财务打款",
      6: "结束"
    },
    defaultValue: ' ',
    more: true,
    tab: '2'
  }, {
    label: '创建日期',
    type: 'date',
    field: 'craeteDate_s',
    more: true,
    tab: '12'
  }, {
    label: '至',
    type: 'date',
    field: 'createDate_e',
    more: true,
    tab: '12'
  }],
  buttons: []
};

class Main extends Component {
  constructor (props) {
    super(props);
    this.state = {
      searchParams1: {},
      searchParams2: {}
    };
    this.onSearch = this.onSearch.bind(this);
    this.onSearch1 = this.onSearch1.bind(this);
    this.onSearch2 = this.onSearch2.bind(this);
    this.viewOrder = this.viewOrder.bind(this);
  }
  onSearch () {
    this.onSearch1(this.state.searchParams1);
    this.onSearch2(this.state.searchParams2);
  }
  onSearch1 (res) {
    if (!res) res = this.state.searchParams1;
    const params = { ...res };
    params._id = _.uniqueId('sq_');
    this.setState({ searchParams1: params });
  }
  onSearch2 (res) {
    if (!res) res = this.state.searchParams2;
    const params = { ...res };
    params._id = _.uniqueId('sq_');
    this.setState({ searchParams2: params });
  }
  onPass = (row, dialog) => {
    Prompt({
      title: '审核意见',
      handleOk: (resStr) => {
        if (!resStr) {
          message.error('请填写审核意见');
          return false;
        }
        return new Promise((resolve, reject) => {
          const state = store.getState();
          if (!(/(\{.*\})$/.test(_.trim(resStr)))) {
            resStr = resStr + '{' + state.common.user.RealName + '}';
          }
          putData('receivebill/approval?billId=' + row.Id, {
            Remark: resStr
          }).then(res => {
            if (res.status) {
              message.info('审核成功！');
              dialog.close()
              resolve();
            }
          })
        });
      }
    });
  }
  onReject = (row, dialog) => {
    Prompt({
      title: '驳回原因',
      handleOk: (resStr) => {
        return new Promise((resolve, reject) => {
          const state = store.getState();
          if (resStr && !(/(\{.*\})$/.test(_.trim(resStr)))) {
            resStr = resStr + '{' + state.common.user.RealName + '}';
          }
          putData('receivebill/rejected?billId=' + row.Id, {
            Remark: resStr || ""
          }).then(res => {
            if (res.status) {
              message.info('驳回成功！');
              dialog.close()
              resolve();
            }
          })
        });
      }
    });
  }
  viewOrder (row) {
    const dialog = Dialog({
      content: <div>
        <div style={{ textAlign: 'right' }}>
          {row.AuditStatus === 3 && <HasPower power="EDIT"><Button.Group><Button type="primary" onClick={e => { this.onPass(row, dialog) }}>审核</Button><Button type="primary" onClick={e => { this.onReject(row, dialog) }}>驳回</Button></Button.Group></HasPower>}
        </div>
        <LingYongDialog close={() => { dialog.close(true) }} data={row} ref={v => { v && (v.handler = dialog) }} />
      </div>,
      width: 1100,
      confirmLoading: false,
      footer: null,
      title: row.CompanyName
    })
    dialog.result.then(() => {
      this.onSearch();
    }, () => {
      // this.onSearch(this.state.searchParams);
    });

  }
  delete = (row) => {
    Confirm({
      handleOk: () => {
        deleteData('receivebill/del?billId=' + row.Id).then(res => {
          res.status && message.info('操作成功！')
        })
        this.onSearch()
        return true;
      },
      message: '确定要删除此条记录吗？'
    })

  }
  render () {
    const columns = [{
      title: '领用单号',
      dataIndex: 'BillNo',
      width: 160,
      render: (val, record) => {
        return (<div style={{ position: "relative" }}>
          <RIf if={record.AuditStatus < 4} key={val + '_1'}><Icon type="close-circle" className="list-close-icon" onClick={e => { this.delete(record) }} /></RIf>
          <a href="javascript:;" onClick={e => this.viewOrder(record)} style={{ float: 'right' }}>{val}</a>
        </div>);
      },
      tab: '12',
    }, {
      title: '甲方',
      dataIndex: 'CompanyName',
      tab: '12',
    }, {
      title: '联系人',
      dataIndex: 'Connector',
      tab: '12',
    }, {
      title: '领用人',
      dataIndex: 'Aplicant',
      tab: '12',
    }, {
      title: '操作人',
      dataIndex: 'Handler',
      tab: '12',
    }, {
      title: '申请金额',
      dataIndex: 'ReceiveAmount',
      tab: '12',
    }, {
      title: '签订日期',
      dataIndex: 'CreateDate',
      tab: '12',
      render: fDate
    }, {
      title: '审核状态',
      dataIndex: 'AuditStatus',
      tab: '12',
      render: (val) => fLingYongStatus(val)
    }];
    const searchItems1 = _.filter(search.items, t => (t.tab.indexOf('1') > -1));
    const searchItems2 = _.filter(search.items, t => (t.tab.indexOf('2') > -1));
    const columns1 = _.filter(columns, t => (t.tab.indexOf('1') > -1));
    const columns2 = _.filter(columns, t => (t.tab.indexOf('2') > -1));
    return (
      <div>
        <Tabs defaultActiveKey="NOALL">
          <TabPane tab="待处理" key="NOALL" forceRender={true}>
            <SearchForm items={searchItems1} buttons={search.buttons} onSearch={this.onSearch1} />
            <OrderTable keyStr="BillId" SearchParams={this.state.searchParams1} searchUrl="receivebill/list" columns={columns1} isAll={false} />
          </TabPane>
          <TabPane tab="全部" key="ALL" forceRender={true}>
            <SearchForm items={searchItems2} buttons={search.buttons} onSearch={this.onSearch2} />
            <OrderTable keyStr="BillId" SearchParams={this.state.searchParams2} searchUrl="receivebill/list" columns={columns2} isAll={true} />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default Main
