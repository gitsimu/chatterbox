import { connect } from 'react-redux'
import { addMessage } from '../actions'
import ChatWindow from '../components/ChatWindow'

const mapStateToProps = state => ({
  info: state.info,
  message: state.message,
})

const mapDispatchToProps = dispatch => ({
  addMessage: m => dispatch(addMessage(m)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ChatWindow);
