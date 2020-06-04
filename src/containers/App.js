import React from 'react';
import { createPortal } from 'react-dom'
import AddMessage from '../containers/AddMessage'
import VisibleChatWindow from '../containers/VisibleChatWindow'
import Header from './Header'
import Frame from '../components/Frame'
import axios from 'axios';
import FirebaseConfig from '../../firebase.config';
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/database";

import { connect } from 'react-redux';
import { addConfig } from '../actions'
import '../css/style.scss';

const App = ({ info, addConfig }) => {
  const [iconActive, isIconActive] = React.useState(true);

  // dev
  React.useEffect(() => {
    let cssLink = document.createElement("link");
    cssLink.href = "./style.css";
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
    // https://firebase.google.com/docs/database/security/user-security?hl=ko
    getFirebaseAuthToken(info.id)
      .then(res => {
        const data = res.data;
        if (data.result === 'success') {
          firebase.auth().signInWithCustomToken(data.token)
            .then(success => {
              const ref = database.ref('/' + info.key + '/config');
              ref.once('value', snapshot => {
                const data = snapshot.val();
                addConfig({config : data})
              })
            })
            .catch(error => {
              alert('인증에 실패하였습니다.');
            });
        }
      })
      .catch(error => {
        alert('인증 서버가 동작하지 않습니다.');
      })
  }, []);

  return (
    <>
    <div
      className={iconActive ? 'chat-icon active' : 'chat-icon'}
      onClick={ () => {
        window.parent.postMessage({ state: 'open' })
        isIconActive(false);
      }}
      >
      <i className="icon-paper-plane" aria-hidden="true"></i>
    </div>
    <Frame>
      <div className='chat-window'>
        <Header isIconActive={ isIconActive }/>
        { info.config && (
          <>
          <VisibleChatWindow database={ database }/>
          <AddMessage database={ database }/>
          </>
        )}
      </div>
    </Frame>
    </>
  );
};

// async function getFirebaseToken(uuid) {
//   const postResponse = await fetch('//localhost:3000/api/auth?uuid=' + uuid, {
//       method: 'POST',
//       headers: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/x-www-form-urlencoded'
//       },
//     });
//
//   const postData = await postResponse.json();
//   return postData;
// }

const getFirebaseAuthToken = async (uuid) => {
  const res = await axios.post('//localhost:3000/api/auth', { uuid: uuid })
  return await res;
}


const mapStateToProps = state => ({
  info: state.info,
})
const mapDispatchToProps = dispatch => ({
  addConfig: i => dispatch(addConfig(i)),
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
