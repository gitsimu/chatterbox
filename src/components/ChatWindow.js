import React from 'react'
import Message from './Message'
import * as script from '../js/script.js'
import useMessageGetter from '../hooks/useMessageGetter'
import useScrollTo from '../hooks/useScrollTo'
import useSendMessage from '../hooks/useSendMessage'

const PAGE_SIZE = 50
const ChatWindow = ({info, message, clearMessage, initMessage, addMessage, pagingMessage, database, isLoading, setActiveAddMessage}) => {
  const body = React.useRef(null)
  const [hasBeforePage, setHasBeforePage] = React.useState(false)
  const [currentChatbot, setCurrentChatbot] = React.useState(null)
  const [chatbotQnABox, setChatbotQnABox] = React.useState([
    {
      id: 1,
      questions: [
        {message: '첫번째 메시지.', type: 1},
        {message: '선택하세요.', type: 1},
      ],
      answers: [
        {to: 2, message: '11111111111111111111111111111111111111111111111111'},
        {to: 2, message: '1111'},
        {to: 2, message: '2222222222222222222222222222222222222222222222222'},
        {to: 2, message: '33'},
        {to: 3, message: '44'},
        {to: 4, message: '555555555555555555555555555555555555555'},
        {to: 4, message: '1'}
      ]
    },
    {
      id: 2,
      questions: [
        {message: '2번입니다.', type: 1},
        {message: '다시 선택하세요.', type: 1}
      ],
      answers: [
        {to: 1, message: '1번 질 문'},
        {to: 3, message: '3번질문ㄱ'},
        {to: 4, message: '상담원 연결할게요'}
      ]
    },
    {
      id: 3,
      questions: [
        {message: '3번입니다', type: 1},
        {message: '끝.', type: 1}
      ],
      answers: [
        {to: 1, message: '1번'},
        {to: 2, message: '2번'},
        {to: 4, message: '상담원 연결'}
      ]
    },
    {
      id:4,
      questions: [
        {message : "상담사를 연결합니다", type: 1},
        {
          message: '{"name":"호빵.png","size":142814,"location":"https://smartlog.s3.ap-northeast-2.amazonaws.com/chat/vb0kpl5gv/7Kdzirv3vMfh.png"}',
          type: 2
        }
      ],
      action : 'chat'
    }
  ])
  const chatbotHistory = React.useRef([])

  const [getMessageByDB, onAddedMessage] = useMessageGetter(database)
  const [scrollTo, setScrollBottom, setScrollFix] = useScrollTo(body.current, [message])
  const [sendMessage, sendMessageList] = useSendMessage(database)

  const chatbotStartTime = ()=> {
    return true
  }

  const startMessageListener = (startTimestamp)=> {
    onAddedMessage(startTimestamp, (addedMessage) => {
      setScrollBottom()
      addMessage(addedMessage)
    })
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

    const question = chatbotQnABox.find(question => question.id === answer.to)
    setCurrentChatbot(question)
  }

  const addBeforeMessage = ()=> {
    setScrollFix()
    isLoading(true)
    Promise.resolve()
           .then(() => getMessageByDB(PAGE_SIZE, message[0].timestamp - 1))
           .then(beforeMessageList => {
             setHasBeforePage(beforeMessageList.length === PAGE_SIZE)
             pagingMessage(beforeMessageList)
             isLoading(false)
           })
  }

  const startChatbot = () => {
    setCurrentChatbot(chatbotQnABox[0])
    setHasBeforePage(false)
    setActiveAddMessage(false)
  }

  React.useEffect(() => {
    if(!currentChatbot) return

    let currentTimestamp = new Date().getTime()
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

    if(currentChatbot.action === "chat"){
      setActiveAddMessage(true)
      sendMessageList(chatbotHistory.current)
      startMessageListener(currentTimestamp)
    }

  }, [currentChatbot])

  // 유저 채팅방 on
  React.useEffect(() => {

    isLoading(true)

    Promise.resolve()
           .then(() => {
             return script.checkWorkingTime(info.config.workingDay)
                  ? getMessageByDB(PAGE_SIZE)
                  : [{id: 'missed', message: info.config.workingDay.message, timestamp: new Date().getTime(), type: 1, userId: info.key}]
           })
           .then((beforeMessageList) => {

             // 기존 대화내역 없고 챗봇 활성화 시간인 경우
             if(beforeMessageList.length === 0 && chatbotStartTime()) {
               startChatbot()
               return
             }

             if(beforeMessageList.length === 0){
               beforeMessageList.push({id: 'first', message: info.config.firstMessage, timestamp: new Date().getTime(), type: 1, userId: info.key})
             }

             setScrollBottom()
             initMessage(beforeMessageList)
             setActiveAddMessage(true)
             setHasBeforePage(beforeMessageList.length === PAGE_SIZE)
             startMessageListener(beforeMessageList[beforeMessageList.length - 1].timestamp + 1)
           })
           .finally(()=> {
             isLoading(false)
           })

    return ()=> {
      clearMessage()
    }
  }, [info.id])

  return (
    <div
      className="chat-window-body"
      style={{backgroundColor: '#fff'}}
      ref={body}>

      {hasBeforePage && (
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

      {(currentChatbot && currentChatbot.answers && currentChatbot.answers.length) && (
        <div
          style={{
            textAlign:'right',
            margin :'15px'
          }}>
          {currentChatbot.answers.map((answer, index) => (
            <button
              key={`${chatbotHistory.current.length}_${index}`}
              onClick={() => onClickChatbotAnswer(answer)}
              style={{
                fontSize: '15px',
                maxWidth: '280px',
                margin: '3px 5px',
                wordBreak: 'break-word',
                backgroundColor: '#fff',
                borderRadius: '15px',
                borderColor: 'rgb(228, 228, 229)',
                borderWidth: '1px',
                borderStyle: 'solid',
                padding: '10px',
                cursor: 'pointer',
                animation: 'fadein .3s ease-in-out',
                outline: 'none !important',
                boxShadow: 'none !important'
              }}

              className="chatbot-message">{answer.message}
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
