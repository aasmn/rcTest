import React from 'react'
import '@/erp/style/main.less'
import { getListData } from '@/erp/api'
export default class Main extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      noticeList: []
    }
    this.goBack = this.goBack.bind(this)
    this.goDetail = this.goDetail.bind(this)
  }
  goDetail (id) {
    this.props.history.push('/main/noticedetail/' + id)
  }
  goBack () {
    this.props.history.goBack()
  }
  componentWillMount () {
    let paramsnotice = {
      limit: 10,
      offset: 0,
      title: '',
      type: 1
    }
    getListData('notice/getnoticelist', paramsnotice).then(res => {
      if (res.status) {
        this.setState({
          noticeList: res.data
        })
      }
    })
  }
  render () {
    return (
      <div className="more-notice">
        <h3 className="vheader">
          公告列表
          <span className="back-last" onClick={this.goBack}>返回首页</span>
        </h3>
        <div className="vcon">
          {
            this.state.noticeList.map((item, index) => {
              return (
                <div className="item" key={item.id}>
                  {item.IsNew === 1 && <span className="data-sign">新</span>}
                  <span className="detail-item" onClick={e => this.goDetail(item.id)}>{item.Title}</span>
                  <span className="date-float">{item.CreateDate}</span>
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }
}