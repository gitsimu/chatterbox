import { connect } from 'react-redux'
import { initMessage, addMessage, clearMessage, pagingMessage } from '../actions'
import ChatWindow from '../components/ChatWindow'

const mapStateToProps = state => ({
  info: state.info,
  message: state.message,
})

const mapDispatchToProps = dispatch => ({
  initMessage: m => dispatch(initMessage(m)),
  addMessage: m => dispatch(addMessage(m)),
  clearMessage: () => dispatch(clearMessage()),
  pagingMessage: m => dispatch(pagingMessage(m))
})

export default connect(mapStateToProps, mapDispatchToProps)(ChatWindow)
