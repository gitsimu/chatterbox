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

const chatData = parent.smtgs_chat_data || {}
const customData = parent.smtgs_chat_custom_data || {}

// base
const key = chatData.key || 'rndsmlch1'
const ck = chatData.ck || ''
const muid = chatData.muid || ''
const ip = chatData.ip || ''
const svid = chatData.svid || '1240'

const iconConfig = {
  themeColor: chatData.themeColor || '#0080F7',
  position: chatData.position || 'rb',
  pc: chatData.pc ? {
    hide: chatData.pc.hide,
    axisX: chatData.pc.axisX,
    axisY: chatData.pc.axisY,
    size: chatData.pc.size,
    text: chatData.pc.iconText,
    textAlign: chatData.pc.iconTextAlign
  } : {
    hide: false,
    axisX: 30,
    axisY: 30,
    size: 65,
    text: '',
    textAlign: ''
  },
  mobile: chatData.mobile ? {
    hide: chatData.mobile.hide,
    axisX: chatData.mobile.axisX,
    axisY: chatData.mobile.axisY,
    size: chatData.mobile.size
  } : {
    hide: false,
    axisX: 20,
    axisY: 20,
    size: 65
  }
}

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

  store.dispatch({ type: 'CONNECT', key: key, id: uuid, ck: ck, muid: muid, ip: ip, svid: svid, iconConfig: iconConfig, customData: customData })
  
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    rootElement
  )
}
