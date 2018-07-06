import { handleActions } from 'redux-actions'
import _ from 'lodash'
export default handleActions({
  'change outworker task config list': (state, {data}) => {
    data = _.cloneDeep(data)

    const processData = []
    for (let key in data) {
      const CommonTaskId = '_' + data[key]['CommonTaskId']
      if (processData[CommonTaskId]) {
        processData[CommonTaskId].push(data[key])
      } else {
        processData[CommonTaskId] = []
        processData[CommonTaskId].push(data[key])
      }
    }

    console.log(processData, 'list')

    return {
      ...state,
      list: processData
    }
  },
  'change outworker task config selected task': (state, {data}) => {
    data = _.cloneDeep(data)
    return {
      ...state,
      selectedTask: _.sortBy(data, 'Weight')
    }
  },
  'change outworker task config detail info': (state, {payload}) => {
    payload = Object.assign({}, payload, {
      OutWorkerTasks: state.selectedTask
    })
    return {
      ...state,
      detailInfo: payload
    }
  }
}, {
  list: [],
  selectedTask: [],
  detailInfo: {
    CommonTaskName: '',
    OutWorkerTasks: [],
    Weight: 0
  }
})
