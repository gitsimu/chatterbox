const initialState = {
  key: '',
  id: '',
  ck: '',
  muid: '',
  config: {},
  connected: false,
  isLoading: false,
  themeColor: '#444C5E'
}

const info = (state = initialState, action) => {
  console.log('[action]:', action)
  switch (action.type) {
    case 'CONNECT':
      return {
        ...state,
        key: action.key,
        id: action.id,
        ck: action.ck,
        muid: action.muid,
        connected: true,
        isLoading: false
      }
    case 'ADD_CONFIG':
      return {
        ...state,
        config: action.config
      }
    case 'LOADING':
      return {
        ...state,
        isLoading: action.isLoading
      }
    default:
      return state
  }
}

export default info
