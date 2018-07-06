import modules from './modules'
const configs = [{
  path: '/',
  component: modules.Index,
  exact: true,
  menuList: []
},
{
  path: '/organizelist',
  component: modules.OrganizeList,
  menuList: [{
    title: '机构'
  }, {
    title: '机构列表',
    path: '/organizelist'
  }]
},
{
  path: '/organizeaudit',
  component: modules.OrganizeAudit,
  menuList: [{
    title: '机构'
  }, {
    title: '机构审核',
    path: '/organizeaudit'
  }]
},
{
  path: '/customer',
  component: modules.CustomerService,
  menuList: [{
    title: '客服中心'
  }, {
    title: '客户',
    path: '/customer'
  }]
},
{
  path: '/customerVisit',
  component: modules.CustomerVisit,
  menuList: [{
    title: '客服中心'
  }, {
    title: '外呼',
    path: '/customerVisit'
  }]
},
{
  path: '/customerDetail',
  component: modules.CustomerDeatil,
  menuList: [{
    title: '客服中心'
  }, {
    title: '客户',
    path: '/customer'
  }, {
    title: '详情'
  }]
},
{
  path: '/usersAccount',
  component: modules.UsersAccount,
  menuList: [{
    title: '用户'
  }, {
    title: '账号',
    path: '/usersAccount'
  }]
},
{
  path: '/usersRoles',
  component: modules.UsersRoles,
  menuList: [{
    title: '用户'
  }, {
    title: '角色',
    path: '/customer'
  }]
},
{
  path: '/usersAddStrategy',
  component: modules.UsersAddStrategy,
  menuList: [{
    title: '用户'
  }, {
    title: '权限策略',
    path: '/usersStrategy'
  }, {
    title: '新增策略'
  }]
},
{
  path: '/usersStrategy',
  component: modules.UsersStrategy,
  menuList: [{
    title: '用户'
  }, {
    title: '权限策略'
  }]
},
{
  path: '/datamanagement',
  component: modules.ModifyData,
  menuList: [{
    title: '数据管理'
  }, {
    title: '数据修改'
  }]
},
{
  path: '/datamanagementDetail/:Id',
  component: modules.ModifyDataDetail,
  menuList: [{
    title: '数据管理'
  }, {
    title: '数据修改',
    path: '/datamanagement'
  }, {
    title: '详情'
  }]
}, {
  path: '/department',
  component: modules.Department,
  menuList: [{
    title: '用户'
  }, {
    title: '部门',
    path: '/department'
  }]
}, {
  path: '/resources',
  component: modules.Resources,
  menuList: [{
    title: '用户'
  }, {
    title: '资源',
    path: '/resources'
  }]
}, {
  path: '/channel/users',
  component: modules.ChannelUserList,
  menuList: [{
    title: '渠道管理'
  }, {
    title: '用户管理',
    path: '/channel/users'
  }]
}, {
  path: '/subsidiary/users',
  component: modules.SubsidiaryUserList,
  menuList: [{
    title: '直营管理'
  }, {
    title: '用户管理',
    path: '/subsidiary/users'
  }]
},{
  path: '/erp/finance_manage_contract',
  component: modules.ErpFinanceManageContract,
  menuList: [{
    title: '直营管理'
  }, {
    title: '用户管理',
    path: '/subsidiary/users'
  }]
}]


export default configs
