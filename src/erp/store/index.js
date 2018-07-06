
import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
// import promiseMiddleware from 'redux-promise'
import reducers from '../reducers'
let middleware = [thunkMiddleware]
export default createStore(reducers, applyMiddleware(...middleware))
