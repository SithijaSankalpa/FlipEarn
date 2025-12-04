import {configureStore} from '@reduxjs/toolkit'
import listingReducer from './features/listingslice'
import chatReducer from './features/chatSlice'

export const store = configureStore({
  reducer: {
    listing: listingReducer,
    chat: chatReducer
  }
})