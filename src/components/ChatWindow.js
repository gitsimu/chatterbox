import React from 'react'
import Message from './Message'
import * as script from '../js/script.js'
import useMessageGetter from '../hooks/useMessageGetter'
import useScrollTo from '../hooks/useScrollTo'

const PAGE_SIZE = 50
const ChatWindow = ({info, message, initMessage, addMessage, pagingMessage, database, isLoading}) => {
  const body = React.useRef(null)
  const [page, setPage] = React.useState(0)
  const chatStartTime = React.useRef(new Date().getTime())
  const [hasBeforePage, setHasBeforePage] = React.useState(false)

  const [getMessageList, onMessageAdded] = useMessageGetter(database, chatStartTime.current)
  const [scrollTo, setScrollBottom, setScrollFix] = useScrollTo(body.current, [message])

  React.useEffect(() => {
    if (page === 0) return

    (page === 1 ? setScrollBottom : setScrollFix)()

    const lastTimestamp = page === 1
      ? chatStartTime.current
      : message[0].timestamp - 1

    isLoading(true)
    Promise.resolve()
           .then(() => getMessageList(PAGE_SIZE, lastTimestamp))
           .then(addedMessageList => {
             if (addedMessageList.length === 0) {
               /* 대화내용 없음 */
               addedMessageList.push({
                 id: 'first',
                 message: info.config.firstMessage,
                 timestamp: chatStartTime.current,
                 type: 1,
                 userId: info.key
               })
             }

             setHasBeforePage(addedMessageList.length === PAGE_SIZE)
             pagingMessage(addedMessageList)
           })
           .finally(() => {
             isLoading(false)
           })
  }, [info.id, page])

  React.useEffect(() => {
    if (!script.checkWorkingTime(info.config.workingDay)) {
      initMessage([{
        id: 'missed',
        message: info.config.workingDay.message,
        timestamp: chatStartTime.current,
        type: 1,
        userId: info.key
      }])

      return
    }

    setPage(1)
    onMessageListner()
  }, [info.id])

  const onMessageListner = () => {
    onMessageAdded(chatStartTime.current + 1)
      .on(addedMessage => {
        setScrollBottom()
        addMessage(addedMessage)
      })
  }

  return (
    <div
      className="chat-window-body"
      style={{backgroundColor: '#fff'}}
      ref={body}>

      {hasBeforePage && (
        <div
          className="chat-more-message"
          onClick={() => {
            setPage(p => p + 1)
          }}>
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
