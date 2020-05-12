import { useContext, useReducer, createContext } from 'react'
import { viewerReducer } from '../lib/redux/reducer'
import initialState from '../lib/redux/store'
import { ViewerActionTypes } from '../lib/redux/types'

const StateContext = createContext<any>({})
const DispatchContext = createContext<any>({})

function ViewerProvider({ children }: any) {
  const [state, dispatch] = useReducer(viewerReducer, initialState)
  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}

function useViewerState() {
  const context = useContext(StateContext)
  if (context === undefined) {
    throw new Error('useState must be used within a Provider')
  }
  return context
}

function useViewerDispatch() {
  const context = useContext(DispatchContext)
  if (context === undefined) {
    throw new Error('useState must be used within a Provider')
  }
  return context
}

export { ViewerProvider, useViewerState, useViewerDispatch }
