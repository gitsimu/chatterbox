export const connect = info => ({
  type: 'CONNECT',
  info
})

export const addConfig = info => ({
  type: 'ADD_CONFIG',
  config: info.config,
})

export const addMessage = message => ({
  type: 'ADD_MESSAGE',
  message
})
