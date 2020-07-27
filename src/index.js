import React from "react"
import ReactDOM from "react-dom"
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import rootReducer from './reducers'

import "core-js/stable"
import "regenerator-runtime/runtime"

import App from './containers/App'
import * as script from './js/script.js'

const rootElement = document.getElementById ('chatterbox-root')
const store = createStore(rootReducer)
store.subscribe(() => { console.log('[store]',store.getState())})

const key = rootElement.getAttribute('key') || 'rndsmlch1'
const ck = rootElement.getAttribute('ck')
const muid = rootElement.getAttribute('muid')
const ip = rootElement.getAttribute('ip')
const svid = rootElement.getAttribute('svid')

let uuid = uuidv4()

if (script) {
  let token = script.getCookie('chatterboxToken')

  if (token && token !== '') {
    uuid = token
  }

  script.setCookie('chatterboxToken', uuid, 3)
}

store.dispatch({ type: 'CONNECT', key: key, id: uuid, ck: ck, muid: muid, ip: ip, svid: svid })

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootElement
)

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}
