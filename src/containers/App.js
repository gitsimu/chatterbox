import React from 'react'
import AddMessage from '../containers/AddMessage'
import VisibleChatWindow from '../containers/VisibleChatWindow'
import Header from './Header'
import Frame from '../components/Frame'
import axios from 'axios'
import FirebaseConfig from '../../firebase.config'
import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/performance'

import {connect} from 'react-redux'
import {addConfig, authEnd, reConnect} from '../actions'
import * as global from '../js/global.js'
import * as script from '../js/script.js'
import '../css/style.scss'
import useMultiLoading from '../hooks/useMultiLoading'

// fetch polyfill
import 'whatwg-fetch'

const App = ({ info, addConfig, reConnect, authEnd }) => {
  const [iconActive, isIconActive] = React.useState(true)
  const [activate, isActivate] = React.useState(true)
  const [closed, isClosed] = React.useState(false)
  const [opened, isOpened] = React.useState(false)
  const [database, setDatabase] = React.useState(null)
  const [user, setUser] = React.useState(null)
  const [loading, isAppLoading, isChatLoading] = useMultiLoading([false, false])
  const [iconStyle, setIconStyle] = React.useState(null)
  const [iconImageStyle, setIconImageStyle] = React.useState(null)
  const [iconText, setIconText] = React.useState(null)
  const [activeAddMessage, setActiveAddMessage] = React.useState(false)

  React.useEffect(() => {
    /* iframe에 Element를 추가할 때 Firefox에서 정상적으로 추가가 되지 않는데 setTimeout을 사용하여 해결
     * https://bugzilla.mozilla.org/show_bug.cgi?id=297685
     */
    setTimeout(() => {
      const iframe = document.querySelector('iframe.chatterbox-iframe')
      if (iframe) {
        let cssLink = document.createElement("link")
        cssLink.href = 'https://src.smlog.co.kr/css/style.css' // prod
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
        background: info.iconConfig.themeColor,
        top: 'auto',
        bottom: 'auto',
        left: 'auto',
        right: 'auto'
      }
      const iconImage = {
        width: parseInt(conf.size)
      }

      switch(info.iconConfig.position) {
        case 'lt':
          icon.top = parseInt(conf.axisY)          
          icon.left = parseInt(conf.axisX)          
          break
        case 'rt':
          icon.top = parseInt(conf.axisY)          
          icon.right = parseInt(conf.axisX)
          break
        case 'lb':          
          icon.bottom = parseInt(conf.axisY)
          icon.left = parseInt(conf.axisX)          
          break
        case 'rb':          
          icon.bottom = parseInt(conf.axisY)          
          icon.right = parseInt(conf.axisX)
          break
      }

      if (conf.text) {
        const text = decodeURIComponent(conf.text)
        const textHtml = <div className="chat-icon-text" style={conf.textAlign === 'right' ? {paddingRight: 20} : {paddingLeft: 20}}>{text}</div>
        if (conf.textAlign === 'right') {
          icon.flexFlow = 'row-reverse'
        }
        setIconText(textHtml)
      }
      
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
    const perf = firebase.performance()

    const configRef = _database.ref(`/${info.key}/config`)
    const userRef = _database.ref(`/${info.key}/users/${info.id}`)

    isAppLoading(true)

    const setConfig = Promise
      .resolve()
      .then(() => configRef.once('value'))
      .then(snapshot => {


        const data = snapshot.val()
        const initConfig = {
          title: '채팅 상담',
          subTitle: '보통 몇 분 내에 응답합니다',
          nickname: 'Manager',
          firstMessage: '방문해주셔서 감사합니다.\n궁금한 내용을 편하게 남겨주세요.',
          themeColor: '#444c5d',
          email: '',
          mobile: '',
          chatbot: {
            state : '0'
          }
        }

        let config
        if (data) {
          config = {
            chatbot: data.chatbot || initConfig.chatbot,
            title: data.title || initConfig.title,
            subTitle: data.subTitle || initConfig.subTitle,
            nickname: data.nickname || initConfig.nickname,
            firstMessage: data.firstMessage || initConfig.firstMessage,
            themeColor: data.themeColor || initConfig.themeColor,
            email: data.email || initConfig.email,
            mobile: data.mobile || initConfig.mobile,
            profileImage: data.profileImage || null,
            workingDay : data.workingDay,
          }
        } else {
          config = initConfig
        }

        setDatabase(_database)
        addConfig({config: config})
        isAppLoading(false)

        if (data && data.workingDay) {
          isActivate(script.checkWorkingTime(data.workingDay) || config.chatbot.state !== 3)
        }
      })

    const setAuth = setConfig
      .then(() => {
        return getFirebaseAuthToken(info.id)
          .then(({data}) => {
            if (data.result !== 'success') throw new Error()
            return data
          })
          .catch(() => {
            throw new Error('인증 서버에서 연결을 거부하였습니다.')
          })
      })
      .then(data => {

        return firebase.auth()
                       .signInWithCustomToken(data.token)
                       .then(() => authEnd())
                       .catch(() => {
                         throw new Error('인증에 실패하였습니다.')
                       })
      })

    const setConfigAfter = setConfig
      .then(() => {
        userRef.on('value', snapshot => {
          const data = snapshot.val()
          isClosed(data && data.state === 2)
        })
      })

    const setAuthAfter = setAuth
      .then(()=> userRef.once('value'))
      .then(snapshot => {
        const data = snapshot.val()
        isClosed(data && data.state === 2)
        setUser(data)

        // Live connect
        if (data && data.live !== 1) {
          userRef.child('live').set(1)
        }
      })
      .then(()=> {
        // Live disconnect
        userRef.onDisconnect().update({live: 0})
        window.onbeforeunload = () => {
          userRef.child('live').set(0)
        }
      })

    Promise.all([setConfig, setAuth, setConfigAfter, setAuthAfter])
           .catch((error) => error.messages && alert(error.messages))

    return () => {
      configRef.off()
      userRef.off()
    }
  }, [info.id, opened])

  return (
    <>
      {activate && (
        <>
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
            {iconText && (iconText)}
            <img style={iconImageStyle} src={`${global.serverAddress()}/resources/icon_bubble_256.png`} alt="chat-icon"/>
          </div>
          <Frame location={info.iconConfig.position}>
            <div className='chat-window'>
              <Header isIconActive={isIconActive}/>
              {(opened && info.config && Object.keys(info.config).length !== 0) ? (
                <>
                  <VisibleChatWindow database={ database } isLoading={ isChatLoading } setActiveAddMessage={setActiveAddMessage} />

                  {closed && (
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
                  )}

                  {(!closed && activeAddMessage) && (<AddMessage database={database}/>)}

                  {(!closed && !activeAddMessage) && (<div style={{height: '100%', backgroundColor: '#fff'}}></div>)}


                </>
              ) : (
                <div style={{height: '100%', backgroundColor: '#fff'}}></div>
              )}

              {(loading) && (
                <div id="loading"><div></div></div>
              )}
            </div>
          </Frame>
        </>
      )}
    </>
  )
}

const getFirebaseAuthToken = (uuid) => {
  return axios.post(`${global.serverAddress()}/api/auth`, { uuid: uuid })
}

const mapStateToProps = state => ({
  info: state.info,
})
const mapDispatchToProps = dispatch => ({
  addConfig: i => dispatch(addConfig(i)),
  reConnect: i => dispatch(reConnect(i)),
  authEnd: () => dispatch(authEnd())
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
