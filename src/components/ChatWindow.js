import React from 'react'
import Message from './Message'
import * as script from '../js/script.js'

const PAGE_SIZE = 50
let CHAT_REF

const ChatWindow = ({ info, message, initMessage, addMessage, clearMessage, pagingMessage, database, isLoading }) => {  
  const body = React.useRef(null)  
  
  const scrollToBottom = () => {    
    setTimeout(() => {
      if (body && body.current) {
        body.current.scrollTop = body.current.scrollHeight
      }
    }, 100)
  }

  React.useEffect(() => {
    clearMessage()
    
    const chatRef = database.ref(`/${info.key}/messages/${info.id}`).orderByChild('timestamp')

    Promise.resolve()
      .then(() => {
        return chatRef.limitToLast(PAGE_SIZE * 1).once('value')
      })
      .then(snapshots => {
        if (snapshots.val() === null) {
          /* 대화내역 없음 */
          addMessage({
            id: "first",
            message: info.config.firstMessage,
            timestamp: new Date().getTime(),
            type: 1,
            userId: info.key,
          })          
          return 0
        } else {
          /* 대화내역 한 번에 호출 후 출력 */
          const arr = []
          snapshots.forEach(snapshot => {
            arr.push(snapshot.val())
          })
  
          initMessage(arr)
          
          CHAT_REF = {ref: chatRef, page: 1, firstTimestamp: arr[0].timestamp}
          const lastMessage = arr[arr.length - 1]
          return lastMessage.timestamp 
        }
      })
      .then(lastTimestamp => {
        const ref =  chatRef.startAt(lastTimestamp + 1)
        ref.on('child_added', (snapshot) => {
          if (snapshot.key === 'userinfo'
          || snapshot.key === 'timestamp') return // ignore userinfo, timestamp
   
          const m = snapshot.val()
          addMessage(m)
          scrollToBottom()
        })
      })
      .finally(() => {
        scrollToBottom()
      })
    
    if (!script.checkWorkingTime(info.config.workingDay)) {
      addMessage({
        id: "missed",
        message: info.config.workingDay.message,
        timestamp: new Date().getTime(),
        type: 1,
        userId: info.key,
      })
    }

    return () => {      
      chatRef.off()
    }
  }, [info.id])

  const paging = React.useCallback(() => {
    if (CHAT_REF && CHAT_REF.ref) {
      isLoading(true)

      const chatRef = CHAT_REF.ref
      const timestamp = CHAT_REF.firstTimestamp - 1      
      let prevScrollHeight = body.current.scrollHeight      

      Promise.resolve()
        .then(() => {
          chatRef.limitToLast(PAGE_SIZE).endAt(timestamp).once('value', snapshots => {
            const arr = []
            snapshots.forEach(snapshot => {
              arr.push(snapshot.val())
            })
    
            pagingMessage(arr)
            CHAT_REF = {
              ...CHAT_REF,
              page: CHAT_REF.page + 1,
              firstTimestamp: arr.length === 0 ? 0 : arr[0].timestamp
            }
            return
          })
        })
        .then(() => {
          setTimeout(() => {
            const currentScrollHeight = body.current.scrollHeight
            body.current.scrollTop = currentScrollHeight - prevScrollHeight
            isLoading(false)
          }, 300)
        })
    }
  }, [])

  return (
    <div 
      className="chat-window-body"
      style={{backgroundColor: '#fff'}}
      ref={body}>
      {message.length >= (CHAT_REF ? CHAT_REF.page : 1) * PAGE_SIZE && (
        <div className="chat-more-message" onClick={() => {paging()}}>
          <div><i className="icon-arrow-up"></i>이전 메세지</div>
        </div>
      )}
      {message.map((m, i) => (
        <Message
          info={info}
          key={m.id}
          prev={message[i - 1]}
          {...m}
        />
      ))}

      { false && (
        <div
          className="chat-required-data">
          <div>
            <div className="title">이름</div>
            <input/>
          </div>
          <div>
            <div className="title">연락처</div>
            <input/>
          </div>
          <div>
            <div className="title">이메일</div>
            <input/>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatWindow
