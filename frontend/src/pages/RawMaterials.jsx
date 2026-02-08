import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMaterials, addMaterial, deleteMaterial } from '../store/materialsSlice';
import { 
  Container, Typography, TextField, Button, Grid, Paper, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  IconButton, Alert 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete'; 

export default function RawMaterials() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.materials);

  // Form states
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [stock, setStock] = useState('');

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchMaterials());
    }
  }, [status, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code && name && stock) {
      // sends the JSON object exactly as Java expects
      dispatch(addMaterial({ 
        code: code,
        name: name, 
        stockQuantity: parseInt(stock) 
      }));
      // clean the fields 
      setCode('');
      setName('');
      setStock('');
    } else {
      alert("Preencha todos os campos!");
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Tem certeza que deseja excluir?")) {
      dispatch(deleteMaterial(id));
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#1976d2', fontWeight: 'bold' }}>
        Matérias-Primas 
      </Typography>

      {/* Registration Form */}
      <Paper elevation={3} sx={{ p: 3, mb: 4, bgcolor: '#f8f9fa' }}>
        <Typography variant="h6" gutterBottom>Nova Matéria-Prima</Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} alignItems="center">
            
            <Grid item xs={3}>
              <TextField 
                label="Código" 
                fullWidth size="small"
                value={code} onChange={(e) => setCode(e.target.value)} 
                required
              />
            </Grid>
            
            <Grid item xs={5}>
              <TextField 
                label="Nome (ex: Madeira)" 
                fullWidth size="small"
                value={name} onChange={(e) => setName(e.target.value)} 
                required
              />
            </Grid>
            
            <Grid item xs={2}>
              <TextField 
                label="Qtd" 
                type="number" 
                fullWidth size="small"
                value={stock} onChange={(e) => setStock(e.target.value)} 
                required
              />
            </Grid>
            
            <Grid item xs={2}>
              <Button type="submit" variant="contained" fullWidth color="success">
                Salvar
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Listing Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: '#eee' }}>
            <TableRow>
              <TableCell><strong>Código</strong></TableCell>
              <TableCell><strong>Nome</strong></TableCell>
              <TableCell align="center"><strong>Estoque</strong></TableCell>
              <TableCell align="center"><strong>Ações</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((m) => (
              <TableRow key={m.id}>
                <TableCell>{m.code}</TableCell>
                <TableCell>{m.name}</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                  {m.stockQuantity}
                </TableCell>
                <TableCell align="center">
                  <IconButton color="error" onClick={() => handleDelete(m.id)}>
                     <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">Nenhum material cadastrado.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}