import { createAction, createReducer } from 'redux-act'
import { put, call, all } from 'redux-saga/effects'
import { push } from 'react-router-redux'

import { createSagaWatcher } from 'utilties/createSagaWatcher'
import invokeService from '../services'
import { groupBy } from 'lodash'

// Actions
export const getTestResults = createAction('GET_TEST_RESULTS')
export const getFeatureResults = createAction('GET_FEATURE_RESULTS')
export const getTestPlanResults = createAction('GET_TEST_PLAN_RESULTS')
export const getTestCaseResults = createAction('GET_TEST_CASE_RESULTS')
export const executeAllPlans = createAction('EXECUTE_ALL_PLANS')
export const onSuccessTestResults = createAction('ON_SUCESS_TEST_RESULTS')

// Helpers

const getValueBykey = resultArr => {
  const groupByExecutionID = groupBy(resultArr, 'executionid')
  const getKeysinDesc = Object.keys(groupByExecutionID)
    .sort()
    .reverse()

  return getKeysinDesc.map(item => ({
    [item]: groupBy(groupByExecutionID[item], 'featureid')
  }))
}

const getTestResultData = (result, getBykey) => {
  let data = []
  getValueBykey(result).map((feature, index) => {
    Object.keys(feature).map((featureKey, i) => {
      return Object.keys(feature[featureKey])
        .sort()
        .reverse()
        .map(elem => {
          const featuresObj = feature[featureKey][elem]
          if (getBykey === 'feature') {
            return data.push({
              id: `Execution-` + `${featureKey}`,
              featureName: `Feature-` + `${elem}`,
              totalcount: featuresObj.length,
              passCount: featuresObj.filter(i => i.status === 'Pass').length,
              failCount: featuresObj.filter(i => i.status === 'Fail').length
            })
          }
          const testPlans = groupBy(featuresObj, 'testplan')
          Object.keys(testPlans)
            .sort()
            .reverse()
            .map(testPlanKey => {
              const lastElemArray = testPlans[testPlanKey]
              if (getBykey === 'testplan') {
                return data.push({
                  id: `Execution-` + `${featureKey}`,
                  featureName: `Feature-` + `${elem}`,
                  testplan: testPlanKey,
                  totalcount: lastElemArray.length,
                  passCount: lastElemArray.filter(i => i.status === 'Pass')
                    .length,
                  failCount: lastElemArray.filter(i => i.status === 'Fail')
                    .length
                })
              }
              const testCases = groupBy(lastElemArray, 'testcase')
              Object.keys(testCases)
                .sort()
                .reverse()
                .map(testCaseKey => {
                  const testArray = testCases[testCaseKey]
                  if (getBykey === 'testcase') {
                    testArray.map(testItem => {
                      return data.push({
                        id: `Execution-` + `${featureKey}`,
                        featureName: `Feature-` + `${elem}`,
                        testplan: testPlanKey,
                        testcase: testItem['testcase'],
                        status: testItem['status']
                      })
                    })
                  }
                })
            })
        })
    })
  })
  return data
}
/** --------------------------------------------------
 *
 * Sagas
 *
 */

export const sagas = {
  [getTestResults]: function*() {
    const result = yield call(invokeService, {
      serviceUrl: 'http://localhost:3000/api/getalltestresults'
    })
    const groupByExecutionID = groupBy(result, 'executionid')
    const getKeysinDesc = Object.keys(groupByExecutionID)
      .sort()
      .reverse()
    // Total pass test results
    let getPassResults = [['Executions', 'Percentage']]
    getKeysinDesc.map(item =>
      getPassResults.push([
        'Execution-' + item,
        Math.trunc(
          (groupByExecutionID[item].filter(i => i.status === 'Pass').length /
            groupByExecutionID[item].length) *
            100
        )
      ])
    )
    // Total test results including pass and fail
    let getTotalResults = [['Executions', 'PASS', 'FAIL']]
    getKeysinDesc.map(item =>
      getTotalResults.push([
        'Execution-' + item,
        groupByExecutionID[item].filter(i => i.status === 'Pass').length,
        groupByExecutionID[item].filter(i => i.status === 'Fail').length
      ])
    )

    // Total count of test results and percent
    let totalRecordsWithPercent = {
      tableHeads: [
        'TbExecution Execution',
        'TbExecutiondetails Total TCs',
        'TbExecutiondetails Pass TCs',
        'TbExecutiondetails Fail TCs',
        'TbExecutiondetails Pass Percentage'
      ]
    }
    totalRecordsWithPercent = {
      ...totalRecordsWithPercent,
      ...getKeysinDesc.map(item => ({
        id: 'Execution-' + item,
        totalcount: groupByExecutionID[item].length,
        passCount: groupByExecutionID[item].filter(i => i.status === 'Pass')
          .length,
        failCount: groupByExecutionID[item].filter(i => i.status === 'Fail')
          .length,
        passPercent: Math.trunc(
          (groupByExecutionID[item].filter(i => i.status === 'Pass').length /
            groupByExecutionID[item].length) *
            100
        )
      }))
    }
    yield put(
      onSuccessTestResults({
        passResults: getPassResults,
        totalTestResults: getTotalResults,
        totalRecordsWithPercent: totalRecordsWithPercent
      })
    )
  },
  [getFeatureResults]: function*() {
    const result = yield call(invokeService, {
      serviceUrl: 'http://localhost:3000/api/getalltestresults'
    })
    const featureResultsData = getTestResultData(result, 'feature')

    yield put(
      onSuccessTestResults({
        featureResults: {
          tableHeads: [
            'TbExecution Execution',
            'Tbfeature Name',
            'TbExecutiondetails Total TCs',
            'TbExecutiondetails Pass TCs',
            'TbExecutiondetails Fail TCs'
          ],
          ...featureResultsData
        }
      })
    )
  },
  [getTestPlanResults]: function*() {
    const result = yield call(invokeService, {
      serviceUrl: 'http://localhost:3000/api/gettestplanresults'
    })
    const testPlanData = getTestResultData(result, 'testplan')

    yield put(
      onSuccessTestResults({
        testPlanResults: {
          tableHeads: [
            'TbExecution Execution',
            'Tbfeature Name',
            'TbtestPlan Name',
            'TbExecutiondetails Total TCs',
            'TbExecutiondetails Pass TCs',
            'TbExecutiondetails Fail TCs'
          ],
          ...testPlanData
        }
      })
    )
  },
  [getTestCaseResults]: function*() {
    const result = yield call(invokeService, {
      serviceUrl: 'http://localhost:3000/api/gettestcaseresults'
    })
    const testCaseResults = getTestResultData(result, 'testcase')
    yield put(
      onSuccessTestResults({
        testCaseResults: {
          tableHeads: [
            'TbExecution Execution',
            'Tbfeature Name',
            'TbtestPlan Name',
            'Tbtestcases Name',
            'Tbexecutiondetails Status'
          ],
          ...testCaseResults
        }
      })
    )
  },
  [executeAllPlans]: function*() {
    yield all([
      put(getTestResults()),
      put(getFeatureResults()),
      put(getTestPlanResults()),
      put(getTestCaseResults())
    ])
  }
}
export const testResultSagaWatcher = createSagaWatcher(sagas)

/** --------------------------------------------------
 *
 * Reducers
 *
 */
export const testResultReducer = {
  [onSuccessTestResults]: (state, payload) => ({
    ...state,
    ...payload
  })
}

const initialState = {}

export default createReducer(testResultReducer, initialState)
