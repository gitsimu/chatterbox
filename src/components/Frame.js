import React, { useState } from 'react'
import { createPortal } from 'react-dom'

const IFrame = ({ children, ...props }) => {
  const [active, isActive] = useState(false)
  const [contentsRef, setContentsRef] = useState(null)  
  const [imagePreview, setImagePreview] = useState(null)
  const mountNode = contentsRef && contentsRef.contentWindow.document.body  

  React.useEffect(() => {
    window.addEventListener('message', function(e) {
      if (!e.data.method) return
      // console.log(e.data)

      switch (e.data.method) {
        case 'open':
          isActive(true)
          break
        case 'close':
          isActive(false)
          break
        case 'image':
          setImagePreview(
            <div
              style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000000, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'}}
              onClick={() => {
                setImagePreview(null)
              }}>
              <img style={{ maxHeight: '80%', maxWidth: '80%', borderRadius: 10 }} src={e.data.url} />
            </div>
          )
          break
        default:
          break
      }
    })
    // console.log('iframe ref', contentsRef)
  }, [])

  if (contentsRef) {
    contentsRef.style.setProperty('width', '350px', 'important')
    contentsRef.style.setProperty('height', '600px', 'important')
    contentsRef.style.setProperty('border', 'none', 'important')
    contentsRef.style.setProperty('border-radius', '20px', 'important')
    contentsRef.style.setProperty('box-shadow', '0px 5px 30px 0px rgba(0,0,0,0.1)', 'important')
    contentsRef.style.setProperty('position', 'fixed', 'important')

    contentsRef.style.setProperty('z-index', '9999999999', 'important')

    switch(props.location) {
      case 'lt':
        contentsRef.style.setProperty('top', '15px', 'important')
        contentsRef.style.setProperty('left', '15px', 'important')
        break
      case 'rt':
        contentsRef.style.setProperty('top', '15px', 'important')
        contentsRef.style.setProperty('right', '15px', 'important')
        break
      case 'lb':
        contentsRef.style.setProperty('bottom', '15px', 'important')
        contentsRef.style.setProperty('left', '15px', 'important')
        break
      case 'rb':
      default:
        contentsRef.style.setProperty('bottom', '15px', 'important')
        contentsRef.style.setProperty('right', '15px', 'important')
        break
    }
  }

  return (
    <>
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
    { imagePreview }
    </>
  )
}

export default IFrame
