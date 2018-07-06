/**
 * Created by wanchao on 2018/5/4.
 */
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import {
  Row,
  Col,
  Form,
  Input,
  Icon,
  Select,
  DatePicker,
  Checkbox,
  Button,
  Card,
  Modal,
  message
} from 'antd'
import styles from '@/stylus/company'
import http from '../../utils/http'
import UploadFile from '../../containers/UploadFile'
const FormItem = Form.Item
const Option = Select.Option
const ButtonGroup = Button.Group
const { TextArea, Search } = Input

const ADDED_VALUE_MAP = {
  '1': '小规模',
  '2': '一般纳税人'
}

const INFO_SOURCE_MAP = {
  '0': '其他',
  '1': '天眼查',
  '2': '国家信息公示网',
  '3': '特殊公司'
}

class Company extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      // 是否编辑状态
      isEdit: false,
      // 是否特殊公司
      isSpecial: false,
      // 显示模态框
      isModalVisible: false,
      // 直营公司列表
      subsidiary: [],
      // 选中的直营公司
      selectSubsidiary: {},
      // 区域列表
      areas: [],
      // 选中的区域
      selectArea: {},
      // 销售列表
      sales: [],
      // 选中的销售
      selectSales: {},
      // 当前公司的服务信息
      serviceInfo: {},
      // 当前公司的公司信息
      companyInfo: {},
      // 天眼查公司查询列表
      companyList: [],
      // 选中的天眼查公司
      selectCompany: {}
    }
    this.getCompany = this.getCompany.bind(this)
    this.getSubsidiaryList = this.getSubsidiaryList.bind(this)
    this.getAreaList = this.getAreaList.bind(this)
    this.getSalesList = this.getSalesList.bind(this)
    this.subsidiaryChange = this.subsidiaryChange.bind(this)
    this.areaChange = this.areaChange.bind(this)
    this.salesChange = this.salesChange.bind(this)
    this.toggleSpecial = this.toggleSpecial.bind(this)
    this.searchCompany = this.searchCompany.bind(this)
    this.dateChange = this.dateChange.bind(this)
    this.checkboxChange = this.checkboxChange.bind(this)
    this.searchCompanyChange = this.searchCompanyChange.bind(this)
    this.getCompanyDetail = this.getCompanyDetail.bind(this)
    this.getCompanyDetailByUrl = this.getCompanyDetailByUrl.bind(this)
    this.toggleEdit = this.toggleEdit.bind(this)
    this.toggleModal = this.toggleModal.bind(this)
    this.licenseChange = this.licenseChange.bind(this)
    this.init = this.init.bind(this)
  }
  static get propTypes () {
    return {
      companyId: PropTypes.any.isRequired,
      setCompanyName: PropTypes.func.isRequired
    }
  }
  // 获取直营公司列表
  async getSubsidiaryList () {
    const url = `/api/subsidiaries`
    const { status, data } = await http(url)
    if (status && Array.isArray(data)) {
      this.setState({
        subsidiary: data
      })
    }
  }
  // 获取公司信息
  async getCompany () {
    const { companyId } = this.props
    const url = `/api/customer/${companyId}`
    const { status, data } = await http(url)
    if (status) {
      let { SubsidiaryId, Connector, Mobile, Telephone, AreaCode, SalesId, AddedValue, LegalPerson, CompanyName, RegNO, RegCode, RegisteredCapital, BusinessLicense, RegisterDate, BusnissDeadline, NoDeadLine, Address, BusinessScope, ServiceCompanyCode, InfoSource = 0 } = data
      const selectSubsidiary = this.state.subsidiary.find(item => item.SubsidiaryId === SubsidiaryId) || this.state.subsidiary[0]
      if (NoDeadLine === null) {
        NoDeadLine = 0
      }
      // 初始化选中直营公司
      this.setState({
        selectSubsidiary,
        serviceInfo: {
          SubsidiaryId,
          Connector,
          Mobile,
          Telephone,
          AreaCode,
          SalesId,
          AddedValue
        },
        companyInfo: {
          InfoSource,
          CompanyName,
          LegalPerson,
          RegNO,
          RegCode,
          RegisteredCapital,
          BusinessLicense,
          RegisterDate,
          BusnissDeadline,
          NoDeadLine,
          Address,
          ServiceCompanyCode,
          BusinessScope
        }
      })
      // 设置公司名称
      this.props.setCompanyName(CompanyName)
    }
  }
  // 获取区域列表
  async getAreaList (cityCode) {
    if (!cityCode) {
      return []
    }
    const { AreaCode: areaCode } = this.state.serviceInfo
    const url = `/api/areas/${cityCode}`
    const { status, data } = await http(url)
    if (status && Array.isArray(data)) {
      const selectArea = data.find(item => item.AreaCode === areaCode) || data[0]
      this.setState({
        areas: data,
        selectArea
      })
    }
  }
  // 获取销售列表
  async getSalesList (subsidiaryId) {
    if (!subsidiaryId) {
      return []
    }
    const { SalesId: salesId } = this.state.serviceInfo
    const url = `/api/sales/${subsidiaryId}`
    const { status, data } = await http(url)
    if (status && Array.isArray(data)) {
      const selectSales = data.find(item => item.Id === salesId) || data[0]
      this.setState({
        sales: data,
        selectSales
      })
    }
  }
  // 切换直营公司
  async subsidiaryChange (subsidiary) {
    const selectSubsidiary = this.state.subsidiary.find(item => item.CompanyName === subsidiary)
    const { SubsidiaryId: subsidiaryId, CityCode: cityCode } = selectSubsidiary
    // 获取直营公司所在地的区域列表和销售列表
    await Promise.all([
      this.getAreaList(cityCode),
      this.getSalesList(subsidiaryId)
    ])
    this.setState({
      selectSubsidiary
    })
  }
  // 切换区域
  areaChange (areaName) {
    const selectArea = this.state.areas.find(item => item.AreaName === areaName)
    this.setState({
      selectArea
    })
  }
  // 切换销售
  salesChange (id) {
    const selectSales = this.state.sales.find(item => item.Id === id)
    this.setState({
      selectSales
    })
  }
  // 切换特殊公司状态
  toggleSpecial () {
    this.setState({
      isSpecial: true,
      companyInfo: {
        ...this.state.companyInfo,
        // 特殊公司
        InfoSource: 3
      }
    })
  }
  // 日期变化
  dateChange (attr, date, dateString) {
    this.setState({
      companyInfo: {
        ...this.state.companyInfo,
        [attr]: dateString
      }
    })
  }
  // 多选框变化
  checkboxChange (e) {
    const NoDeadLine = e.target.checked ? 1 : 0
    this.setState({
      companyInfo: {
        ...this.state.companyInfo,
        NoDeadLine
      }
    })
  }
  // 根据公司名称查询公司信息
  async searchCompany () {
    const { CompanyName: name } = this.state.companyInfo
    if (!name) {
      return []
    }
    const size = 5
    const url = `/api/customer/listindispatch?name=${name}&size=${size}`
    const { status, data } = await http(url)
    if (status && Array.isArray(data)) {
      this.setState({
        companyList: data
      })
    }
  }
  // 获取公司详情
  async getCompanyDetail (name) {
    const selectCompany = this.state.companyList.find(item => item.name === name)
    this.setState({
      selectCompany,
      companyInfo: {
        ...this.state.companyInfo,
        CompanyName: name
      }
    })
    // 获取公司详情
    const { id } = selectCompany
    const url = `/api/customer/infoindispatch?id=${id}`
    const { status, data } = await http(url)
    if (status) {
      const companyInfo = {
        ...this.state.companyInfo,
        ...data,
        // 天眼
        InfoSource: 1
      }
      this.setState({
        companyInfo
      })
    }
  }
  // 获取公司详情通过url
  async getCompanyDetailByUrl (name) {
    if (!name) {
      return
    }
    const url = `/api/customer/listincredit?name=${name}`
    const { status, data } = await http(url)
    if (status && data) {
      const companyInfo = {
        ...this.state.companyInfo,
        ...data,
        // 国家信息公示网
        InfoSource: 2
      }
      this.setState({
        companyInfo,
        // 隐藏modal
        isModalVisible: false
      }, () => {
        console.log(this.state.companyInfo)
      })
    }
  }
  searchCompanyChange (e) {
    this.setState({
      companyInfo: {
        ...this.state.companyInfo,
        CompanyName: e
      }
    })
  }
  // toggle模态框
  toggleModal () {
    this.setState({
      isModalVisible: !this.state.isModalVisible
    })
  }
  // license变更
  licenseChange (path) {
    this.state({
      companyInfo: {
        ...this.state.companyInfo,
        BusinessLicense: path
      }
    })
  }
  // 修改公司信息
  toggleEdit (flag) {
    // flag为false，则为保存
    if (!flag) {
      this.props.form.validateFields(async (err, values) => {
        if (err) {
          return
        }
        const { serviceInfo, companyInfo, selectSubsidiary, selectArea, selectSales } = this.state
        // SubsidiaryId, SalesId, AreaCode为文本，需要找到对应的id
        Object.assign(values, {
          SubsidiaryId: selectSubsidiary.SubsidiaryId,
          SalesId: selectSales.Id,
          AreaCode: selectArea.AreaCode
        })
        const params = {
          ...companyInfo,
          ...serviceInfo,
          ...values
        }
        console.log(params, 'params')
        if (this.state.isSpecial && !params.BusinessScope) {
          message.error('请输入经营范围！')
          return false
        }
        const url = `/api/customer/update/${this.props.companyId}?isOrder=0`
        const { status } = await http(url, 'PUT', {
          data: params
        })
        if (status) {
          // 初始化公司
          this.init()
          // 设置编辑状态
          this.setState({
            isEdit: false,
            isSpecial: false
          })
        }
      })
    } else {
      this.setState({
        isEdit: true,
        isSpecial: false
      })
    }
  }
  async init () {
    this.getCompany().then(() => {
      const { CityCode: cityCode, SubsidiaryId: subsidiaryId } = this.state.selectSubsidiary
      Promise.all([
        this.getAreaList(cityCode),
        this.getSalesList(subsidiaryId)
      ])
    })
  }
  componentWillMount () {
    this.getSubsidiaryList().then(() => {
      this.init()
    })
  }
  render () {
    const { getFieldDecorator } = this.props.form
    const { isEdit, isSpecial, isModalVisible, subsidiary, selectSubsidiary, sales, selectSales, areas, selectArea, serviceInfo, companyInfo, companyList } = this.state
    const editNode = (
      <div className={styles['edit-container']}>
        {
          isEdit ? <Button className={styles['btn']} type="primary" onClick={this.toggleEdit.bind(this, false)}>保存</Button> : <Icon className={styles['icon']} type="edit" onClick={this.toggleEdit.bind(this, true)} />
        }
      </div>
    )
    return (
      <div className={styles['company']}>
        <Card title="基本信息" extra={editNode}>
          <Form>
            {
              isEdit ? <div className={styles['edit-rows']}>
                <Row >
                  <Col span={6}>
                    <FormItem label="所属直营" className={styles['company-col-item']}>
                      {getFieldDecorator('SubsidiaryId', {
                        initialValue: selectSubsidiary.CompanyName
                      })(
                        <Select style={{ width: 160 }} onChange={this.subsidiaryChange}>
                          {
                            subsidiary.map(item => <Option key={item.SubsidiaryId} value={item.CompanyName}>{item.CompanyName}</Option>)
                          }
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={6}>
                    <FormItem label="联系人" className={styles['company-col-item']}>
                      {getFieldDecorator('Connector', {
                        rules: [{
                          required: true,
                          message: '联系人不能为空!'
                        }],
                        initialValue: serviceInfo.Connector
                      })(
                        <Input />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={6}>
                    <FormItem label="联系电话" className={styles['company-col-item']}>
                      {getFieldDecorator('Mobile', {
                        rules: [{
                          required: true,
                          message: '联系电话不能为空!'
                        }, {
                          pattern: /^1[3-9]\d{9}$/,
                          message: '联系电话格式不正确!'
                        }],
                        initialValue: serviceInfo.Mobile
                      })(
                        <Input />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={6}>
                    <FormItem label="座机" className={styles['company-col-item']}>
                      {getFieldDecorator('Telephone', {
                        initialValue: serviceInfo.Telephone
                      })(
                        <Input />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row >
                  <Col span={6}>
                    <FormItem label="负责销售" className={styles['company-col-item']}>
                      {getFieldDecorator('SalesId', {
                        initialValue: selectSales.RealName
                      })(
                        <Select style={{ width: 160 }} onChange={this.salesChange}>
                          {
                            sales.map(item => <Option key={item.Id} value={item.Id}>{item.RealName}</Option>)
                          }
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={6}>
                    <FormItem label="区域" className={styles['company-col-item']}>
                      {getFieldDecorator('AreaCode', {
                        initialValue: selectArea.AreaName
                      })(
                        <Select style={{ width: 160 }} onChange={this.areaChange}>
                          {
                            areas.map(item => <Option key={item.ItemId} value={item.AreaName}>{item.AreaName}</Option>)
                          }
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={6} className={styles['company-col']}>
                    <label>
                      纳税人类别：
                    </label>
                    <span>
                      {ADDED_VALUE_MAP[serviceInfo.AddedValue]}
                    </span>
                  </Col>
                </Row>
              </div> : <div className={styles['unedit-rows']}>
                <Row >
                  <Col span={6}>
                    <label>
                      所属直营：
                    </label>
                    <span>
                      {selectSubsidiary.CompanyName}
                    </span>
                  </Col>
                  <Col span={6}>
                    <label>
                      联系人：
                    </label>
                    <span>
                      {serviceInfo.Connector}
                    </span>
                  </Col>
                  <Col span={6}>
                    <label>
                      联系电话：
                    </label>
                    <span>
                      {serviceInfo.Mobile}
                    </span>
                  </Col>
                  <Col span={6}>
                    <label>
                      座机：
                    </label>
                    <span>
                      {serviceInfo.Telephone}
                    </span>
                  </Col>
                </Row>
                <Row >
                  <Col span={6}>
                    <label>
                      负责销售：
                    </label>
                    <span>
                      {selectSales.RealName}
                    </span>
                  </Col>
                  <Col span={6}>
                    <label>
                      区域：
                    </label>
                    <span>
                      {selectArea.AreaName}
                    </span>
                  </Col>
                  <Col span={6}>
                    <label>
                      纳税人类别：
                    </label>
                    <span>
                      {ADDED_VALUE_MAP[serviceInfo.AddedValue]}
                    </span>
                  </Col>
                </Row>
              </div>
            }
            {
              isEdit ? <div className={styles['company-detail']}>
                <Row >
                  <Col span={12}>
                    <FormItem label="公司名称" className={styles['company-col-item']}>
                      {getFieldDecorator('CompanyName', {
                        initialValue: companyInfo.CompanyName
                      })(
                        <Select
                          mode="combobox"
                          style={{width: 180}}
                          value={companyInfo.CompanyName}
                          defaultActiveFirstOption={false}
                          showArrow={false}
                          filterOption={false}
                          onSearch={this.searchCompanyChange}
                          onSelect={this.getCompanyDetail}
                        >
                          {
                            companyList.map(item => <Option key={item.id} value={item.name}>{item.name}</Option>)
                          }
                        </Select>
                      )}
                      {
                        isSpecial ? null : <ButtonGroup>
                          <Button type="primary" onClick={this.searchCompany}>查 询</Button>
                          <Button type="primary" onClick={this.toggleModal}>网 址</Button>
                          <Button type="primary" onClick={this.toggleSpecial}>特殊公司</Button>
                        </ButtonGroup>
                      }
                    </FormItem>
                  </Col>
                  <Col span={6}>
                    <FormItem label="法人姓名" className={styles['company-col-item']}>
                      {getFieldDecorator('LegalPerson', {
                        initialValue: companyInfo.LegalPerson
                      })(
                        <Input disabled={!isSpecial} />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={6}>
                    <FormItem label="统一社会信用代码" className={styles['company-col-item']}>
                      {getFieldDecorator('RegNO', {
                        initialValue: companyInfo.RegNO
                      })(
                        <Input disabled={!isSpecial} />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row >
                  <Col span={6}>
                    <FormItem label="注册号" className={styles['company-col-item']}>
                      {getFieldDecorator('RegCode', {
                        initialValue: companyInfo.RegCode
                      })(
                        <Input disabled={!isSpecial} />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={6}>
                    <FormItem label="注册资金" className={styles['company-col-item']}>
                      {getFieldDecorator('RegisteredCapital', {
                        initialValue: companyInfo.RegisteredCapital
                      })(
                        <Input disabled={!isSpecial} />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem
                      label="营业执照"
                      labelCol={{span: 3}}
                      wrapperCol={{span: 21}}
                    >
                      {getFieldDecorator('BusinessLicense', {
                        initialValue: companyInfo.BusinessLicense
                      })(
                        <UploadFile additional="?x-oss-process=image/resize,m_lfit,h_30,w_50"/>
                      )}
                    </FormItem>

                  </Col>
                </Row>
                <Row >
                  <Col span={12}>
                    <label>
                      营业期限：
                    </label>
                    <span>
                      {
                        isSpecial ? <DatePicker onChange={this.dateChange.bind(this, 'RegisterDate')} defaultValue={ companyInfo.RegisterDate ? moment(companyInfo.RegisterDate, 'YYYY-MM-DD') : null} format={'YYYY-MM-DD'} /> : companyInfo.RegisterDate
                      }
                      &nbsp;至&nbsp;
                      {
                        isSpecial ? <DatePicker onChange={this.dateChange.bind(this, 'BusnissDeadline')} defaultValue={ companyInfo.BusnissDeadline ? moment(companyInfo.BusnissDeadline, 'YYYY-MM-DD') : null } format={'YYYY-MM-DD'} /> : companyInfo.BusnissDeadline
                      }
                      &nbsp;
                      <Checkbox disabled={!isSpecial} onChange={this.checkboxChange} value={companyInfo.NoDeadLine} defaultChecked={companyInfo.NoDeadLine}>无期限</Checkbox>
                    </span>
                  </Col>
                  <Col span={12}>
                    <FormItem label="公司地址" className={styles['company-col-item']}>
                      {getFieldDecorator('Address', {
                        initialValue: companyInfo.Address
                      })(
                        <Input disabled={!isSpecial} />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row >
                  {
                    isSpecial &&
                    <Col span={24} style={{ lineHeight: 42 }}>
                      <FormItem label="经营范围" className={styles['company-col-item']}>
                        {getFieldDecorator('BusinessScope', {
                          rules: [{ required: true, message: '请输入经营范围' }],
                          initialValue: companyInfo.BusinessScope
                        })(
                          <TextArea className={styles['textarea']} row={3} disabled={!isSpecial} />
                        )}
                      </FormItem>
                    </Col>
                  }
                  {
                    !isSpecial &&
                    <Col span={24} style={{ lineHeight: 42 }}>
                      <FormItem label="经营范围" className={styles['company-col-item']}>
                        {getFieldDecorator('BusinessScope', {
                          initialValue: companyInfo.BusinessScope
                        })(
                          <TextArea className={styles['textarea']} row={3} disabled={!isSpecial} />
                        )}
                      </FormItem>
                    </Col>
                  }
                </Row>
              </div> : <div className={styles['company-detail']}>
                <Row >
                  <Col span={6}>
                    <label>
                      信息来源：
                    </label>
                    <span>
                      {INFO_SOURCE_MAP[companyInfo.InfoSource]}
                    </span>
                  </Col>
                  <Col span={6}>
                    <label>
                      法人姓名：
                    </label>
                    <span>
                      {companyInfo.LegalPerson}
                    </span>
                  </Col>
                  <Col span={6}>
                    <label>
                      统一社会信用代码：
                    </label>
                    <span>
                      {companyInfo.RegNO}
                    </span>
                  </Col>
                </Row>
                <Row >
                  <Col span={6}>
                    <label>
                      注册号：
                    </label>
                    <span>
                      {companyInfo.RegCode}
                    </span>
                  </Col>
                  <Col span={6}>
                    <label>
                      注册资金：
                    </label>
                    <span>
                      {companyInfo.RegisteredCapital}
                    </span>
                  </Col>
                  <Col span={12}>
                    <label>
                      营业执照：
                    </label>
                    <span>
                      {
                        companyInfo.BusinessLicense ? <img style={{width: 60, height: 'auto'}} src={companyInfo.BusinessLicense} alt="营业执照"/> : null
                      }
                    </span>
                  </Col>
                </Row>
                <Row >
                  <Col span={12}>
                    <label>
                      营业期限：
                    </label>
                    <span>
                      {companyInfo.RegisterDate} - {companyInfo.BusnissDeadline}
                      <Checkbox disabled checked={companyInfo.NoDeadLine}>无期限</Checkbox>
                    </span>
                  </Col>
                  <Col span={12}>
                    <label>
                      公司地址：
                    </label>
                    <span>
                      {companyInfo.Address}
                    </span>
                  </Col>
                </Row>
                <Row >
                  <Col span={24} style={{ lineHeight: '42px' }}>
                    <label>
                      经营范围：
                    </label>
                    <TextArea row={3} disabled className={styles['textarea']} value={companyInfo.BusinessScope}/>
                  </Col>
                </Row>
              </div>
            }
          </Form>
        </Card>
        <Modal
          title="请输入网址！"
          visible={isModalVisible}
          footer={null}
          onCancel={this.toggleModal}
        >
          <Search
            placeholder="请输入网址"
            onSearch={this.getCompanyDetailByUrl}
            enterButton
          />
          <p>
            <a href="http://www.gsxt.gov.cn/index.html" target="_blank">打开链接： http://www.gsxt.gov.cn/index.html</a>
          </p>
        </Modal>
      </div>
    )
  }
}

export default Form.create()(Company)
