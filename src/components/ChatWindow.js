import React from 'react';
import { addMessage } from '../actions'
import Message from './Message'

const ChatWindow = ({ info, message, addMessage, database }) => {
  const body = React.useRef(null)
  const chatRef = database.ref('/messages/simu1689').orderByChild('timestamp');

  React.useEffect(() => {
    console.log('userEffect');
    chatRef.on('child_added', function(snapshot) {
      const m = snapshot.val();
      addMessage(m);
      console.log('[child_add]', m);

      setTimeout(() => {
        scrollToBottom();
      }, 100)
    });
  }, []);

  function scrollToBottom() {
    if (body && body.current) {
      body.current.scrollTop = body.current.scrollHeight;
    }
  }

  return (
    <div className="chat-window-body"
      ref={body}
      >
      { message.map((m, i) => (
        <Message
          info={info}
          key={m.id}
          {...m}
        />
      )) }
    </div>
  )
}

export default ChatWindow
