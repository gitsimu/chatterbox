import React from 'react'
import AddMessage from '../containers/AddMessage'
import VisibleChatWindow from '../containers/VisibleChatWindow'
import Header from './Header'
import Frame from '../components/Frame'
import axios from 'axios'
import FirebaseConfig from '../../firebase.config'
import * as firebase from "firebase/app"
import "firebase/auth"
import "firebase/firestore"
import "firebase/database"

import { connect } from 'react-redux'
import { addConfig, reConnect } from '../actions'
import * as global from '../js/global.js'
import * as script from '../js/script.js'
import '../css/style.scss'

const App = ({ info, addConfig, reConnect }) => {
  const [iconActive, isIconActive] = React.useState(true)
  const [themeColor, setThemeColor] = React.useState('#0080F7')
  const [activate, isActivate] = React.useState(true)
  const [loading, isLoading] = React.useState(false)
  const [closed, isClosed] = React.useState(false)
  const [opened, isOpened] = React.useState(false)
  const [connected, isConnected] = React.useState(false)
  const [database, setDatabase] = React.useState(null)

  const [iconStyle, setIconStyle] = React.useState(null)
  const [iconImageStyle, setIconImageStyle] = React.useState(null)
  
  React.useEffect(() => {
    /* iframe에 Element를 추가할 때 Firefox에서 정상적으로 추가가 되지 않는데 setTimeout을 사용하여 해결
     * https://bugzilla.mozilla.org/show_bug.cgi?id=297685
     */
    setTimeout(() => {
      const iframe = document.querySelector('iframe.chatterbox-iframe')
      if (iframe) {
        let cssLink = document.createElement("link")
        cssLink.href = `${global.serverAddress()}/plugin/style.css` // prod
        // cssLink.href = "./style.css" // dev
        cssLink.rel = "stylesheet"
        cssLink.type = "text/css"
        iframe.contentDocument.head.appendChild(cssLink)

        let simmplelineLink = document.createElement("link")
        simmplelineLink.href = "https://cdnjs.cloudflare.com/ajax/libs/simple-line-icons/2.4.1/css/simple-line-icons.min.css"
        simmplelineLink.rel = "stylesheet"
        simmplelineLink.type = "text/css"
        iframe.contentDocument.head.appendChild(simmplelineLink)
      }
    }, 100)

    /* 채팅 아이콘 위치, 크기, 표시 설정 */
    const initIconConfig = () => {
      const isMobile = script.mobileCheck()
      const conf = isMobile ? info.iconConfig.mobile : info.iconConfig.pc
      const icon = {
        background: info.iconConfig.themeColor
      }
      const iconImage = {
        width: parseInt(conf.size)
      }

      switch(info.iconConfig.position) {
        case 'lt':
          icon.top = parseInt(conf.axisY)
          icon.bottom = 'auto'
          icon.left = parseInt(conf.axisX)
          icon.right = 'auto'
          break
        case 'rt':
          icon.top = parseInt(conf.axisY)
          icon.bottom = 'auto'
          icon.left = 'auto'
          icon.right = parseInt(conf.axisX)
          break
        case 'lb':
          icon.top = 'auto'
          icon.bottom = parseInt(conf.axisY)
          icon.left = parseInt(conf.axisX)
          icon.right = 'auto'
          break
        case 'rb':
          icon.top = 'auto'
          icon.bottom = parseInt(conf.axisY)
          icon.left = 'auto'
          icon.right = parseInt(conf.axisX)
          break
      }
      // console.log('iconConfig', isMobile, icon, iconImageStyle)

      setIconStyle(icon)
      setIconImageStyle(iconImage)
    }
    initIconConfig()    
  }, [])
  
  React.useEffect(() => {
    if (!opened) return

    console.info('[Smartlog] chat connected')
    !firebase.apps.length && firebase.initializeApp(FirebaseConfig)
    const _database = firebase.database()

    let configRef
    let userRef

    Promise.resolve()
      .then(() => { isLoading(true)})
      .then(() => {
        return getFirebaseAuthToken(info.id)
          .then(({data}) => {
            if (data.result !== 'success') throw new Error()
            return data
          })
          .catch(() => { throw new Error('인증 서버에서 연결을 거부하였습니다.')})
      })
      .then(data => {
        console.log('token', data.token)
        return firebase.auth().signInWithCustomToken(data.token)
          .catch(() => { throw new Error('인증에 실패하였습니다.')})
      })
      .then(() => {
        configRef = _database.ref(`/${info.key}/config`)
        configRef.once('value', snapshot => {
          const data = snapshot.val()
          const initConfig = {
            title: '채팅 상담',
            subTitle: '보통 몇 분 내에 응답합니다',
            nickname: 'Manager',
            firstMessage: '방문해주셔서 감사합니다.\n궁금한 내용을 편하게 남겨주세요.',
            themeColor: '#444c5d',
            email: '',
            mobile: '',
          }

          let config
          if (data) {
            config = {
              title: data.title || initConfig.title,
              subTitle: data.subTitle || initConfig.subTitle,
              nickname: data.nickname || initConfig.nickname,
              firstMessage: data.firstMessage || initConfig.firstMessage,
              themeColor: data.themeColor || initConfig.themeColor,
              email: data.email || initConfig.email,
              mobile: data.mobile || initConfig.mobile,
              profileImage: data.profileImage || null
            }
          }
          else {
            config = initConfig
          }

          addConfig({config: config})
          setThemeColor(config.themeColor)

          if (data && data.workingDay) {
            isActivate(script.checkWorkingTime(data.workingDay))
          }
        })
      })
      .then(() => {
        userRef = _database.ref(`/${info.key}/users/${info.id}`)
        userRef.on('value', snapshot => {
          const data = snapshot.val()
          isClosed(data && data.state === 2)
        })

        isConnected(true)
        setDatabase(_database)
      })
      .catch((error) => error.messages && alert(error.messages))
      .finally(() => {        
        isLoading(false)
      })

    return () => {
      configRef.off()
      userRef.off()
    }
  }, [info.id, opened])
 
  return (
    <>
      {activate && (
        <>
          {themeColor && (
            <div
              className={iconActive ? 'chat-icon active' : 'chat-icon'}
              style={iconStyle}
              onClick={() => {
                // window.parent.postMessage({ method: 'open' }, '*')
                const chatterbox = document.querySelector('iframe.chatterbox-iframe')
                chatterbox.contentWindow.parent.postMessage({ method: 'open' }, '*')
                isIconActive(false)
                isOpened(true)
              }}>
              {/* <img src={`${global.serverAddress()}/resources/icon_bubble_256.png`} alt="chat-icon"/> */}
              <img style={iconImageStyle} src={`${global.serverAddress()}/resources/icon_bubble_256.png`} alt="chat-icon"/>
            </div>
          )}
          <Frame location={info.iconConfig.position}>
            <div className='chat-window'>
              <Header isIconActive={isIconActive}/>
              {(opened && connected && info.config && Object.keys(info.config).length !== 0) ? (
                <>
                  <VisibleChatWindow database={ database } isLoading={ isLoading }/>
                  {closed ? (
                    <>
                      <div style={{backgroundColor: '#fff', height: 50}}></div>
                      <div 
                        className="chat-closed" 
                        onClick={() => {
                          const uuid = script.uuidv4()
                          script.setCookie('chatterboxToken', uuid, 3)
                          reConnect({id: uuid})
                          isClosed(false)
                        }}>
                        <div className="chat-closed-text">
                          <div>관리자에 의해 대화가 종료되었습니다.</div>
                          <div>새 대화를 시작하려면 아래 버튼을 클릭해주세요.</div>
                        </div>
                        <div className="chat-new-connect">
                          새 대화 시작하기
                        </div>
                      </div>
                    </>
                  ) : (
                    <AddMessage database={ database }/>
                  )}
                </>
              ) : (
                <div style={{height: '100%', backgroundColor: '#fff'}}></div>
              )}
              {loading && (
                <div id="loading"><div></div></div>
              )}
            </div>
          </Frame>
        </>
      )}
    </>
  )
}

const getFirebaseAuthToken = async (uuid) => {
  const res = await axios.post(`${global.serverAddress()}/api/auth`, { uuid: uuid })
  return await res
}

const mapStateToProps = state => ({
  info: state.info,
})
const mapDispatchToProps = dispatch => ({
  addConfig: i => dispatch(addConfig(i)),
  reConnect: i => dispatch(reConnect(i))
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
