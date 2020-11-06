import React from 'react'

const useScrollTo = (element, deps) => {
  const prevHeight = React.useRef(0)
  React.useEffect(()=> {scrollTo()}, deps)

  const scrollTo = ()=> element && (element.scrollTop = element.scrollHeight - prevHeight.current)
  const setScrollBottom = ()=> prevHeight.current = 0
  const setScrollFix = () => element && (prevHeight.current = element.scrollHeight)

  return [scrollTo, setScrollBottom, setScrollFix]
}


export default useScrollTo