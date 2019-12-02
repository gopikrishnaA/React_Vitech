import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { executeAllPlans } from 'models/testResults'
import { IMAGES_FORMAT } from 'utilties/util'
import Chart from 'components/Chart'
import ResultTable from 'components/ResultTable'

import './App.css'

class Pure extends Component {
  constructor(props) {
    super(props)
  }
  componentWillMount() {
    this.props.executeAllPlans()
  }

  render() {
    const { passResults,
      totalTestResults,
      totalRecordsWithPercent,
      featureResults,
      testPlanResults,
      testCaseResults,
      hasNetworkError = false } = this.props
    return (
      !hasNetworkError ? <div className='App'>
        <div className='App-title'>Test Automation Dashboard</div>
        <div className='App-partioner'>
          <Chart chartType="Bar" data={passResults} title="Test Case Pass Percentage" />
          <Chart width='600px' height='400px' chartType="ColumnChart"
            data={totalTestResults} title="Pass - Fail Test Count" isStacked />
        </div>
        <div className='App-partioner'>
          <ResultTable data={featureResults} title='Test Case Count - Per Execution and Feature'/>
          <ResultTable data={totalRecordsWithPercent} title='Test Case Count - Per Execution'/>
        </div>
        <div className='App-partioner'>
          <ResultTable data={testPlanResults} title='Test Case Count - Per Execution, Feature and Testplan'/>
          <ResultTable data={testCaseResults} title='Test Case - Execution, Feature, Testplan'/>
        </div>
      </div> : <h2>Please connect to node server to get test results</h2>
    )
  }
}

const state = ({ testResults, loading }) => ({
  passResults: testResults.passResults,
  totalTestResults: testResults.totalTestResults,
  totalRecordsWithPercent: testResults.totalRecordsWithPercent,
  featureResults: testResults.featureResults,
  testPlanResults: testResults.testPlanResults,
  testCaseResults: testResults.testCaseResults,
  hasNetworkError: loading.isException
})

const dispatch = (dispatch) => ({
  executeAllPlans: () => dispatch(executeAllPlans())
})

Pure.propTypes = {
}

export const TestResult = connect(state, dispatch)(Pure)
