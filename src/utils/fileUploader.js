import moment from 'moment'
import http from '@/utils/http'
import { getSignkey } from '@/utils/api'

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
const origin = 'https://pilipa.oss-cn-beijing.aliyuncs.com/'
const uploader = (file) => {
  return new Promise((resolve, reject) => {
    getSignkey().then(res => {
      if (res.status) {
        const data = res.data
        delete data.Filename
        delete data.key
        delete data.callback
        delete data.expire
        delete data.Host
        data.key = buildKey(file.name)
        data.file = file
        const formData = new FormData()
        for (const key in data) {
          formData.append(key, data[key])
        }
        const filename = origin + data.key
        return http(
          origin,
          'POST',
          {
            raw: true,
            data: formData,
            extension: {
              processData: false,
              contentType: false
            }
          }
        ).then(res => {
          resolve({
            status: true,
            data: {
              path: filename
            }
          })
        }).catch((e) => {
          reject(e)
        })
      }
    })
  })
}
export default uploader
