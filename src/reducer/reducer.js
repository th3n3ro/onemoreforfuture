import * as types from './types'
export const initialState = {
  selectedDataUrl: null,
  showLoader: false,
  loadedData: null,
  errorMessage: null
}

export const reducer = (state, action) => {
  switch (action.type) {
    case types.SELECT_DATA_URL: {
      const selectedDataUrl = action.payload
      return { ...state, selectedDataUrl, showLoader: true }
    }
    case types.DATA_LOADING_SUCSESS: {
      const data = action.payload
      return { ...state, loadedData: data, showLoader: false }
    }
    case types.DATA_LOADING_FAIL: {
      const errorMessage = action.payload
      return { ...state, errorMessage, showLoader: false }
    }
    case types.ADD_USER: {
      const newUser = action.payload
      const oldUsers = state.loadedData
      return { ...state, loadedData: [newUser, ...oldUsers] }
    }
    default: {
      return state
    }
  }
}
