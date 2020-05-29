import React from 'react';
import '../css/style.scss';

const Header = (props) => {
  return (
    <div className="header">
        <div className="header-title">
          <div>Hi there</div>
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

export default Header
