import React from 'react'
import { connect } from 'react-redux'
import { addMessage } from '../actions'

import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/database";

const AddMessage = ({ database, dispatch }) => {
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
            userId: userId,
            message: input.value,
            type: 1,
            timestamp: new Date().getTime()
        });


        dispatch(addMessage(input.value))
        input.value = ''
      }}>
        <input ref={node => input = node} />
        <button type="submit">
          Send
        </button>
      </form>
    </div>
  )
}

export default connect()(AddMessage)
