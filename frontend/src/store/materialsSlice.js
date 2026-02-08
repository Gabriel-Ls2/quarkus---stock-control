import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../api/api';

// GET: List
export const fetchMaterials = createAsyncThunk('materials/fetchAll', async () => {
  const response = await api.get('/raw-materials');
  return response.data;
});

// POST: Create
export const addMaterial = createAsyncThunk('materials/add', async (material) => {
  const response = await api.post('/raw-materials', material);
  return response.data;
});
// DELETE: Excluir
export const deleteMaterial = createAsyncThunk('materials/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/raw-materials/${id}`);
    return id;
  } catch (error) {
    // Returns error message if material is currently in use
    return rejectWithValue(error.response?.data || "Não é possível excluir: Material em uso por um produto.");
  }
});

const materialsSlice = createSlice({
  name: 'materials',
  initialState: { items: [], status: 'idle', error: null },
  reducers: {
    // Clear the error after the user reads it
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMaterials.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(addMaterial.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // DELETED SUCCESSFULLY
      .addCase(deleteMaterial.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
        state.error = null; 
      })
      // DELETION FAILED
      .addCase(deleteMaterial.rejected, (state, action) => {
        state.error = "Erro: Este material provavelmente está vinculado a um produto e não pode ser excluído.";
      });
  },
});

export const { clearError } = materialsSlice.actions;
export default materialsSlice.reducer;