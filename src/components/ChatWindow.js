import React from 'react'
import Message from './Message'
import * as script from '../js/script.js'
import useMessageGetter from '../hooks/useMessageGetter'
import useScrollTo from '../hooks/useScrollTo'
import useSendMessage from '../hooks/useSendMessage'

const PAGE_SIZE = 50
const ChatWindow = ({info, message, clearMessage, initMessage, addMessage, pagingMessage, database, isLoading, setActiveAddMessage}) => {
  const chatbotList = info.config.chatbot?.list || []
  const body = React.useRef(null)
  const [hasBeforeMessage, setHasBeforeMessage] = React.useState(false)
  const [getMessageByDB, onAddedMessage] = useMessageGetter(database)
  const chatbotHistory = React.useRef([])
  const [sendMessage, sendMessageList] = useSendMessage(database)
  const [currentChatbot, setCurrentChatbot] = React.useState(null)
  const [chatbotLoading, setChatbotLoading] = React.useState(false)
  const [scrollTo, setScrollBottom, setScrollFix] = useScrollTo(body.current, [message, currentChatbot, chatbotLoading])

  const isActiveChatbot = ()=> {
    switch (`${info.config.chatbot.state}`){
      case '0': return false
      case '1': return true
      case '2': return script.checkWorkingTime(info.config.workingDay)
      case '3': return !script.checkWorkingTime(info.config.workingDay)
      default: return false
    }
  }

  const startMessageListener = (startTimestamp)=> {
    onAddedMessage(startTimestamp, (addedMessage) => {
      setScrollBottom()
      addMessage(addedMessage)
    })
  }

  const addBeforeMessage = ()=> {
    setScrollFix()
    isLoading(true)

    getMessageByDB(PAGE_SIZE, message[0].timestamp - 1)
      .then(beforeMessageList => {
        setHasBeforeMessage(beforeMessageList.length === PAGE_SIZE)
        pagingMessage(beforeMessageList)
        isLoading(false)
      })
  }

  const startChatbot = () => {
    setCurrentChatbot(chatbotList[0])
    setHasBeforeMessage(false)
    setActiveAddMessage(false)
  }

  const onClickChatbotAnswer = (answer)=> {
    let message = {
      id: Math.random().toString(36).substr(2, 9),
      userId: info.id,
      message: answer.message,
      type: 1,
      timestamp: new Date().getTime()
    }
    chatbotHistory.current.push(message)
    addMessage(message)

    const question = chatbotList.find(question => `${question.id}` === `${answer.to}`)
    setCurrentChatbot(question)
  }

  const waiting = (time) => new Promise(resolve => {
    setTimeout(resolve, time)
  })

  React.useEffect(() => {
    if(!currentChatbot) return

    Promise.resolve()
      .then(()=> {
        const isStart = chatbotHistory.current.length === 0
        if(isStart) return

        setChatbotLoading(true)
        return waiting(800)
      })
      .then(()=> {
        let currentTimestamp = new Date().getTime()

        if(currentChatbot.action === "CHAT" && !script.checkWorkingTime(info.config.workingDay)){
          let message = {
            id: Math.random().toString(36).substr(2, 9),
            userId: info.key,
            message: script.getWorkingSchedule(info.config.workingDay),
            type: 1,
            timestamp: currentTimestamp++
          }
          addMessage(message)
          currentChatbot.answers = [{
            message : '처음으로',
            to : chatbotList[0].id
          }]

          return
        }

        currentChatbot.questions.map(m => {
          let message = {
            id: Math.random().toString(36).substr(2, 9),
            userId: info.key,
            message: m.message,
            type: m.type,
            timestamp: currentTimestamp++
          }
          chatbotHistory.current.push(message)
          addMessage(message)
        })

        if(currentChatbot.action === "CHAT"){
          setActiveAddMessage(true)
          sendMessageList(chatbotHistory.current.splice(0))
          startMessageListener(currentTimestamp)
          setCurrentChatbot(null)
        }
      })
      .finally(() => setChatbotLoading(false))

  }, [currentChatbot])

  // 유저 채팅방 on
  React.useEffect(() => {
    isLoading(true)

    Promise.resolve()
      .then(() => getMessageByDB(PAGE_SIZE))
      .then((beforeMessageList) => {

        // 기존 대화내역 없고 챗봇 활성화된 경우 챗봇으로 시작
        if (beforeMessageList.length === 0 && isActiveChatbot()) {
          startChatbot()
          return
        }

        if (beforeMessageList.length === 0) {
          beforeMessageList.push({
            id: 'first',
            message: info.config.firstMessage,
            timestamp: new Date().getTime(),
            type: 1,
            userId: info.key
          })

          if(!script.checkWorkingTime(info.config.workingDay)){
            beforeMessageList.push({
              id: 'missed',
              message: info.config.workingDay.message,
              timestamp: new Date().getTime(),
              type: 1,
              userId: info.key
            })
          }
        }

        setScrollBottom()
        initMessage(beforeMessageList)
        setActiveAddMessage(true)
        setHasBeforeMessage(beforeMessageList.length === PAGE_SIZE)
        startMessageListener(beforeMessageList[beforeMessageList.length - 1].timestamp + 1)
      })
      .finally(() => {
        isLoading(false)
      })

    return ()=> {
      clearMessage()
    }
  }, [info.id])

  return (
    <div
      className="chat-window-body"
      style={{ backgroundColor: '#fff' }}
      ref={body}>

      {hasBeforeMessage && (
        <div
          className="chat-more-message"
          onClick={() => addBeforeMessage()}>
          <div><i className="icon-arrow-up"/>이전 메세지</div>
        </div>
      )}

      {message.map((m, i) => (
        <Message
          info={info}
          key={m.id}
          prev={message[i - 1]}
          next={message[i + 1]}
          onLoadImage={scrollTo}
          {...m}
        />
      ))}



      {chatbotLoading && (
        <div className="message opponent">
          <div className="message-profile">

            { info.config.profileImage ? (
              <div className="message-profile-image">
                <img src={ JSON.parse(info.config.profileImage).location }/>
              </div>
            ) : (
              <div className="message-profile-icon" style={{backgroundColor: info.config.themeColor}}>{ info.config.nickname.substring(0, 1) }</div>
            )}

          </div>
          <div className="message-body">
            <div className="message-top">
            </div>
            <div className="message-bottom">
              <div className="message-inner" style={{width : '65px'}}>
                <div className="chatbot-loading"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {(!chatbotLoading && currentChatbot && currentChatbot.answers?.length > 0) && (
        <div className="chatbot-buttons">
          {currentChatbot.answers.map((answer, index) => (
            <button
              key={`${chatbotHistory.current.length}_${index}`}
              onClick={() => onClickChatbotAnswer(answer)}
              className="chatbot-button">{answer.message}
            </button>
          ))}
        </div>
      )}


      {/* { false && (
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
      )} */}
    </div>
  )
}

export default ChatWindow
