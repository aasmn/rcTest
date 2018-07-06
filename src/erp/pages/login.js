import { connect } from 'react-redux'
import { login } from '@/erp/store/actions'
import Login from '@/erp/container/Login'

const mapStateToProps = ({common}) => {
  return {
    loading: common.loading,
    isLogin: common.isLogin
  }
}
const mapDispatchToProps = dispatch => {
  return {
    onLogin: payload => {
      dispatch(login(payload))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login)
