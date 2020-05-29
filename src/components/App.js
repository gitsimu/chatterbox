import React from 'react';
import { createPortal } from 'react-dom'
import AddMessage from '../containers/AddMessage'
import VisibleChatWindow from '../containers/VisibleChatWindow'
import Header from '../components/Header'
import Frame from './Frame'
import '../css/style.scss';

import FirebaseConfig from '../../firebase.config';
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/database";

const App = () => {

  // dev
  React.useEffect(() => {
    let cssLink = document.createElement("link");
    cssLink.href = "style.css";
    cssLink.rel = "stylesheet";
    cssLink.type = "text/css";
    document.querySelector('iframe').contentDocument.head.appendChild(cssLink);
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

  return (
    <>
    <div
      className='chat-icon'
      onClick={ ()=> {
        window.parent.postMessage({ state: 'open' })
      }}
      >
    </div>
    <Frame>
    <>
      <div className='chat-window'>
        <Header/>
        <VisibleChatWindow database={ database }/>
        <AddMessage database={ database }/>
      </div>
    </>
    </Frame>
    </>
  );
};

export default App;
