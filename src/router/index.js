import React from 'react'
import {
  HashRouter,
  BrowserRouter,
  Route,
  Link,
  Redirect,
  Switch
} from 'react-router-dom'
// import 'es6-promise/dist/es6-promise'
import { Provider } from 'react-redux'
import store from '@/stores'

import App from '@/containers/App'
import Main from '@/containers/Main'
import modules from './modules'
import configs from './configs'
import Token from '../token'
import _ from 'lodash'

const { Login } = modules
console.log(modules)

const isPro = process.env.NODE_ENV === 'production'

const Router = isPro ? BrowserRouter : HashRouter
// const Router = HashRouter

const basename = '/'
let funs
function getFuns () {
  if (funs) return
  const user = JSON.parse(sessionStorage.getItem('userInfo'))
  if (user) {
    funs = _.flatMapDeep(user.functionList, m => {
      if (m.type === '1' || m.type === 1) {
        return [m, m.children]
      } else {
        return []
      }
    })
    console.log('funs', funs)
  }
}
function getFromFuns (item) {
  getFuns()
  // if (_.find(funs, f => (('/' + f.url) === item.path))) return true
  return true
}
const router = () => (
  <Provider store={store}>
    <Router basename={basename}>
      <App>
        <Switch>
          <Route path='/demo5' component={modules.Demo5} />
          <Route path='/demo6' component={modules.Demo6} />
          <Route path='/login' component={modules.Login} />
          <Route path='/logout' component={modules.Logout} />
          <Route path='/token' component={Token} />
          <Main>
            {
              configs.map((item, index) => {
                const menu = getFromFuns(item)
                if (menu) {
                  return <Route key={'router-' + index} path={item.path} component={item.component} exact={item.exact} />
                }
              })
            }
          </Main>
        </Switch>
      </App>
    </Router>
  </Provider>
)
export default router
