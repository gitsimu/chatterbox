import React, { useState } from 'react'
import { createPortal } from 'react-dom'

const IFrame = ({ children, ...props }) => {
  const [contentRef, setContentRef] = useState(null)
  const [opacity, setOpacity] = useState(1);
  const mountNode = contentRef && contentRef.contentWindow.document.body

  window.addEventListener('message', function(e) {
    console.log(e.data);
    if (e.data.state === 'close') {
      setOpacity(0);
    }
    else {
      setOpacity(1);
    }
  });

  return (
    <iframe {...props}
      className='chatterbox-iframe'
      ref={setContentRef}
      style={ {
        opacity: opacity,
        visibility: opacity === 0 ? 'hidden' : 'visible',
        width: '350px',
        height: '600px',
        border: 'none',
        borderRadius: '15px',
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
