import React from 'react'
import { Breadcrumb } from 'antd'
import styles from '@/stylus/main'
import { withRouter } from 'react-router'
class PageHeader extends React.Component {
  goBack (r) {
    // console.log(this.props, 'this.props')
    // if (this.props.menu.child) {
    //   this.props.history.go(-1)
    // }
    if (r.path) {
      this.props.history.push(r.path)
    }
  }
  render () {
    return (
      <div className={styles.header_page}>
        <Breadcrumb className={styles.mt_16}>
          {this.props.menu.map((m, index) => {
            return (<Breadcrumb.Item key={index} onClick={this.goBack.bind(this, m)}>{m.title}</Breadcrumb.Item>)
          })}
        </Breadcrumb>
      </div>
    )
  }
}
export default withRouter(PageHeader)
