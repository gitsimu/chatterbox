import React from 'react';
import { addMessage } from '../actions'
import Message from './Message'

const ChatWindow = ({ info, message, addMessage, database }) => {
  const body = React.useRef(null)
  const databaseRef = '/' + info.key + '/messages/' + info.id;
  const chatRef = database.ref(databaseRef).orderByChild('timestamp');
  const [required, isRequired] = React.useState(false);

  React.useEffect(() => {
    chatRef.once('value', (snapshot) => {
      if (snapshot.val() === null ) {
        addMessage({
          id: "first",
          message: info.config.firstMessage,
          timestamp: new Date().getTime(),
          type: 1,
          userId: info.key,
        });
      }

      // 개인정보 받기
      // if (!snapshot.val().userdata) {
      //   isRequired(true);
      // }
    })
    chatRef.on('child_added', function(snapshot) {
      const m = snapshot.val();
      addMessage(m);
      console.log('   [child_add]', m);

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
          prev={message[i - 1]}
          {...m}
        />
      )) }

      {
        false && (
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
        )
      }
    </div>
  )
}

export default ChatWindow
