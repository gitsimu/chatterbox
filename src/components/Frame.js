import React, { useState } from 'react'
import { createPortal } from 'react-dom'

const IFrame = ({ children, ...props }) => {
  const [contentRef, setContentRef] = useState(null)
  const mountNode = contentRef && contentRef.contentWindow.document.body

  return (
    <iframe {...props} ref={setContentRef} style={ {width: '350px', height: '600px', border: 'none', borderRadius: '15px', boxShadow: '0 0 15px 5px rgba(0,0,0,0.1)'} }>
      {mountNode &&
        createPortal(
          React.Children.only(children),
          mountNode
        )}
    </iframe>
  )
}

export default IFrame;
