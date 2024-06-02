import { configureStore, createSlice } from '@reduxjs/toolkit';
import homeReducer from './slice';
import contractReducer from './contractSlice';


export default configureStore({
	reducer: {
		contract: contractReducer,
	  home: homeReducer,
	},
})