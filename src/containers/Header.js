import React from 'react'
import { connect } from 'react-redux'
import '../css/style.scss'

const Header = ({ info, isIconActive }) => {
  const config = info.config
  const themeColor = config.themeColor
  // info.iconConfig.themeColor
  return (
    <div className="header"
      style={{ backgroundColor: themeColor }}>
      <div className="header-image">
        { config.profileImage && (
          <img src={ JSON.parse(config.profileImage).location }/>
        )}
      </div>
      <div className="header-title">
        { config && (
          <>
            <div className="main">{config.title}</div>
            <div className="sub">{config.subTitle}</div>
          </>
        )}
      </div>
      <div className="header-close"
        onClick={() => {
          // window.parent.postMessage({ method: 'close' }, '*')
          const chatterbox = document.querySelector('iframe.chatterbox-iframe')
          chatterbox.contentWindow.parent.postMessage({ method: 'close' }, '*')
          isIconActive(true)
        }}>
        </div>
    </div>
  )
}

const mapStateToProps = state => ({
  info: state.info,
})

export default connect(mapStateToProps)(Header)
