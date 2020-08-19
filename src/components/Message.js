import React from 'react'
import * as script from '../js/script.js'
import '../css/style.scss'

const Message = (props) => {
  const isMyself = props.info.id === props.userId
  const isSameUser = (props.prev && (props.prev.userId === props.userId))
  const config = props.info.config
  const nickname = config.nickname || 'Opponent'

  const skipDate = () => {
    if (!props.prev) return false
    else {
      const prevDate = script.timestampToDay(props.prev.timestamp)
      const curDate = script.timestampToDay(props.timestamp)

      return (prevDate === curDate)
    }
  }

  const skipTime = () => {
    if (!props.next || props.next.userId !== props.userId) {
      return false
    }

    const nextTime = script.timestampToTime(props.next.timestamp, true)
    const curTime = script.timestampToTime(props.timestamp, true)

    return (nextTime === curTime)
  }

  let messageInner
  if (props.type === 1) {
    messageInner = <div className="message-inner">{ props.message }</div>
  }
  else {
    const images = ['jpg', 'png', 'gif', 'jpeg', 'bmp']
    const extension = JSON.parse(props.message).location.split('.').pop()
    const expired = script.timestampToDay(props.timestamp, 1, 0)

    messageInner =
    <div>
      {( extension && images.indexOf(extension) > -1) && (
        <div
          className="message-thumbnail"
          onClick={() => {
            // window.parent.postMessage({ method: 'image', url: JSON.parse(props.message).location }, '*')
            const chatterbox = document.querySelector('iframe.chatterbox-iframe')
            chatterbox.contentWindow.parent.postMessage({ method: 'image', url: JSON.parse(props.message).location }, '*')
          }}>
          <img src={ JSON.parse(props.message).location }/>
        </div>
      )}
      <div className="message-file">
        <div className="message-file-name">{ JSON.parse(props.message).name }</div>
        <div className="message-file-size">파일크기 : { script.bytesToSize(JSON.parse(props.message).size) }</div>
        <div className="message-file-expire">유효기간 : { expired } 까지</div>
        <div className="message-file-save"
          onClick={() => {
            setTimeout(() => {
              window.open(JSON.parse(props.message).location)
            }, 100)
          }}>
          저장하기
        </div>
      </div>
    </div>
  }

  return (
    <>
      { !skipDate() && (
        <div className="message-date"><span>{script.timestampToDay(props.timestamp)}</span></div>
      )}
      { (!isSameUser || !skipDate()) && (
        <div className="margin-top-15"></div>
      )}

      { isMyself ? (
        <div className="message myself">
          { !skipTime() && (
            <div className="message-time">{ script.timestampToTime(props.timestamp, true) }</div>
          )}
          { messageInner }
        </div>
      ) : (
        <div className="message opponent">
          <div className="message-profile">
            { (!isSameUser || !skipDate()) && (
              <>
              { config.profileImage ? (
                <div className="message-profile-image">
                  <img src={ JSON.parse(config.profileImage).location }/>
                </div>
              ) : (
                <div className="message-profile-icon">{ nickname.substring(0, 1) }</div>
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
              { messageInner }
              <div className="message-time">{ script.timestampToTime(props.timestamp, true) }</div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Message
