import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './productsSlice';
import planningReducer from './planningSlice';
import materialsReducer from './materialsSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    planning: planningReducer,
    materials: materialsReducer,
  },
});