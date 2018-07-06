import { combineReducers } from 'redux'
import common from './common'
import account from './account'
import taskConf from './taskConf'
import lydata from './lydata'
export default combineReducers({
  common,
  account,
  taskConf,
  lydata
})
