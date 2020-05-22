import React from 'react';
import '../css/style.scss';

const Message = (props) => {
  const messageClassName = 'message opponent'
  return (
    <div className={messageClassName}>
      <div className="message-inner">
        { props.message }
      </div>
    </div>
  )
}

export default Message
