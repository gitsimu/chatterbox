import React from 'react'
import Message from './Message'
// import * as script from '../js/script.js'

const ChatWindow = ({ info, message, addMessage, database }) => {
  const body = React.useRef(null)  
  const chatRef = database.ref(`/${info.key}/messages/${info.id}`).orderByChild('timestamp')

  React.useEffect(() => {
    chatRef.once('value', (snapshot) => {
      if (snapshot.val() === null ) {
        addMessage({
          id: "first",
          message: info.config.firstMessage,
          timestamp: new Date().getTime(),
          type: 1,
          userId: info.key,
        })
      }      
    })
    chatRef.on('child_added', snapshot => {
      if (snapshot.key === 'userinfo'
       || snapshot.key === 'timestamp') return // ignore userinfo, timestamp

      // const isWorkingTime = script.checkWorkingTime(info.config.workingDay)
      // isWorkingTime && addMessage({
      //   id: Math.random().toString(36).substr(2, 9),
      //   message: info.config.workingDay.message,
      //   timestamp: new Date().getTime(),
      //   type: 1,
      //   userId: info.key,
      // })

      const m = snapshot.val()
      addMessage(m)
      console.log('   [child_add]', m)

      setTimeout(() => {
        if (body && body.current) {
          body.current.scrollTop = body.current.scrollHeight
        }
      }, 100)
    })
  }, [])

  return (
    <div 
      className="chat-window-body"
      style={{backgroundColor: '#fff'}}
      ref={body}>
      { message.map((m, i) => (
        <Message
          info={info}
          key={m.id}
          prev={message[i - 1]}
          {...m}
        />
      )) }

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
