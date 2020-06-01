const initialState = {
  key: '',
  id: '',
  config: {},
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
    case 'ADD_CONFIG':
      return {
        ...state,
        config: action.config,
      };
    default:
      return state
  }
}

export default info
