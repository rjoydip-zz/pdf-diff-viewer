import { createContext } from 'react'

export interface ContextInterface {
  pdf: any,
  numPages: number
}

const ctx = createContext<ContextInterface | null>(null)

export const ContextProvider = ctx.Provider
export const ContextConsumer = ctx.Consumer
