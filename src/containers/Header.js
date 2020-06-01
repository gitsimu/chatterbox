import React from 'react';
import '../css/style.scss';

import { connect } from 'react-redux';

const Header = ({ props, info }) => {
  const userinfo = info.userinfo

  return (
    <div className="header">
        <div className="header-title">
          { userinfo && (
            <div>{userinfo.title}</div>
          )}
        </div>
        <div
          className="header-close"
          onClick={ ()=> {
            window.parent.postMessage({ state: 'close' })
          }}
          ></div>
    </div>
  )
}

const mapStateToProps = state => ({
  info: state.info,
})

export default connect(mapStateToProps)(Header)
