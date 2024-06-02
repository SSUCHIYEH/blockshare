import { createSlice } from '@reduxjs/toolkit'

const getSession = (key) =>{
  const data = sessionStorage.getItem(key)
  if(data == 'true') {
    return true
  }
  else {
    return false
  }
}



export const homeSlice = createSlice({
  name: 'home',
  initialState: {
    search: "",
    account: "",
    name: "",
    image: "",
    like: getSession('like'),
    post: getSession('post'),
    first: getSession('first'),
    already: getSession('already')
  },
  reducers: {
    setSearch: (state, action) => {
      state.search = action.payload
    },
    setAccount: (state, action) => {
      state.account = action.payload
    },
    setName: (state, action) => {
      state.name = action.payload
    },
    setImage: (state, action) => {
      state.image = action.payload
    },
    setLike: (state, action) => {
      state.like = action.payload
    },
    setPost: (state, action) => {
      state.post = action.payload
    },
    setAlready: (state, action) => {
      state.already = action.payload
    },
    setFirst: (state, action) => {
      state.first = action.payload
    }
  },
})

export const { setSearch,setAccount,setName,setImage,setPost,setLike,setFirst,setAlready } = homeSlice.actions

export const setSearchAsync = (input) => (dispatch) => {
  setTimeout(() => {
    dispatch(setSearch(input))
  }, 500)
}

export const setAccountAsync = (addr) => (dispatch) => {
  setTimeout(() => {
    dispatch(setAccount(addr))
  }, 500)
}

export const setNameAsync = (name) => (dispatch) => {
  dispatch(setName(name))
}

export const setImageAsync = (image) => (dispatch) => {
  dispatch(setImage(image))
}

export const setPostAsync = (post) => (dispatch) => {
  dispatch(setPost(post))
}

export const setLikeAsync = (like) => (dispatch) => {
  dispatch(setPost(like))
}

export const setAlreadyAsync = (already) => (dispatch) => {
  dispatch(setAlready(already))
}

export const setFirstAsync = (first) => (dispatch) => {
  dispatch(setFirst(first))
}
// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectSearch = (state) => state.home.search

export default homeSlice.reducer
