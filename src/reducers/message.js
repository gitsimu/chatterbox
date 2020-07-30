const message = (state = [], action) => {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return [
        ...state,
        action.message
      ]
    case 'CLEAR_MESSAGE':
      return []
    default:
      return state
  }
}

export default message
