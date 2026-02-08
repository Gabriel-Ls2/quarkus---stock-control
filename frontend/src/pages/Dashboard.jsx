import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductionSuggestion } from '../store/planningSlice';
import { 
  Container, Grid, Card, CardContent, Typography, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  CircularProgress, Alert, Box
} from '@mui/material';

// Function to format currency (BRL)
const formatCurrency = (value) => {
  if (value === null || value === undefined) return 'R$ 0,00';
  const numberValue = typeof value === 'string' ? parseFloat(value) : value;
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(numberValue);
};

export default function Dashboard() {
  const dispatch = useDispatch();
  const { products, totalValue, status, error } = useSelector((state) => state.planning);

  useEffect(() => {
    dispatch(fetchProductionSuggestion());
  }, [dispatch]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          Planejamento de Produção 
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Otimização baseada no estoque atual e valor de venda.
        </Typography>
      </Box>

      {status === 'loading' && <CircularProgress />}
      {status === 'failed' && <Alert severity="error">Erro ao conectar com o servidor: {error}</Alert>}

      {status === 'succeeded' && (
        <Grid container spacing={3}>
          {/* TOTAL VALUE CARD */}
          <Grid item xs={12}>
            <Card sx={{ bgcolor: '#e3f2fd', borderLeft: '6px solid #1976d2' }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Receita Potencial Total
                </Typography>
                <Typography variant="h3" component="div" sx={{ fontWeight: 'bold' }}>
                  {formatCurrency(totalValue)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* SUGGESTIONS TABLE */}
          <Grid item xs={12}>
            <TableContainer component={Paper} elevation={3}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                  <TableRow>
                    <TableCell><strong>Produto</strong></TableCell>
                    <TableCell align="right"><strong>Qtd. Sugerida</strong></TableCell>
                    <TableCell align="right"><strong>Preço Unit.</strong></TableCell>
                    <TableCell align="right"><strong>Total do Lote</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.length > 0 ? (
                    products.map((row) => (
                      <TableRow key={row.productId} hover>
                        <TableCell component="th" scope="row">
                          {row.productName}
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold', color: 'green', fontSize: '1.1rem' }}>
                          {row.quantity}
                        </TableCell>
                        <TableCell align="right">{formatCurrency(row.unitPrice)}</TableCell>
                        <TableCell align="right">{formatCurrency(row.totalValue)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                        <Typography variant="body1" color="textSecondary">
                          Nenhum produto pode ser fabricado com o estoque atual.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}