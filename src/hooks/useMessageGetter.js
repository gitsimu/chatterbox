import React from 'react'
import {useSelector} from 'react-redux'

const useMessageGetter = (database) => {
  const info = useSelector(state => state.info)

  /** @type {{current : firebase.database.Query}} */
  const CHAT_REF = React.useRef(null)

  React.useEffect(() => {
    CHAT_REF.current = database.ref(`/${info.key}/messages/${info.id}`).orderByChild('timestamp')
    return () => {
      CHAT_REF.current.off()
    }
  }, [info.id])

  const getMessageList = React.useCallback((count, timestamp) => {
    const chatRef = CHAT_REF.current

    return Promise.resolve()
                  .then(()=> chatRef.limitToLast(count)
                                    .endAt(timestamp)
                                    .once('value'))
                  .then(snapshots => {
                    if (snapshots.val() === null) return []

                    const arr = []
                    snapshots.forEach(snapshot => {
                      arr.push(snapshot.val())
                    })
                    return arr
                  })
  }, [info.id])

  const onMessageAdded = React.useCallback( timestamp => {
    const chatRef = CHAT_REF.current

    return {
      on: callback => {
        chatRef.startAt(timestamp)
               .on('child_added', (snapshot) => {
                 if (snapshot.key === 'userinfo'
                   || snapshot.key === 'timestamp') return

                 callback(snapshot.val())
               })
      }
    }
  }, [info.id])


  return [getMessageList, onMessageAdded]
}


export default useMessageGetter