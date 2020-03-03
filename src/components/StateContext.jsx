import React, { createContext, useReducer } from 'react'
import { initialState, reducer } from '../reducer/reducer'

export const Context = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  return <StateContext.Provider value={{ state, dispatch }}>{children}</StateContext.Provider>
}
export const StateContext = createContext(null)
