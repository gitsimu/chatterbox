import React from 'react'
import {useSelector} from 'react-redux'

const useMessageGetter = (database) => {
  const id = useSelector(state => state.info.id)
  const key = useSelector(state => state.info.key)

  const minTimestamp = React.useRef(Number.MAX_SAFE_INTEGER)

  const CHAT_REF = React.useRef(null)

  React.useEffect(() => {
    if(!id) return

    return ()=> {
      CHAT_REF.current && CHAT_REF.current.off()
      minTimestamp.current = Number.MAX_SAFE_INTEGER
    }
  }, [id])

  const getMessageList = React.useCallback((count) => {
    return Promise.resolve()
                  .then(() => database.ref(`/${key}/messages/${id}`)
                                      .orderByChild('timestamp')
                                      .limitToLast(count)
                                      .endAt(minTimestamp.current - 1)
                                      .once('value'))
                  .then(snapshots => {
                    if (snapshots.val() === null) return []

                    const arr = []
                    snapshots.forEach(snapshot => {
                      arr.push(snapshot.val())
                    })
                    return arr
                  })
                  .then(arr=> {
                    if(arr.length){
                      minTimestamp.current = Math.min(minTimestamp.current, arr[0].timestamp)
                    }
                    return arr
                  })
  }, [id])

  const onMessageAdded = (timestamp, callback) => {
    CHAT_REF.current = database.ref(`/${key}/messages/${id}`)
                               .orderByChild('timestamp')
                               .startAt(timestamp)
    CHAT_REF.current.on('child_added', (snapshot) => {
      if (snapshot.key === 'userinfo'
        || snapshot.key === 'timestamp') return

      const addedMessage = snapshot.val()

      minTimestamp.current = Math.min(minTimestamp.current, addedMessage.timestamp)

      callback(addedMessage)
    })
  }

  return [getMessageList, onMessageAdded]
}


export default useMessageGetter