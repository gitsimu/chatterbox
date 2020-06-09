import React from 'react'
import { connect } from 'react-redux'
import { addMessage } from '../actions'
import axios from 'axios';
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/database";
import EmojiConatiner from '../components/EmojiConatiner'
import '../css/style.scss';
import '../js/global.js'


const AddMessage = ({ database, dispatch, info, state }) => {
  const [emojiContainer, showEmojiContainer] = React.useState(false);
  const [selectedEmoji, selectEmoji] = React.useState(null);
  let input

  React.useEffect(() => {
    console.log(selectedEmoji);
    if (input && selectedEmoji) {
      input.value = input.value + selectedEmoji.emoji;
    }
  }, [selectedEmoji]);

  const sendMessage = (key, id, message, type, database) => {
    const messageId = Math.random().toString(36).substr(2, 9);
    database.ref('/' + key + '/messages/' + id + '/userinfo').update({
      lastMessage: message,
      timestamp: new Date().getTime(),
    })
    database.ref('/' + key + '/messages/' + id + '/' + messageId).update({
      id: messageId,
      userId: id,
      message: message,
      type: type,
      timestamp: new Date().getTime()
    })
    // const messageData = {
    //   timestamp: new Date().getTime(),
    //   userinfo: {
    //     lastMessage: message,
    //   }
    // }
    // messageData[messageId] = {
    //   id: messageId,
    //   userId: id,
    //   message: message,
    //   type: type,
    //   timestamp: new Date().getTime()
    // }
    //
    // database.ref('/' + key + '/messages/' + id).update(messageData);
  }

  const handleFileInput = async (e) => {
    const config = { headers: { 'content-type': 'multipart/form-data' } }
    const formData = new FormData();
    formData.append('file', e.target.files[0]);
    formData.append('key', info.key);

    dispatch({ type: 'LOADING', isLoading: true });

    return axios.post(global.serverAddress + '/api/upload', formData, config)
      .then(res => {
        console.log('upload-success', res);
        dispatch({ type: 'LOADING', isLoading: false });

        if (res.data.result === 'success') {
          sendMessage(info.key, info.id, JSON.stringify(res.data.file), 2, database);
        }
      })
      .catch(err => {
        console.log('upload-failure', err);
        dispatch({ type: 'LOADING', isLoading: false });
      })
  }

  const handleEmojiContainer = (e) => {
    showEmojiContainer(!emojiContainer)
  }

  return (
    <div className="bottom">
      <EmojiConatiner
        getState={emojiContainer}
        setState={showEmojiContainer}
        selectEmoji={selectEmoji}/>
      <form onSubmit={e => {
        e.preventDefault()

        if (!input.value.trim()) { return; }

        sendMessage(info.key, info.id, input.value, 1, database);
        showEmojiContainer(false);
        input.value = ''
      }}>
        <div className="addOns">
          <label>
            <i className="icon-paper-clip"></i>
            <input type="file" onChange={e => handleFileInput(e)}/>
          </label>
          <i className="icon-emotsmile"
            onClick={e => handleEmojiContainer(e)}></i>
        </div>
          <input className="message-input" ref={node => input = node} placeholder="메세지를 입력해주세요." />
        <button className="message-button-send" type="submit">
          <i className="icon-paper-plane" aria-hidden="true" onClick={() => {  }}></i>
        </button>
      </form>
    </div>
  )
}

const mapStateToProps = state => ({
  info: state.info,
  message: state.message,
})

export default connect(mapStateToProps)(AddMessage)
