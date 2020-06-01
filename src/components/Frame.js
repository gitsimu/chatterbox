import React, { useState } from 'react'
import { createPortal } from 'react-dom'

const IFrame = ({ children, ...props }) => {
  const [contentRef, setContentRef] = useState(null)
  const [active, isActive] = useState(false);
  const mountNode = contentRef && contentRef.contentWindow.document.body

  window.addEventListener('message', function(e) {
    if (!e.data.state) return;
    console.log(e.data);
    isActive(e.data.state === 'open' ? true : false);
  });

  return (
    <iframe {...props}
      className={active ? 'chatterbox-iframe active' : 'chatterbox-iframe'}
      ref={setContentRef}
      style={ {
        width: '350px',
        height: '600px',
        border: 'none',
        borderRadius: '20px',
        boxShadow: '0 0 15px 5px rgba(0,0,0,0.2)',
        position: 'fixed',
        bottom: 15,
        right: 15,
        zIndex: 99999,
      } }>
      {mountNode &&
        createPortal(
          React.Children.only(children),
          mountNode
        )}
    </iframe>
  )
}

export default IFrame;
