import React from 'react'
import { connect } from 'react-redux'
class Index extends React.Component {
  componentWillMount () {
    if (this.props.userInfo === 'kefu') {
      this.props.history.push('/customer')
    } else if (this.props.userInfo === 'dm') {
      this.props.history.push('/datamanagement')
    }
  }
  render () {
    return null
  }
}
export default connect(({ common }) => {
  return {
    ...common
  }
})(Index)
