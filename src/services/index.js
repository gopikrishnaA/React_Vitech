
import store from 'store'
import {
  showLoader,
  hideLoader,
  hasException
} from 'models/loading'

const invokeService = ({ serviceUrl, method = 'GET', requestData }) => {
  console.log('serviceName is ', serviceUrl)
  console.log('requestData is ', requestData)
  const body = requestData ? JSON.stringify(requestData) : {}
  store.dispatch(showLoader())
  return fetch(serviceUrl, // eslint-disable-line
    {
      method,
      headers: {
        'Accept': 'application/json'
      },
      ...body
    })
    .then(response => {
      store.dispatch(hideLoader())
      store.dispatch(hasException(false))      
      console.log('response :::: ', response)
      if (!response.ok) {
        throw Error(response.statusText)
      }
      return response.json()
    }).then(res => res.data)
    .catch(error => {
      store.dispatch(hideLoader())
      store.dispatch(hasException(true))
      console.log('fetch error ::: ', error)
    }
    )
}
export default invokeService
