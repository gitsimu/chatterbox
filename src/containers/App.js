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
import { addConfig } from '../actions'
import * as global from '../js/global.js'
import '../css/style.scss'

const App = ({ info, addConfig }) => {
  const [iconActive, isIconActive] = React.useState(true)
  const [themeColor, setThemeColor] = React.useState(null)

  // dev
  // React.useEffect(() => {
  //   let cssLink = document.createElement("link")
  //   cssLink.href = "./style.css"
  //   cssLink.rel = "stylesheet"
  //   cssLink.type = "text/css"
  //   document.querySelector('iframe').contentDocument.head.appendChild(cssLink)

  //   let simmplelineLink = document.createElement("link")
  //   simmplelineLink.href = "https://cdnjs.cloudflare.com/ajax/libs/simple-line-icons/2.4.1/css/simple-line-icons.min.css"
  //   simmplelineLink.rel = "stylesheet"
  //   simmplelineLink.type = "text/css"
  //   document.querySelector('iframe').contentDocument.head.appendChild(simmplelineLink)

  //   // Google webfont
  //   // let webfontLink = document.createElement("link")
  //   // webfontLink.href = "https://fonts.googleapis.com/css2?family=Metal+Mania&display=swap"
  //   // webfontLink.rel = "stylesheet"
  //   // document.querySelector('iframe').contentDocument.head.appendChild(webfontLink)
  // }, [])

  // prod
  React.useEffect(() => {
    let cssLink = document.createElement("link")
    cssLink.href = `${global.serverAddress()}/plugin/style.css`    
    cssLink.rel = "stylesheet"
    cssLink.type = "text/css"
    document.querySelector('iframe').contentDocument.head.appendChild(cssLink)
  
    let simmplelineLink = document.createElement("link")
    simmplelineLink.href = "https://cdnjs.cloudflare.com/ajax/libs/simple-line-icons/2.4.1/css/simple-line-icons.min.css"
    simmplelineLink.rel = "stylesheet"
    simmplelineLink.type = "text/css"
    document.querySelector('iframe').contentDocument.head.appendChild(simmplelineLink)
  }, [])

  if (!firebase.apps.length) {
    firebase.initializeApp(FirebaseConfig)
  }
  const database = firebase.database()

  React.useEffect(() => {
    // https://firebase.google.com/docs/database/security/user-security?hl=ko
    getFirebaseAuthToken(info.id)
      .then(res => {
        const data = res.data
        if (data.result === 'success') {
          firebase.auth().signInWithCustomToken(data.token)
            .then(() => {
              const ref = database.ref('/' + info.key + '/config')
              ref.once('value', snapshot => {
                const data = snapshot.val()
                addConfig({config : data})
                setThemeColor(data.themeColor)
              })
            })
            .catch(error => {
              alert('인증에 실패하였습니다.')
              if (error) { throw error }
            })
        }
      })
      .catch(error => {
        alert('인증 서버가 동작하지 않습니다.')
        if (error) { throw error }
      })
  }, [])
 
  return (
    <>
    { themeColor && (
      <div
        className={iconActive ? 'chat-icon active' : 'chat-icon'}
        style={{ backgroundColor: themeColor }}
        onClick={ () => {
          window.parent.postMessage({ method: 'open' }, '*')
          isIconActive(false)
        }}>

        <img src={`${global.serverAddress()}/resources/icon01_256.png`} alt="chat-icon"/>
      </div>
    )}

    <Frame>
      <div className='chat-window'>
        <Header isIconActive={ isIconActive }/>
        { (info.config && Object.keys(info.config).length !== 0) && (
          <>
          <VisibleChatWindow database={ database }/>
          <AddMessage database={ database }/>
          { info.isLoading && (
            <div id="loading"><div></div></div>
          )}
          </>
        )}
      </div>
    </Frame>
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
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
