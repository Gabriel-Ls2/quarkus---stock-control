import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../store/productsSlice";
import { useNavigate } from "react-router-dom";
import { 
  Container, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Typography, CircularProgress, Alert, 
  Button, Box 
} from "@mui/material";

function Products() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { items, status, error } = useSelector((state) => state.products);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      
      {/* HEADER (Title + Button) */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="div" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
          Lista de Produtos 
        </Typography>

        <Button variant="contained" onClick={() => navigate('/products/new')}>
          + Novo Produto
        </Button>
      </Box>

      {/* LOADING STATES */}
      {status === 'loading' && <CircularProgress />}
      {status === 'failed' && <Alert severity="error">{error}</Alert>}

      {/* TABLE */}
      {status === 'succeeded' && (
        <TableContainer component={Paper} elevation={3}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead sx={{ bgcolor: '#f5f5f5' }}>
              <TableRow>
                <TableCell><strong>ID</strong></TableCell>
                <TableCell><strong>Nome do Produto</strong></TableCell>
                <TableCell align="right"><strong>Preço Unitário</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((product) => (
                <TableRow
                  key={product.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {product.id}
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell align="right">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                  </TableCell>
                </TableRow>
              ))}
              {items.length === 0 && (
                 <TableRow>
                   <TableCell colSpan={3} align="center">Nenhum produto cadastrado.</TableCell>
                 </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}

export default Products;