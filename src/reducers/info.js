const initialState = {
  id: '',
  connected: false,
  isLoading: false,
};

const info = (state = [], action) => {
  console.log('[action]:', action);
  switch (action.type) {
    case 'CONNECT':
      return {
        ...state,
        id: action.id,
        connected: true,
        isLoading: false,
      };
    default:
      return state
  }
}

export default info
