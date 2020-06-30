import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import EmojiContainer from '../components/EmojiContainer'
import * as global from '../js/global.js'
import '../css/style.scss'

const AddMessage = ({ database, dispatch, info }) => {
  const [emojiContainer, showEmojiContainer] = React.useState(false)
  const [selectedEmoji, selectEmoji] = React.useState(null)
  let form, input

  React.useEffect(() => {    
    if (input && selectedEmoji) {
      input.value = input.value + selectedEmoji.emoji
    }
  }, [selectedEmoji])

  const sendMessage = (key, id, message, type, database) => {
    const messageId = Math.random().toString(36).substr(2, 9)
    const lastMessage = (type === 2) ? JSON.parse(message).name : message.trim()

    database.ref(`/${key}/users/${id}`).update({
      lastMessage: lastMessage,
      timestamp: new Date().getTime()
    })
    database.ref(`/${key}/messages/${id}/${messageId}`).update({
      id: messageId,
      userId: id,
      message: message.trim(),
      type: type,
      timestamp: new Date().getTime()
    })
    database.ref(`/${key}/recents`).update({
      userId: id,
      message: message.trim()
    })
  }

  const handleFileInput = async (e) => {
    const config = { headers: { 'content-type': 'multipart/form-data' } }
    const formData = new FormData()
    formData.append('file', e.target.files[0])
    formData.append('key', info.key)

    dispatch({ type: 'LOADING', isLoading: true })

    return axios.post(`${global.serverAddress()}/api/upload`, formData, config)
      .then(res => {
        console.log('upload-success', res)
        dispatch({ type: 'LOADING', isLoading: false })

        if (res.data.result === 'success') {
          sendMessage(info.key, info.id, JSON.stringify(res.data.file), 2, database)
        }
      })
      .catch(err => {
        console.log('upload-failure', err)
        dispatch({ type: 'LOADING', isLoading: false })
        if (err) throw err;
      })
  }

  const handleEmojiContainer = () => {
    showEmojiContainer(!emojiContainer)
  }

  return (
    <div className="bottom">
      <EmojiContainer
        getState={emojiContainer}
        setState={showEmojiContainer}
        selectEmoji={selectEmoji}/>
      <form ref={node => form = node} onSubmit={e => {
        e.preventDefault()        
        if (!input.value.trim()) return

        sendMessage(info.key, info.id, input.value, 1, database)
        showEmojiContainer(false)
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
        <textarea className="message-input" 
          ref={node => input = node} 
          placeholder="메세지를 입력해주세요."
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              form.dispatchEvent(new Event('submit'))
            }
          }}/>
        <button className="message-button-send" type="submit">
          <i className="icon-paper-plane" aria-hidden="true"></i>
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
