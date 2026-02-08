import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../api/api';

// fetch backend suggestion
export const fetchProductionSuggestion = createAsyncThunk(
  'planning/fetchSuggestion',
  async () => {
    const response = await api.get('/production/suggestion');
    return response.data;
  }
);

const planningSlice = createSlice({
  name: 'planning',
  initialState: {
    products: [],    
    totalValue: 0,     
    status: 'idle',   
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductionSuggestion.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProductionSuggestion.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Maps exactly to your Java DTO JSON
        state.products = action.payload.products || [];
        state.totalValue = action.payload.totalValue || 0;
      })
      .addCase(fetchProductionSuggestion.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default planningSlice.reducer;