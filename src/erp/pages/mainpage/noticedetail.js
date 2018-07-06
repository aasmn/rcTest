import React from 'react'
import '@/erp/style/main.less'
import { getListData } from '@/erp/api'
export default class Main extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {}
    }
    this.goLastPag = this.goLastPag.bind(this)
  }
  componentWillMount () {
    console.log(this.props.match.params, 'aaa')
    const id = this.props.match.params.id
    console.log(id)
    getListData(`notice/getNotice?id=@/erp{id}`).then(res => {
      if (res.status) {
        this.setState({
          data: res.data[0]
        })
      }
    })
  }
  goLastPag () {
    this.props.history.goBack()
  }
  render () {
    const data = this.state.data
    return (
      <div className="notice-detail">
        <div className="vheader">
          <h3>
            公告详情
            <span className="back-last" onClick={this.goLastPag}>返回上一页</span>
          </h3>
        </div>
        <div className="content">
          <h3>{data.Title}</h3>
          <div className="detail-nav">
            <span>发布日期：{data.CreateDate}</span>
          </div>
          <div className="detail-con">{data.Text}</div>
        </div>
      </div>
    )
  }
}