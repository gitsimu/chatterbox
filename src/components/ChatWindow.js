import React from 'react';
import { addMessage } from '../actions'
import Message from './Message'

const ChatWindow = ({ message, addMessage, database }) => {
  const chatRef = database.ref('/messages/simu1689').orderByChild('timestamp');

  React.useEffect(() => {
    console.log('userEffect');
    chatRef.on('child_added', function(snapshot) {
      const m = snapshot.val();
      addMessage(m);
    });
  }, []);

  return (
    <div>
      { message.map((m, i) => (
        <Message
          key={m.id}
          {...m}
        />
      )) }
    </div>
  )
}

export default ChatWindow
