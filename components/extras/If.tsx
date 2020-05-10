import React from 'react'

type IfTypes = {
  condition: boolean | number
  children?: React.ReactNode
  render?: Function
}

const If: React.FC<IfTypes> = ({ condition, render, children }) =>
  condition ? (render ? render() : children) : null

export { If }
export default If
