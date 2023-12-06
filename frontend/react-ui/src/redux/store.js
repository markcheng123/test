import { configureStore } from '@reduxjs/toolkit'
import productReducer from './reducer';

export default configureStore({
  reducer: {
    products: productReducer
  }
})
