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
    <div>
      <form onSubmit={e => {
        e.preventDefault()

        if (!input.value.trim()) {
          return
        }

        const messageId = Math.random().toString(36).substr(2, 9);
        const userId = 'simu1689';

        database.ref('/messages/' + userId + '/' + messageId).set({
            id: messageId,
            userId: info.id,
            message: input.value,
            type: 1,
            timestamp: new Date().getTime()
        });

        input.value = ''
      }}>
        <input className="message-input" ref={node => input = node} />
        <button className="message-button-send" type="submit">
          Send1
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
