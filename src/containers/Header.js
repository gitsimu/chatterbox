import React from 'react';
import '../css/style.scss';

import { connect } from 'react-redux';

const Header = ({ props, info, isIconActive }) => {
  const config = info.config

  return (
    <div className="header">
        <div className="header-title">
          { config && (
            <>
              <div className="main">{config.title}</div>
              <div className="sub">{config.subTitle}</div>
            </>
          )}
        </div>
        <div
          className="header-close"
          onClick={() => {
            window.parent.postMessage({ state: 'close' })
            isIconActive(true);
          }}>
        </div>
    </div>
  )
}

const mapStateToProps = state => ({
  info: state.info,
})

export default connect(mapStateToProps)(Header)
