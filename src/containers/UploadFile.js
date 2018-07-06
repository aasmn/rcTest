import React, { Component } from 'react'
import { Upload, message, Icon, Button } from 'antd'
import { connect } from 'react-redux'
import { getSignKey } from '@/actions/getSignKey'
import ImageViewer from '@/components/common/ImageViewer'
import moment from 'moment'
import _ from 'lodash'

function buildKey (fileName) {
  const getSuffix = function (filename) {
    let suffix = ''
    const pos = filename.lastIndexOf('.')

    if (pos !== -1) {
      suffix = filename.substring(pos)
    }
    return suffix
  }
  const randomString = function (len) {
    len = len || 32
    const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
    const maxPos = chars.length
    let pwd = ''
    for (let i = 0; i < len; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * maxPos))
    }
    return pwd
  }

  const suffix = getSuffix(fileName)
  const typMap = 'FileUploads/ERP/'
  const nowstr = moment().format('YYYYMM')
  const gObjectName = typMap + nowstr + '/' + randomString(10) + suffix
  return gObjectName
}

class Main extends Component {
  constructor (props) {
    super(props)
    this.state = {
      value: null,
      loading: false,
      filepath: props.value
    }
    this.handleChange = this.handleChange.bind(this)
    this.getFormData = this.getFormData.bind(this)
    this.beforeUpload = this.beforeUpload.bind(this)
  }
  handleChange (e) {
    // this.setState({value:e})
    // this.props.onChange(e)
    console.log(e)
    if (e.file.status === 'done') {
      this.props.onChange(this.filepath)
      this.setState({filepath: this.filepath})
    } else if (e.file.status === 'error') {
      message.error('图片上传失败！')
    }
  }
  getFormData (file) {
    console.log('getFormData', file)
    let data = {}
    data.key = buildKey(file.name)
    _.each(this.props.signkey, (value, key) => {
      data[key] = value
    })
    this.filepath = 'https://pilipa.oss-cn-beijing.aliyuncs.com/' + data.key
    return data
  }
  beforeUpload () {
    console.log(this.props.getSignKey())
    return this.props.getSignKey()
  }
  render () {
    const imageUrl = this.state.filepath
    // {imageUrl ? <ImageViewer/> : <ImageViewer/>}
    return (
      <div className="file-upload">
        {imageUrl ? <ImageViewer src={imageUrl} additional={this.props.additional}/> : null}
        <Upload
          name="file"
          showUploadList={false}
          action="https://pilipa.oss-cn-beijing.aliyuncs.com/"
          data={this.getFormData}
          onChange={this.handleChange}
          beforeUpload={this.beforeUpload}
        >
          <Button size="small">上传图片</Button>
        </Upload>
      </div>
    )
  }
}
const mapStateToProps = ({common}) => {
  return {
    signkey: common.signkey
  }
}
const mapDispatchToProps = dispatch => {
  return {
    getSignKey: payload => {
      return dispatch(getSignKey())
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Main)
