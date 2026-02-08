import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveProduct } from '../store/productsSlice';
import { fetchMaterials } from '../store/materialsSlice';
import { api } from '../api/api'; 

import {
  Container, Paper, Typography, TextField, Button, Grid, Box,
  Select, MenuItem, InputLabel, FormControl,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function ProductForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Redux Data (Raw materials for the dropdown)
  const materials = useSelector((state) => state.materials.items);
  const { status } = useSelector((state) => state.products);

  // Product state
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  // Composition State (Local ingredients)
  const [composition, setComposition] = useState([]);
  const [selectedMatId, setSelectedMatId] = useState('');
  const [quantity, setQuantity] = useState('');

  useEffect(() => {
    // Loads raw materials when the screen opens
    dispatch(fetchMaterials());
  }, [dispatch]);

  // Adds ingredient to the TEMPORARY list (UI only)
  const handleAddIngredient = () => {
    if (!selectedMatId || !quantity) return;

    const materialObj = materials.find(m => m.id === selectedMatId);
    
    // add on list
    setComposition([
      ...composition, 
      { 
        rawMaterial: materialObj, 
        requiredQuantity: parseInt(quantity) 
      }
    ]);

    // Clears the selection fields
    setSelectedMatId('');
    setQuantity('');
  };

  const handleRemoveIngredient = (index) => {
    const newList = [...composition];
    newList.splice(index, 1);
    setComposition(newList);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // save the principal product
      const productPayload = { code, name, price: parseFloat(price) };
      // unwrap() allows getting the return value (with the generated ID) immediately
      const newProduct = await dispatch(saveProduct(productPayload)).unwrap(); 

      console.log("Produto criado com ID:", newProduct.id);

      // Sends a POST request for each ingredient in the list
      for (const item of composition) {
        await api.post('/product-raw-materials', {
          product: { id: newProduct.id },  
          rawMaterial: { id: item.rawMaterial.id },
          requiredQuantity: item.requiredQuantity
        });
      }

      alert('Produto e Receita salvos com sucesso!');
      navigate('/products');

    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar produto. Verifique o console.");
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          Novo Produto 
        </Typography>

        <form onSubmit={handleSubmit}>
          {/* PRODUCT DATA */}
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <TextField label="Código" fullWidth required
                value={code} onChange={e => setCode(e.target.value)} />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Nome do Produto" fullWidth required
                value={name} onChange={e => setName(e.target.value)} />
            </Grid>
            <Grid item xs={3}>
              <TextField label="Preço (R$)" type="number" fullWidth required
                value={price} onChange={e => setPrice(e.target.value)} />
            </Grid>
          </Grid>

          {/* COMPOSITION AREA */}
          <Box sx={{ mt: 4, mb: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>Composição (Receita)</Typography>
            
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Matéria-Prima</InputLabel>
                  <Select
                    value={selectedMatId}
                    label="Matéria-Prima"
                    onChange={e => setSelectedMatId(e.target.value)}
                  >
                    {materials.map((m) => (
                      <MenuItem key={m.id} value={m.id}>
                        {m.name} (Estoque: {m.stockQuantity})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <TextField 
                  label="Qtd Necessária" type="number" fullWidth size="small"
                  value={quantity} onChange={e => setQuantity(e.target.value)} 
                />
              </Grid>
              <Grid item xs={3}>
                <Button variant="contained" onClick={handleAddIngredient} fullWidth>
                  Adicionar
                </Button>
              </Grid>
            </Grid>

            {/* Ingredients Visual List */}
            {composition.length > 0 && (
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Material</TableCell>
                      <TableCell align="center">Qtd</TableCell>
                      <TableCell align="center">Ação</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {composition.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.rawMaterial.name}</TableCell>
                        <TableCell align="center">{item.requiredQuantity}</TableCell>
                        <TableCell align="center">
                          <IconButton size="small" color="error" onClick={() => handleRemoveIngredient(index)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>

          <Button 
            type="submit" 
            variant="contained" 
            color="success" 
            size="large" 
            fullWidth
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Salvando...' : 'Salvar Produto Completo'}
          </Button>
        </form>
      </Paper>
    </Container>
  );
}