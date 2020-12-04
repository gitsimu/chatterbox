import React from 'react';

const ChatMessageText = ({onClick, message, ...props}) => {
  return (
    <div
      style={
        onClick ? {cursor : 'pointer'} : {}
      }
      onClick={() => onClick && onClick()}
      className="message-inner">

      {message}
    </div>
  )
}

export default ChatMessageText