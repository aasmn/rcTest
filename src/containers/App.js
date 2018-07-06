import React, { Component } from 'react'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { LocaleProvider } from 'antd'
class App extends Component {
  render () {
    return (
      <LocaleProvider locale={zhCN}>
        <div className="app">
          {this.props.children}
        </div>
      </LocaleProvider>
    )
  }
}
export default withRouter(connect(({common}) => {
  return common
})(App))
