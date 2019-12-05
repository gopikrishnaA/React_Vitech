import { loadingSagaWatcher } from 'models/loading'
import { testResultSagaWatcher } from 'models/testResults'

function* rootSaga() {
  yield [...testResultSagaWatcher, ...loadingSagaWatcher]
}

export default rootSaga
