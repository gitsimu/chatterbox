const message = (state = [], action) => {
  switch (action.type) {
    case 'INIT_MESSAGE':
      return [
        ...action.message
      ]
    case 'ADD_MESSAGE':
      return [
        ...state,
        action.message
      ]
    case 'CLEAR_MESSAGE':
      return []
    case 'PAGING_MESSAGE':
      return [
        ...action.message,
        ...state
      ]
    default:
      return state
  }
}

export default message
