const initialState = {
  key: '',
  id: '',
  userinfo: {},
  connected: false,
  isLoading: false,
};

const info = (state = [], action) => {
  console.log('[action]:', action);
  switch (action.type) {
    case 'CONNECT':
      return {
        ...state,
        key: action.key,
        id: action.id,
        connected: true,
        isLoading: false,
      };
    case 'ADD_USERINFO':
      return {
        ...state,
        userinfo: action.userinfo,
      };
    default:
      return state
  }
}

export default info
