export const connect = info => ({
  type: 'CONNECT',
  info
})

export const reConnect = info => ({
  type: 'RE_CONNECT',
  id: info.id
})

export const addConfig = info => ({
  type: 'ADD_CONFIG',
  config: info.config
})

export const addMessage = message => ({
  type: 'ADD_MESSAGE',
  message
})

export const clearMessage = () => ({
  type: 'CLEAR_MESSAGE'
})

export const isLoading = l => ({
  type: 'LOADING',
  isLoading: l.isLoading
})
