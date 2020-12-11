import React, { useState } from 'react'
import { createPortal } from 'react-dom'

const IFrame = ({ children, ...props }) => {
  const [active, isActive] = useState(false)
  const [contentsRef, setContentsRef] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const mountNode = contentsRef && contentsRef.contentWindow.document.body

  React.useEffect(() => {
    if (!contentsRef) return

    window.addEventListener('message', function(e) {
      if (!e.data.method) return      

      switch (e.data.method) {
        case 'open':
          isActive(true)
          break
        case 'close':
          isActive(false)          
          setTimeout(() => {
            contentsRef.style.setProperty('z-index', '-1', 'important')
          }, 500)
          break
        case 'image':
          setImagePreview(
            <div
              style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999999999, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'}}
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
    
    // console.log(e.data)
    // console.log('iframe ref', contentsRef)
  }, [contentsRef])

  if (contentsRef) {
    let cssText = 'width: 350px !important;' 
      + 'height: 600px !important;'
      + 'border: none !important;' 
      + 'border-radius: 20px !important;' 
      + 'box-shadow: rgba(0, 0, 0, 0.1) 0px 5px 30px 0px !important;' 
      + 'position: fixed !important;'
      + 'z-index: 9999999999 !important;'

    switch(props.location) {
      case 'lt':        
        cssText += 'top: 15px !important;'
        cssText += 'left: 15px !important;'
        break
      case 'rt':        
        cssText += 'top: 15px !important;'
        cssText += 'right: 15px !important;'
        break
      case 'lb':        
        cssText += 'bottom: 15px !important;'
        cssText += 'left: 15px !important;'
        break
      case 'rb':
      default:        
        cssText += 'bottom: 15px !important;'
        cssText += 'right: 15px !important;'
        break
    }

    contentsRef.style.cssText = cssText
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
