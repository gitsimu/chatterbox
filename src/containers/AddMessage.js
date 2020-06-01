import React from 'react'
import { connect } from 'react-redux'
import { addMessage } from '../actions'

import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/database";

import '../css/style.scss';

const AddMessage = ({ database, dispatch, info, state }) => {
  let input

  return (
    <div className="bottom">
      <form onSubmit={e => {
        e.preventDefault()

        if (!input.value.trim()) {
          return
        }

        const messageId = Math.random().toString(36).substr(2, 9);
        const databaseRef = '/' + info.key + '/messages/' + info.id + '/' + messageId;

        database.ref(databaseRef).set({
            id: messageId,
            userId: info.id,
            message: input.value,
            type: 1,
            timestamp: new Date().getTime()
        });

        input.value = ''
      }}>
        <div className="addOns">
          <i className="icon-paper-clip" aria-hidden="true"></i>
          <i className="icon-emotsmile" aria-hidden="true"></i>
        </div>
        <input className="message-input" ref={node => input = node} placeholder="메세지를 입력해주세요." />
        <button className="message-button-send" type="submit">
          <i className="icon-paper-plane" aria-hidden="true" onClick={() => {  }}></i>
        </button>
      </form>
    </div>
  )
}

const mapStateToProps = state => ({
  info: state.info,
  message: state.message,
})

export default connect(mapStateToProps)(AddMessage)
