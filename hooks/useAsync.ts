import { DependencyList, useEffect, useState } from 'react'
import { AsyncState } from './useAsyncFn'

function useAsync<Result = any, Args extends any[] = any[]>(
  fn: (...args: Args | any[]) => Promise<Result> | undefined | null,
  deps: DependencyList = []
): AsyncState<Result> {
  const [val, setVal] = useState<AsyncState<Result>>({
    loading: true,
    value: null,
    error: null,
  })
  useEffect(() => {
    const promise = fn()
    if (promise === undefined || promise === null) return
    promise
      .then((value) =>
        setVal({
          value,
          error: null,
          loading: false,
        })
      )
      .catch((error) =>
        setVal({
          error,
          value: null,
          loading: false,
        })
      )
  }, deps)
  return val
}

export { useAsync }
export default useAsync
