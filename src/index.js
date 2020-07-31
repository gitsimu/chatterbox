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
const key = rootElement.getAttribute('key') || 'rndsmlch1'
const ck = rootElement.getAttribute('ck')
const muid = rootElement.getAttribute('muid')
const ip = rootElement.getAttribute('ip')
const svid = rootElement.getAttribute('svid') || '1240'

if (!key || !svid) {
  console.error('[Smartlog Chat] 필수 파라메터가 전달되지 않았습니다. 관리자에게 문의해주세요')
} else {
  let uuid = script.uuidv4()

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
}
