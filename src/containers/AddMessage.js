import React from 'react'
import {connect} from 'react-redux'
import axios from 'axios'
import EmojiContainer from '../components/EmojiContainer'
import * as global from '../js/global.js'
import '../css/style.scss'
import useSendMessage from '../hooks/useSendMessage'

const AddMessage = ({database, dispatch, info}) => {
  const [emojiContainer, showEmojiContainer] = React.useState(false)
  const [selectedEmoji, selectEmoji] = React.useState(null)
  const [sendMessage] = useSendMessage(database)

  let form, input

  React.useEffect(() => {
    if (input && selectedEmoji) {
      input.value = input.value + selectedEmoji.emoji
    }
  }, [selectedEmoji])

  const checkFile = React.useCallback((target) => {
    const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
    const ALLOW_FILE_EXTENSIONS = [
      'jpg', 'jpeg', 'gif', 'bmp', 'png', 'tif', 'tiff', 'tga', 'psd', 'ai', // 이미지
      'mp4', 'm4v', 'avi', 'asf', 'wmv', 'mkv', 'ts', 'mpg', 'mpeg', 'mov', 'flv', 'ogv', // 동영상
      'mp3', 'wav', 'flac', 'tta', 'tak', 'aac', 'wma', 'ogg', 'm4a', // 음성
      'doc', 'docx', 'hwp', 'txt', 'rtf', 'xml', 'pdf', 'wks', 'wps', 'xps',
      'md', 'odf', 'odt', 'ods', 'odp', 'csv', 'tsv', 'xls', 'xlsx', 'ppt',
      'pptx', 'pages', 'key', 'numbers', 'show', 'ce', // 문서
      'zip', 'gz', 'bz2', 'rar', '7z', 'lzh', 'alz' // 압축
    ]

    const fileSize = target.size
    const fileExtension = target.name.split('.').pop().toLowerCase()

    if (MAX_FILE_SIZE < fileSize) {
      alert('한 번에 업로드 할 수 있는 최대 파일 크기는 5MB 입니다.')
      return false
    }

    if (ALLOW_FILE_EXTENSIONS.indexOf(fileExtension) === -1) {
      alert('지원하지 않는 파일 형식입니다.')
      return false
    }

    return true
  }, [])

  const handleFileInput = async (e) => {
    const target = e.target.files[0]
    if (!checkFile(target)) return

    const config = {headers: {'content-type': 'multipart/form-data'}}
    const formData = new FormData()
    formData.append('file', target)
    formData.append('key', info.key)

    dispatch({type: 'LOADING', isLoading: true})

    return axios.post(`${global.serverAddress()}/api/upload`, formData, config)
                .then(res => {
                  if (res.data.result === 'success') {
                    sendMessage(JSON.stringify(res.data.file), 2)
                  }
                })
                .catch(err => {
                  if (err) throw err
                })
                .finally(() => {
                  dispatch({type: 'LOADING', isLoading: false})
                })
  }

  const handleFileInputClear = (e) => {
    e.target.value = ''
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

        sendMessage(input.value, 1)
        showEmojiContainer(false)
        input.value = ''
      }}>
        <div className="addOns">
          <label>
            <i className="icon-paper-clip"></i>
            <input type="file" onChange={e => handleFileInput(e)} onClick={e => handleFileInputClear(e)}/>
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
                      let submitEvent
                      if (typeof (Event) === 'function') {
                        submitEvent = new Event('submit')
                      } else {
                        submitEvent = document.createEvent('Event')
                        submitEvent.initEvent('submit', true, true)
                      }
                      form.dispatchEvent(submitEvent)
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
  message: state.message
})

export default connect(mapStateToProps)(AddMessage)
