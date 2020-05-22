import React from 'react';
import AddMessage from '../containers/AddMessage'
import VisibleChatWindow from '../containers/VisibleChatWindow'
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
  }, []);

  firebase.initializeApp(FirebaseConfig);
  const database = firebase.database();

  return (
    <>
      <h3 className="title">Hello, React & Redux</h3>
      <div className="chat-window">
        <VisibleChatWindow database={ database }/>
        <AddMessage database={ database }/>
      </div>
    </>
  );
};

export default App;
