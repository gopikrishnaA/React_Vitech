import { combineReducers } from 'redux'

import loading from 'models/loading'
import testResults from 'models/testResults'

const appReducer = combineReducers({
  loading,
  testResults
})

const rootReducer = (state, action) => appReducer(state, action)

export default rootReducer
