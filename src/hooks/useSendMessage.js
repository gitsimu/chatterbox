import React from 'react'
import {useSelector} from 'react-redux'
import * as firebase from 'firebase'
import * as script from '../js/script'
import axios from 'axios'

const useSendMessage = (database) => {
  const [sendingTerm, isSendingTerm] = React.useState(false)
  const info = useSelector(state => state.info)

  const updateDatabase = (senderId, message, type, noti)=> {
    const timestamp = firebase.database.ServerValue.TIMESTAMP
    const messageId = Math.random().toString(36).substr(2, 9)
    let trimMessage
    let lastMessage

    if (type === 2) {
      trimMessage = message.trim()
      lastMessage = JSON.parse(message).name
    } else {
      trimMessage = message.trim().substr(0, 20000)
      lastMessage = trimMessage
    }

    database.ref(`/${info.key}/users/${info.id}`).update({
      ck: info.ck,
      muid: info.muid,
      ip: info.ip,
      svid: info.svid,
      lastMessage: lastMessage,
      live: 1,
      timestamp: timestamp
    })
    database.ref(`/${info.key}/messages/${info.id}/${messageId}`).update({
      id: messageId,
      userId: senderId,
      message: trimMessage,
      type: type,
      timestamp: timestamp
    })

    if(!noti) return
    database.ref(`/${info.key}/recents`).update({
      userId: senderId,
      type: type,
      message: trimMessage,
      timestamp: timestamp
    })
    pushNotification(lastMessage.slice(0, 28))
      .then(data => {
        console.log('push success', data)
      })
      .catch(err => {
        console.log('push failed', err)
      })
  }

  const sendMessage = (message, type, noti = true) => {
    if (sendingTerm) return;
    isSendingTerm(true)

    updateDatabase(info.id, message, type, noti)

    // 메세지 발송 텀 0.3s
    setTimeout(() => {
      isSendingTerm(false)
    }, 300)
  }

  /* 메세지 발송 시 푸시 요청 */
  const pushNotification = async (message) => {
    const code = script.guestCodeGenerator(info.id)
    const config = { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } }
    const formData = new FormData()
    formData.append('nick', code.guestCode)
    formData.append('message', message)
    formData.append('svid', info.svid)
    formData.append('method', 'push_client_chat')

    return axios.post('https://smlog.co.kr/api/app_api.php', formData, config)
  }

  return [sendMessage]
}

export default useSendMessage