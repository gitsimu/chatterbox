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

export const initMessage = message => ({
  type: 'INIT_MESSAGE',
  message
})

export const addMessage = message => ({
  type: 'ADD_MESSAGE',
  message
})

export const clearMessage = () => ({
  type: 'CLEAR_MESSAGE'
})

export const pagingMessage = message => ({
  type: 'PAGING_MESSAGE',
  message
})

export const isLoading = l => ({
  type: 'LOADING',
  isLoading: l.isLoading
})

export const authEnd = ()=> ({
  type : 'AUTH_END'
})
