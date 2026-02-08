import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../api/api';

// GET: Listar
export const fetchMaterials = createAsyncThunk('materials/fetchAll', async () => {
  const response = await api.get('/raw-materials');
  return response.data;
});

// POST: Criar
export const addMaterial = createAsyncThunk('materials/add', async (material) => {
  const response = await api.post('/raw-materials', material);
  return response.data;
});

// DELETE: Deletar
export const deleteMaterial = createAsyncThunk('materials/delete', async (id) => {
  await api.delete(`/raw-materials/${id}`);
  return id; 
});

const materialsSlice = createSlice({
  name: 'materials',
  initialState: { items: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMaterials.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(addMaterial.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(deleteMaterial.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

export default materialsSlice.reducer;