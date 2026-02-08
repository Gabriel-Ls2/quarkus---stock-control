import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../api/api';

// fetch products action (GET) - Used in the List
export const fetchProducts = createAsyncThunk('products/fetch', async () => {
  const response = await api.get('/products');
  return response.data;
});

// Save Product Action (POST) - Used in the Form
export const saveProduct = createAsyncThunk('products/save', async (productData) => {
  const response = await api.post('/products', productData);
  return response.data;
});

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // handling the fetch (Search/Retrieve)
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      
      // save handling
      .addCase(saveProduct.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(saveProduct.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items.push(action.payload); 
      })
      .addCase(saveProduct.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default productsSlice.reducer;