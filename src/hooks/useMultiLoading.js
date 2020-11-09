import React from 'react'

const useMultiLoading = (init) => {
  // 하나라도 로딩중이면 loading = true
  const [loading, isLoading] = React.useState(init.some(t => t))

  const loadingDic = React.useRef(init)
  const isLoadings = init.map((_, index) => {
    return (is) => {
      loadingDic.current[index] = is
      isLoading(loadingDic.current.some(t => t))
    }
  })

  return [loading, ...isLoadings]
}


export default useMultiLoading