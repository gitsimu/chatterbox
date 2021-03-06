const initialState = {
  key: '',
  id: '',
  ck: '',
  muid: '',
  ip: '',
  svid: '',
  config: {},
  connected: false,
  isLoading: false,
  auth : false,
  themeColor: '#444C5E',
  iconConfig: {},
  customData: {}
}

const info = (state = initialState, action) => {
  // console.log('[action]:', action)
  switch (action.type) {
    case 'CONNECT':
      return {
        ...state,
        key: action.key,
        id: action.id,
        ck: action.ck,
        muid: action.muid,
        ip: action.ip,
        svid: action.svid,
        connected: true,
        isLoading: false,
        iconConfig: action.iconConfig,
        customData: action.customData
      }
    case 'RE_CONNECT':
      return {
        ...state,
        id: action.id
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
    case 'AUTH_END':
      return {
        ...state,
        auth : true
      }
    default:
      return state
  }
}

export default info
