import { DependencyList, useCallback, useState } from 'react'

export type AsyncState<T> =
  | {
      loading: boolean
      error?: null
      value?: null
    }
  | {
      loading: false
      error: Error
      value?: null
    }
  | {
      loading: false
      error?: null
      value: T
    }

export type AsyncFn<Result = any, Args extends any[] = any[]> = [
  AsyncState<Result>,
  (...args: [] | Args) => void
]

export default function useAsyncFn<Result = any, Args extends any[] = any[]>(
  fn: (...args: Args | any[]) => Promise<Result>,
  deps: DependencyList = []
): AsyncFn<Result, Args> {
  const [state, setState] = useState<AsyncState<Result>>({
    loading: true,
    value: null,
    error: null,
  })
  const callback = useCallback((...args: Args | []) => {
    const promise = fn(...args)
    if (promise === undefined || promise === null) return
    promise
      .then((value) => {
        setState({
          ...value,
          loading: false,
        })
        return state
      })
      .catch((error) => {
        setState({
          ...error,
          loading: false,
        })
        return state
      })
  }, deps)
  return [state, callback]
}
