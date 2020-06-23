import React from 'react'
import '../css/style.scss'

import { connect } from 'react-redux'

const Header = ({ info, isIconActive }) => {
  const config = info.config
  const themeColor = config.themeColor
  
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
          window.parent.postMessage({ method: 'close' }, '*')
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
