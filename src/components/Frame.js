import React, { useState } from 'react'
import { createPortal } from 'react-dom'

const IFrame = ({ children, ...props }) => {
  const [contentsRef, setContentsRef] = useState(null)
  const [active, isActive] = useState(false);
  const mountNode = contentsRef && contentsRef.contentWindow.document.body

  React.useEffect(() => {
    window.addEventListener('message', function(e) {
      if (!e.data.state) return;
      console.log(e.data);
      isActive(e.data.state === 'open' ? true : false);
    });

    console.log('iframe ref', contentsRef)
  }, []);

  if (contentsRef) {
    contentsRef.style.setProperty('width', '350px', 'important');
    contentsRef.style.setProperty('height', '600px', 'important');
    contentsRef.style.setProperty('border', 'none', 'important');
    contentsRef.style.setProperty('border-radius', '20px', 'important');
    contentsRef.style.setProperty('box-shadow', '0 0 15px 5px rgba(0,0,0,0.2)', 'important');
    contentsRef.style.setProperty('position', 'fixed', 'important');
    contentsRef.style.setProperty('bottom', '15px', 'important');
    contentsRef.style.setProperty('right', '15px', 'important');
    contentsRef.style.setProperty('z-index', '999999', 'important');
  }

  return (
    <iframe
      {...props}
      className={active ? 'chatterbox-iframe active' : 'chatterbox-iframe'}
      ref={setContentsRef}>
      {mountNode &&
        createPortal(
          React.Children.only(children),
          mountNode
        )}
    </iframe>
  )
}

export default IFrame;
