import React, { Component } from 'react'
import { fetchUserInfo, postData, putData } from '@/erp/api'
import { message, Card, Spin } from 'antd'
import { connect } from 'react-redux'
import UserInfo from '@/erp/container/UserInfo'
import ResetPassword from '@/erp/container/ResetPassword'
import _ from 'lodash'


class MyInfo extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.fetchMyInfo = this.fetchMyInfo.bind(this);
        this.resetPassword = this.resetPassword.bind(this);
        this.state = {
            userInfo: null
        }
    }
    handleSubmit (data){
        postData('users', _.extend(this.state.userInfo,data)).then(res=>{
            if(res.status){
                message.info('保存成功！')
            }
        })
    }
    resetPassword (data){
        putData('user/pwd/reset',data).then(res=>{
           if(res.status){
            message.info('密码修改成功！')
           }
        })
    }
    fetchMyInfo(){
        fetchUserInfo(this.props.userId).then(res=>{
            this.setState({userInfo:res.data})
        })
    }
    componentDidMount() {
        this.fetchMyInfo();
    }
    render() {
        if(!this.state.userInfo) return (<Spin/>);
        return (
            <div>
                <Card title="我的信息" bordered={false} style={{ width: 600 }}>
                    <div style={{width:'600px',padding:'24px'}}>
                        <UserInfo user={this.state.userInfo} onSubmit={this.handleSubmit} />
                    </div>
                </Card>
                <Card title="修改密码" bordered={false} style={{ width: 600 }}>
                    <div style={{width:'600px',padding:'24px'}}>
                        <ResetPassword  onSubmit={this.resetPassword} />
                    </div>
                </Card>
            </div>
        )
    }
}
const mapStateToProps = ({common}) => {
  return {
    userId: common.user.Id
  }
}
export default connect(mapStateToProps)(MyInfo)
