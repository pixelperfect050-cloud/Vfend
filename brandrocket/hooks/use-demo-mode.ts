'use client'

import * as React from 'react'

export function useDemoMode() {
  const [isDemoMode, setIsDemoMode] = React.useState(false)
  const [isLoaded, setIsLoaded] = React.useState(false)

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsDemoMode(document.cookie.includes('demo_session=true'))
    setIsLoaded(true)
  }, [])

  return { isDemoMode, isLoaded }
}
