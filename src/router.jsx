import React from 'react'
import { ConnectedRouter as Router } from 'react-router-redux'
import { Route, Redirect } from 'react-router-dom'
import { history } from 'store'

import Loading from 'components/Loading'
import { TestResult } from 'routes/TestResult'

export default () => {
  return (
    <Router history={history}>
      <div>
        <Loading />
        <Route path="/" render={() => <Redirect to="/testResults" />} />
        <Route path="/testResults" component={TestResult} />
      </div>
    </Router>
  )
}
