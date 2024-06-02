import { createSlice } from '@reduxjs/toolkit'
import { BsCloudSnowFill } from 'react-icons/bs'

export const contractSlice = createSlice({
  name: 'contract',
  initialState: {
    nft: {},
    postwork: {},
    authwork: {}
  },
  reducers: {
    setNFT: (state, action) => {
      state.nft = action.payload
    },
    setPostwork: (state, action) => {
      state.postwork = action.payload
    },
    setAuthwork: (state, action) => {
      state.authwork = action.payload
    },
  },
})

export const { setNFT,setPostwork,setAuthwork } = contractSlice.actions

export const setNFTAsync = (data) => (dispatch) => {
  setTimeout(() => {
    dispatch(setNFT(data))
  }, 500)
}

export const setPostworkAsync = (data) => (dispatch) => {
  setTimeout(() => {
    dispatch(setPostwork(data))
  }, 1000)
}

export const setAuthworkAsync = (data) => (dispatch) => {
  setTimeout(() => {
    dispatch(setAuthwork(data))
  }, 500)
}

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`


export default contractSlice.reducer
