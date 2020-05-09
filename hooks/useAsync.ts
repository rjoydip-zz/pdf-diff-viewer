import { DependencyList, useEffect, useState } from 'react'

export default function useAsync<T, Args extends any[] = any[]>(
  fn: (...args: Args | any[]) => Promise<T> | undefined | null,
  deps: DependencyList = []
): T | object {
  const [val, setVal] = useState<T | object>({ loading: true })
  useEffect(() => {
    const promise = fn()
    if (promise === undefined || promise === null) return
    promise.then((value) =>
      setVal({
        value,
        loading: false,
      })
    )
  }, deps)
  return val
}
