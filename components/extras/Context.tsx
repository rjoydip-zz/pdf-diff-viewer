import { createContext } from 'react'

export interface ContextInterface {
  pdf: any
  numPages: number
  onLoad?: (args?: any) => void
  onLoadError?: (args?: any) => void
  onLoadSuccess?: (args?: any) => void
}

const ctx = createContext<ContextInterface | null>(null)

export const ContextProvider = ctx.Provider
export const ContextConsumer = ctx.Consumer
