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
import { addConfig } from '../actions'

const App = ({ info, addConfig }) => {

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
  //   cssLink.href = "https://cdn.jsdelivr.net/gh/gitsimu/chatterbox/prod/style.20200602.css";
  //   cssLink.rel = "stylesheet";
  //   cssLink.type = "text/css";
  //   document.querySelector('iframe').contentDocument.head.appendChild(cssLink);
  //
  //   let simmplelineLink = document.createElement("link");
  //   simmplelineLink.href = "https://cdnjs.cloudflare.com/ajax/libs/simple-line-icons/2.4.1/css/simple-line-icons.min.css";
  //   simmplelineLink.rel = "stylesheet";
  //   simmplelineLink.type = "text/css";
  //   document.querySelector('iframe').contentDocument.head.appendChild(simmplelineLink);
  // }, []);

  if (!firebase.apps.length) {
    firebase.initializeApp(FirebaseConfig);
  }
  const database = firebase.database();

  React.useEffect(() => {
    const key = info.key;

    // firebase authorized
    getFirebaseToken(info.id)
      .then(data => {
        console.log('[Firebase Auth] token', data);
        if (data.result === 'success') {
          firebase.auth().signInWithCustomToken(data.token)
            .then(success => {
              console.log('[Firebase Auth Valid]', success);
              const ref = database.ref('/' + key + '/config');
              ref.once('value', function(snapshot) {
                const data = snapshot.val();
                addConfig({config : data})
              })
            })
            .catch(error => {
              console.log('[Firebase Auth Invalid]', error);
            });
        }
      })
      .catch(error => {
        console.log('[Firebase Auth] error', error);
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
        { info.config && (
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

async function getFirebaseToken(uuid) {
  const postResponse = await fetch('//localhost:3000/api/auth?uuid=' + uuid, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
    });

  const postData = await postResponse.json();
  return postData;
}

// export default App;
// export default connect(
//   state => ({ info: state.info }),
//   dispatch => ({ connect: info => dispatch(connect(info)) })
// )(App)
const mapStateToProps = state => ({
  info: state.info,
})
const mapDispatchToProps = dispatch => ({
  addConfig: i => dispatch(addConfig(i)),
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
