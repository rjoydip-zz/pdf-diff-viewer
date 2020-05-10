import { useEffect } from 'react'

export const useEffectWrapper = (fn: any) => useEffect(fn(), [])

export * from './useAsync'
export * from './useAsyncFn'
export * from './useDarkMode'
export * from './useMountedState'