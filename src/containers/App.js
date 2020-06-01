import React from 'react';
import { createPortal } from 'react-dom'
import AddMessage from '../containers/AddMessage'
import VisibleChatWindow from '../containers/VisibleChatWindow'
import Header from './Header'
import Frame from '../components/Frame'
import '../css/style.scss';

import FirebaseConfig from '../../firebase.config';
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/database";

import { connect } from 'react-redux';
import { addUserInfo } from '../actions'

const App = ({ info, addUserInfo }) => {

  // dev
  React.useEffect(() => {
    let cssLink = document.createElement("link");
    cssLink.href = "style.css";
    cssLink.rel = "stylesheet";
    cssLink.type = "text/css";
    document.querySelector('iframe').contentDocument.head.appendChild(cssLink);

    let simmplelineLink = document.createElement("link");
    simmplelineLink.href = "https://cdnjs.cloudflare.com/ajax/libs/simple-line-icons/2.4.1/css/simple-line-icons.min.css";
    simmplelineLink.rel = "stylesheet";
    simmplelineLink.type = "text/css";
    document.querySelector('iframe').contentDocument.head.appendChild(simmplelineLink);
  }, []);

  // prod
  // React.useEffect(() => {
  //   let cssLink = document.createElement("link");
  //   cssLink.href = "https://cdn.jsdelivr.net/gh/gitsimu/chatterbox/prod/style.20200529.css";
  //   cssLink.rel = "stylesheet";
  //   cssLink.type = "text/css";
  //   document.querySelector('iframe').contentDocument.head.appendChild(cssLink);
  // }, []);

  if (!firebase.apps.length) {
    firebase.initializeApp(FirebaseConfig);
  }
  const database = firebase.database();

  React.useEffect(() => {
    const key = info.key;
    const ref = database.ref('/' + key + '/userinfo');
    ref.once('value', function(snapshot) {
      const data = snapshot.val();
      addUserInfo({userinfo : data})
    })
  }, []);

  return (
    <>
    <div
      className='chat-icon'
      onClick={ ()=> {
        window.parent.postMessage({ state: 'open' })
      }}
      >
      <i className="icon-paper-plane" aria-hidden="true"></i>
    </div>
    <Frame>
    <>
      <div className='chat-window'>
        <Header/>
        { info.userinfo && (
          <>
          <VisibleChatWindow database={ database }/>
          <AddMessage database={ database }/>
          </>
        )}
      </div>
    </>
    </Frame>
    </>
  );
};

// export default App;
// export default connect(
//   state => ({ info: state.info }),
//   dispatch => ({ connect: info => dispatch(connect(info)) })
// )(App)
const mapStateToProps = state => ({
  info: state.info,
})
const mapDispatchToProps = dispatch => ({
  addUserInfo: i => dispatch(addUserInfo(i)),
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
