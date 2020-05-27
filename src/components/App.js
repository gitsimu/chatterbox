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
  // third party
  const script = document.createElement('script');

  React.useEffect(() => {
    let cssLink = document.createElement("link");
    cssLink.href = "style.css";
    cssLink.rel = "stylesheet";
    cssLink.type = "text/css";
    document.querySelector('iframe').contentDocument.head.appendChild(cssLink);
    // document.querySelector('iframe').contentDocument.write("<style></style>")
  }, []);

  firebase.initializeApp(FirebaseConfig);
  const database = firebase.database();

  return (
    <Frame>
    <>
      <h3 className="title">Hello, React & Redux</h3>
      <div className="chat-window">
        <Header/>
        <VisibleChatWindow database={ database }/>
        <AddMessage database={ database }/>
      </div>
    </>
    </Frame>
  );
};

export default App;
