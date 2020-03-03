import * as types from './types'

export const selectDataUrl = selectedDataUrl => ({
  type: types.SELECT_DATA_URL,
  payload: selectedDataUrl
})
export const fetchDataStart = () => ({
  type: types.DATA_LOADING_START
})
export const fetchDataSucsess = data => ({
  type: types.DATA_LOADING_SUCSESS,
  payload: data
})
export const fetchDataFail = errorMessage => ({
  type: types.DATA_LOADING_FAIL,
  payload: errorMessage
})
export const addUser = user => ({
  type: types.ADD_USER,
  payload: user
})
