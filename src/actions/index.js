export const connect = info => ({
  type: 'CONNECT',
  info
})

export const addUserInfo = info => ({
  type: 'ADD_USERINFO',
  userinfo: info.userinfo,
})

export const addMessage = message => ({
  type: 'ADD_MESSAGE',
  message
})
