import React from 'react'
import * as script from '../js/script.js'
import '../css/style.scss'
import ChatMessageInner from './ChatMessageInner'

const Message = (props) => {
  const isMyself = props.info.id === props.userId
  const isSameUser = (props.prev && (props.prev.userId === props.userId))
  const config = props.info.config
  const nickname = config.nickname || 'Manager'

  const skipDate = () => {
    if (!props.prev) return false

    const prevDate = script.timestampToDay(props.prev.timestamp)
    const curDate = script.timestampToDay(props.timestamp)

    return (prevDate === curDate)
  }

  const skipTime = () => {
    if ([3, 4].includes(props.type)) return true

    if (!props.next || props.next.userId !== props.userId) {
      return false
    }

    const nextTime = script.timestampToTime(props.next.timestamp, true)
    const curTime = script.timestampToTime(props.timestamp, true)

    return (nextTime === curTime)
  }

  const imageView = (url) => {
    const chatterbox = document.querySelector('iframe.chatterbox-iframe')
    chatterbox.contentWindow.parent.postMessage({
      method: 'image',
      url: url
    }, '*')
  }

  return (
    <>
      { !skipDate() && (
        // 날짜 표시 yyyy.mm.dd
        <div className="message-date"><span>{script.timestampToDay(props.timestamp)}</span></div>
      )}

      { isMyself ? (
        // 방문자 메세지
        <div className="message myself">
          { !skipTime() && (
            <div className="message-time">{ script.timestampToTime(props.timestamp, true) }</div>
          )}

          <ChatMessageInner
            type={props.type}
            message={props.message}
            onClickLink={url=> window.open(url)}
            onClickImage={url=> imageView(url)}
            onLoadImage={props.onLoadImage}
            timestamp={props.timestamp}
          />
        </div>
      ) : (
        // 관리자 메세지
        <div className="message opponent">
          <div className="message-profile">
            { (!isSameUser || !skipDate()) && (
              <>
                { config.profileImage ? (
                  <div className="message-profile-image">
                    <img src={ JSON.parse(config.profileImage).location }/>
                  </div>
                ) : (
                  <div className="message-profile-icon" style={{backgroundColor: config.themeColor}}>{ nickname.substring(0, 1) }</div>
                )}
              </>
            )}
          </div>
          <div className="message-body">
            { (!isSameUser || !skipDate()) && (
              <div className="message-top">
                <div className="message-name">{ nickname }</div>
              </div>
            )}
            <div className="message-bottom">

              <ChatMessageInner
                type={props.type}
                message={props.message}
                onClickLink={url=> window.open(url)}
                onClickImage={url=> imageView(url)}
                onLoadImage={props.onLoadImage}
                timestamp={props.timestamp}
              />

              { !skipTime() && (
                <div className="message-time">{ script.timestampToTime(props.timestamp, true) }</div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// export default ChatMessage
export default React.memo(Message)

