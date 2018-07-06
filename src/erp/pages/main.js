import React from 'react'
import '@/erp/style/main.less'
// import { Row, Col } from 'antd'
import { getListData } from '@/erp/api'
// import { downLoad } from '@/erp/config/contractActions'
export default class Main extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      noticeList: [],
      documentList: []
    }
    this.goDetail = this.goDetail.bind(this)
    this.goMorenotice = this.goMorenotice.bind(this)
    this.goMorefile = this.goMorefile.bind(this)
  }
  componentWillMount () {
    let paramsnotice = {
      limit: 4,
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
    let paramsdoc = {
      limit: 8,
      offset: 0,
      filename: '',
      type: 0
    }
    getListData('doc/getDocList', paramsdoc).then(res => {
      if (res.status) {
        this.setState({
          documentList: res.data
        })
      }
    })
  }
  goDetail (id) {
    this.props.history.push('/main/noticedetail/' + id)
  }
  goMorenotice () {
    console.log(this, 'this')
    this.props.history.push('/main/noticelist')
  }
  goMorefile () {
    this.props.history.push('/main/filelist')
  }
  render () {
    return (
      <div className="container">
        <div className="board dash-board">
          <div className="dash-board-bg">
            <h4>仪表盘</h4>
          </div>
        </div>
        <div className="right-content">
          <div className="board notice">
            <h4>
            最新公告
            { this.state.noticeList.length > 0 && <span className="more" onClick={this.goMorenotice}>更多>></span>}
            </h4>
            {
              this.state.noticeList.length === 0 &&
              <div className="bg"></div>
            }
            {
              this.state.noticeList.length > 0 &&
              this.state.noticeList.map((item, index) => {
                return (
                  <div key={item.id} className="notice-item">
                    <div>
                      {item.IsNew === 1 && <i>新</i>}
                      <span onClick={e => this.goDetail(item.id)}>{item.Title}</span>
                    </div>
                    <p>{item.CreateDate}</p>
                  </div>
                )
              })
            }
          </div>
          <div className="board document">
            <h4>
            帮助文档
            { this.state.documentList.length > 0 && <span className="more" onClick={this.goMorefile}>更多>></span>}
            </h4>
            {
              this.state.documentList.length === 0 &&
              <div className="bg document-bg"></div>
            }
            {
              this.state.documentList.length > 0 &&
              this.state.documentList.map((item, index) => {
                return (
                  <div key={item.Id} className="document-item">
                    <div>
                      <i></i>
                      <a href={item.FilePath} target='_blank'>{item.FileName}</a>
                      {/* <span onClick={e => this.downLoad(item.Id)}>{item.FileName}</span> */}
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    )
  }
}